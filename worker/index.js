// Blacktop Auto Detailing — Cloudflare Worker (D1 + Stripe PaymentIntents)
//
// Bindings / secrets (set in the Cloudflare dashboard):
//   DB                D1 database binding (shared bookings table)
//   STRIPE_SECRET_KEY Worker secret (sk_test_... / sk_live_...)
//   ADMIN_TOKEN       optional secret; when set, GET/PATCH /bookings need "Authorization: Bearer <token>"
//   ALLOWED_ORIGIN    optional; defaults to "*"

const SOURCE = 'blacktop'
const PREFIX = 'BLK-'

const SERVICES = {
  basic: { name: 'Basic Detail', price: 150 },
  premium: { name: 'Premium Detail', price: 200 },
  exterior: { name: 'Exterior Wash', price: 50 },
}
const COUPONS = { PREPAY: 15 }

// Slots: 7:00 AM - 7:00 PM, every 30 minutes, Mon-Sun. Stored as "9:30 AM".
// Bookings need at least LEAD_MINUTES notice on California time.
const LEAD_MINUTES = 240
const SLOTS = (() => {
  const out = []
  for (let t = 7 * 60; t <= 19 * 60; t += 30) {
    const h24 = Math.floor(t / 60)
    const m = t % 60
    out.push(`${h24 % 12 === 0 ? 12 : h24 % 12}:${String(m).padStart(2, '0')} ${h24 >= 12 ? 'PM' : 'AM'}`)
  }
  return out
})()

// Fields the shared admin dashboard is allowed to update.
const PATCHABLE = new Set([
  'status',
  'payment_status',
  'date',
  'time',
  'service',
  'name',
  'phone',
  'email',
  'address',
  'vehicle',
  'notes',
  'notes2',
  'reschedule_date',
  'reschedule_time',
  'original_date',
  'original_time',
])

const CREATE_TABLE =
  `CREATE TABLE IF NOT EXISTS bookings (
    id TEXT PRIMARY KEY,
    date TEXT, time TEXT, service TEXT, name TEXT, phone TEXT, email TEXT,
    vehicle TEXT, address TEXT, notes TEXT, source TEXT, created_at TEXT,
    status TEXT, reschedule_date TEXT, reschedule_time TEXT, notes2 TEXT,
    original_date TEXT, original_time TEXT, payment_status TEXT
  )`.replace(/\s+/g, ' ').trim()

const CREATE_INDEX =
  'CREATE INDEX IF NOT EXISTS idx_bookings_source_date ON bookings (source, date)'

let schemaReady = false
async function ensureSchema(db) {
  if (schemaReady) return
  await db.exec(CREATE_TABLE)
  await db.exec(CREATE_INDEX)
  schemaReady = true
}

// The shared table can be TEXT id (generated here) or INTEGER autoincrement depending on which
// account's database it lives in. Detect it once and behave accordingly.
let idMode = null
async function getIdMode(db) {
  if (idMode) return idMode
  const { results } = await db.prepare('PRAGMA table_info(bookings)').all()
  const col = (results || []).find((c) => c.name === 'id')
  idMode = col && /INT/i.test(col.type || '') ? 'int' : 'text'
  return idMode
}

function newTextId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(6))
  return PREFIX + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('')
}

function corsHeaders(env) {
  return {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

function json(env, body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(env) },
  })
}

class HttpError extends Error {
  constructor(status, message, code) {
    super(message)
    this.status = status
    this.code = code
  }
}

// ---------- validation ----------

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function todayLA() {
  const p = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
  return p // en-CA gives YYYY-MM-DD
}

function nowMinutesLA() {
  const p = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t) => Number(p.find((x) => x.type === t).value)
  return get('hour') * 60 + get('minute')
}

function slotMinutes(label) {
  const [t, sfx] = label.split(' ')
  const [h, m] = t.split(':').map(Number)
  return (h % 12) * 60 + (sfx === 'PM' ? 720 : 0) + m
}

