import {
  SLOT_START_MIN,
  SLOT_END_MIN,
  SLOT_STEP_MIN,
  LEAD_MINUTES,
} from '../config/business'

const pad = (n) => String(n).padStart(2, '0')

export const toISO = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`

export function minutesToLabel(total) {
  const h24 = Math.floor(total / 60)
  const m = total % 60
  const suffix = h24 >= 12 ? 'PM' : 'AM'
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h12}:${pad(m)} ${suffix}`
}

export function labelToMinutes(label) {
  const [time, suffix] = label.split(' ')
  const [h, m] = time.split(':').map(Number)
  let h24 = h % 12
  if (suffix === 'PM') h24 += 12
  return h24 * 60 + m
}

export const SLOTS = (() => {
  const out = []
  for (let t = SLOT_START_MIN; t <= SLOT_END_MIN; t += SLOT_STEP_MIN) out.push(minutesToLabel(t))
  return out
})()

// "Now" in the business's timezone, so a visitor's laptop clock/timezone can't skew slots.
export function nowLA() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Los_Angeles',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (type) => Number(parts.find((p) => p.type === type).value)
  const y = get('year')
  const m = get('month') - 1
  const d = get('day')
  return { y, m, d, minutes: get('hour') * 60 + get('minute'), iso: toISO(y, m, d) }
}

export function parseISO(iso) {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDaysISO(iso, days) {
  const dt = parseISO(iso)
  dt.setDate(dt.getDate() + days)
  return toISO(dt.getFullYear(), dt.getMonth(), dt.getDate())
}

export function isSlotPast(iso, label, now = nowLA()) {
  if (iso < now.iso) return true
  if (iso > now.iso) return false
  return labelToMinutes(label) < now.minutes + LEAD_MINUTES
}

export function formatLong(iso) {
  return parseISO(iso).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShort(iso) {
  return parseISO(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function monthTitle(y, m) {
  return new Date(y, m, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}