function checkServices(list) {
  if (!Array.isArray(list) || list.length === 0) throw new HttpError(400, 'Choose at least one service.', 'services')
  const ids = [...new Set(list)]
  if (ids.some((id) => !SERVICES[id])) throw new HttpError(400, 'Unknown service selected.', 'services')
  if (ids.includes('basic') && ids.includes('premium'))
    throw new HttpError(400, 'Choose either the Basic or the Premium Detail, not both.', 'services')
  return ids
}

function subtotal(ids) {
  return ids.reduce((sum, id) => sum + SERVICES[id].price, 0)
}

function discountFor(code, sub) {
  const off = COUPONS[String(code || '').trim().toUpperCase()]
  return off ? Math.min(off, sub) : 0
}

// enforceLead is false when finalizing a booking that is already paid, so a customer
// who paid just before the cutoff is never rejected after their card was charged.
function checkSlot(date, time, enforceLead = true) {
  if (!ISO_DATE.test(date || '')) throw new HttpError(400, 'Pick a valid date.', 'date')
  if (!SLOTS.includes(time)) throw new HttpError(400, 'Pick a valid time.', 'time')
  if (date < todayLA()) throw new HttpError(400, 'That date has already passed.', 'date')
  if (enforceLead && date === todayLA() && slotMinutes(time) < nowMinutesLA() + LEAD_MINUTES)
    throw new HttpError(400, 'That time is too soon. Please pick a later time.', 'time')
}

function checkContact(b) {
  const clean = (v) => String(v || '').trim()
  const out = {
    name: clean(b.name),
    phone: clean(b.phone),
    email: clean(b.email),
    vehicle: clean(b.vehicle),
    address: clean(b.address),
  }
  if (out.name.length < 2) throw new HttpError(400, 'Enter your full name.', 'name')
  if (out.phone.replace(/\D/g, '').length < 10) throw new HttpError(400, 'Enter a valid phone number.', 'phone')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) throw new HttpError(400, 'Enter a valid email address.', 'email')
  if (out.vehicle.length < 3) throw new HttpError(400, 'Enter your vehicle (year, make, model).', 'vehicle')
  if (out.address.length < 6) throw new HttpError(400, 'Enter the address where we should meet you.', 'address')
  return out
}

// ---------- D1 helpers ----------

async function slotTaken(db, date, time) {
  const row = await db
    .prepare(
      `SELECT COUNT(*) AS n FROM bookings
       WHERE source = ? AND date = ? AND time = ?
       AND LOWER(COALESCE(status, '')) NOT IN ('cancelled', 'canceled')`,
    )
    .bind(SOURCE, date, time)
    .first()
  return (row?.n || 0) > 0
}

async function findByPaymentIntent(db, piId) {
  return db
    .prepare('SELECT * FROM bookings WHERE source = ? AND notes LIKE ? LIMIT 1')
    .bind(SOURCE, `%${piId}%`)
    .first()
}

function displayId(row, mode) {
  if (mode === 'int' && !String(row.id).startsWith(PREFIX)) return `${PREFIX}${row.id}`
  return String(row.id)
}

// ---------- Stripe ----------

async function stripe(env, method, path, params) {
  if (!env.STRIPE_SECRET_KEY) throw new HttpError(500, 'Payments are not configured yet.', 'stripe_config')
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`,
      ...(params ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
    },
    body: params ? new URLSearchParams(params) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new HttpError(502, data?.error?.message || 'Payment provider error.', 'stripe')
  return data
}

// ---------- routes ----------

async function availability(env, url) {
  const start = url.searchParams.get('start')
  const end = url.searchParams.get('end')
  if (!ISO_DATE.test(start || '') || !ISO_DATE.test(end || '')) throw new HttpError(400, 'start and end are required (YYYY-MM-DD).')
  await ensureSchema(env.DB)
  const { results } = await env.DB
    .prepare(
      `SELECT date, time FROM bookings
       WHERE source = ? AND date >= ? AND date <= ?
       AND LOWER(COALESCE(status, '')) NOT IN ('cancelled', 'canceled')`,
    )
    .bind(SOURCE, start, end)
    .all()
  const booked = {}
  for (const r of results || []) (booked[r.date] ||= []).push(r.time)
  return json(env, { booked })
}

async function createPaymentIntent(env, request) {
  // Deliberately no ensureSchema here: card payments must never depend on D1 being healthy.
  const b = await request.json()
  const ids = checkServices(b.services)
  checkSlot(b.date, b.time)
  const sub = subtotal(ids)
  const discount = discountFor(b.coupon, sub)
  const amount = (sub - discount) * 100

  if (env.DB) {
    try {
      await ensureSchema(env.DB)
      if (await slotTaken(env.DB, b.date, b.time))
        throw new HttpError(409, 'That time was just booked. Please pick another time.', 'slot_taken')
    } catch (e) {
      if (e instanceof HttpError) throw e
      // D1 hiccup: let payment proceed, the booking step re-checks.
    }
  }

  const params = {
    amount: String(amount),
    currency: 'usd',
    'automatic_payment_methods[enabled]': 'true',
    description: `Blacktop Auto Detailing - ${ids.map((id) => SERVICES[id].name).join(' + ')}`,
    'metadata[source]': SOURCE,
    'metadata[services]': ids.join(','),
    'metadata[date]': b.date,
    'metadata[time]': b.time,
    'metadata[coupon]': discount ? String(b.coupon).trim().toUpperCase() : '',
    'metadata[customer]': String(b.name || '').slice(0, 100),
  }
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email || '')) params.receipt_email = b.email

  const pi = await stripe(env, 'POST', '/payment_intents', params)
  return json(env, { clientSecret: pi.client_secret, paymentIntentId: pi.id, amount })
}

async function createBooking(env, request) {
  const b = await request.json()
  const ids = checkServices(b.services)
  checkSlot(b.date, b.time, !!b.payLater)
  const contact = checkContact(b)
  const sub = subtotal(ids)

  await ensureSchema(env.DB)
  const mode = await getIdMode(env.DB)

  let paymentStatus = 'Pay Later'
  let coupon = ''
  let total = sub
  let piId = ''

  if (!b.payLater) {
    piId = String(b.paymentIntentId || '')
    if (!piId.startsWith('pi_')) throw new HttpError(400, 'Missing payment confirmation.', 'payment')
    const pi = await stripe(env, 'GET', `/payment_intents/${encodeURIComponent(piId)}`)
    if (pi.metadata?.source !== SOURCE) throw new HttpError(400, 'Payment does not match this business.', 'payment')
    if (pi.status !== 'succeeded') throw new HttpError(402, 'Payment has not completed.', 'payment')
    coupon = pi.metadata?.coupon || ''
    total = sub - discountFor(coupon, sub)
    if (pi.amount !== total * 100) throw new HttpError(400, 'Payment amount does not match the selected services.', 'payment')
    paymentStatus = 'Paid'

    // Idempotent: a refresh or retry after a successful save returns the same booking.
    const existing = await findByPaymentIntent(env.DB, piId)
    if (existing) return json(env, { id: displayId(existing, mode), payment_status: 'Paid', total, existing: true })
  }

  if (await slotTaken(env.DB, b.date, b.time)) {
    if (piId) {
      try {
        await stripe(env, 'POST', '/refunds', { payment_intent: piId })
      } catch {
        throw new HttpError(409, 'That time was just booked and we could not refund automatically. Please call us.', 'slot_taken_refund_failed')
      }
      throw new HttpError(409, 'That time was just booked by someone else, so your payment has been refunded. Please pick another time.', 'slot_taken_refunded')
    }
    throw new HttpError(409, 'That time was just booked. Please pick another time.', 'slot_taken')
  }

  const notes = [
    piId ? `Stripe PI: ${piId}` : '',
    `Total $${total}`,
    coupon ? `Coupon ${coupon}` : '',
  ].filter(Boolean).join(' | ')

  const serviceLabel = ids.map((id) => SERVICES[id].name).join(' + ')
  const createdAt = new Date().toISOString()
  const cols = ['date', 'time', 'service', 'name', 'phone', 'email', 'vehicle', 'address', 'notes', 'source', 'created_at', 'status', 'payment_status']
  const vals = [b.date, b.time, serviceLabel, contact.name, contact.phone, contact.email, contact.vehicle, contact.address, notes, SOURCE, createdAt, 'confirmed', paymentStatus]

  let id
  if (mode === 'text') {
    id = newTextId()
    cols.unshift('id')
    vals.unshift(id)
  }
  const result = await env.DB
    .prepare(`INSERT INTO bookings (${cols.join(', ')}) VALUES (${cols.map(() => '?').join(', ')})`)
    .bind(...vals)
    .run()
  if (mode === 'int') id = `${PREFIX}${result.meta.last_row_id}`

  return json(env, { id, payment_status: paymentStatus, total }, 201)
}

function requireAdmin(env, request) {
  if (!env.ADMIN_TOKEN) return
  if (request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`) throw new HttpError(401, 'Unauthorized.')
}

async function listBookings(env, request) {
  requireAdmin(env, request)
  await ensureSchema(env.DB)
  const mode = await getIdMode(env.DB)
  const { results } = await env.DB
    .prepare('SELECT * FROM bookings WHERE source = ? ORDER BY date DESC, time DESC')
    .bind(SOURCE)
    .all()
  return json(env, (results || []).map((r) => ({ ...r, id: displayId(r, mode) })))
}

async function patchBooking(env, request, rawId) {
  requireAdmin(env, request)
  await ensureSchema(env.DB)
  const mode = await getIdMode(env.DB)
  const body = await request.json()
  const entries = Object.entries(body || {}).filter(([k]) => PATCHABLE.has(k))
  if (!entries.length) throw new HttpError(400, 'No updatable fields supplied.')
  const idValue = mode === 'int' ? Number(String(rawId).replace(/^[A-Za-z]+-/, '')) : rawId
  const sets = entries.map(([k]) => `${k} = ?`).join(', ')
  const result = await env.DB
    .prepare(`UPDATE bookings SET ${sets} WHERE id = ? AND source = ?`)
    .bind(...entries.map(([, v]) => (v == null ? null : String(v))), idValue, SOURCE)
    .run()
  if (!result.meta.changes) throw new HttpError(404, 'Booking not found.')
  return json(env, { ok: true, id: rawId })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(env) })
    const url = new URL(request.url)
    // Accept both /api/xyz and /xyz
    const path = url.pathname.replace(/^\/api(?=\/|$)/, '').replace(/\/+$/, '') || '/'
    try {
      if (path === '/health') return json(env, { ok: true, source: SOURCE })
      if (path === '/availability' && request.method === 'GET') return await availability(env, url)
      if (path === '/create-payment-intent' && request.method === 'POST') return await createPaymentIntent(env, request)
      if (path === '/bookings' && request.method === 'POST') return await createBooking(env, request)
      if (path === '/bookings' && request.method === 'GET') return await listBookings(env, request)
      const m = path.match(/^\/bookings\/([^/]+)$/)
      if (m && request.method === 'PATCH') return await patchBooking(env, request, decodeURIComponent(m[1]))
      return json(env, { error: 'Not found' }, 404)
    } catch (e) {
      if (e instanceof HttpError) return json(env, { error: e.message, code: e.code }, e.status)
      console.error(e)
      return json(env, { error: 'Server error. Please try again.' }, 500)
    }
  },
}
