import { SERVICES, COUPONS } from '../config/business'

const DRAFT = 'blk_draft'
const FINALIZE = 'blk_finalize'
const DONE = 'blk_done'

function read(key) {
  try {
    const raw = sessionStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
function write(key, value) {
  try {
    sessionStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode etc. */
  }
}
function clear(key) {
  try {
    sessionStorage.removeItem(key)
  } catch {
    /* noop */
  }
}

export const loadDraft = () => read(DRAFT)
export const saveDraft = (d) => write(DRAFT, d)
export const clearDraft = () => clear(DRAFT)
export const loadFinalize = () => read(FINALIZE)
export const saveFinalize = (f) => write(FINALIZE, f)
export const clearFinalize = () => clear(FINALIZE)
export const loadDone = () => read(DONE)
export const saveDone = (d) => write(DONE, d)
export const clearDone = () => clear(DONE)

export const findService = (id) => SERVICES.find((s) => s.id === id)

export function subtotalFor(ids) {
  return ids.reduce((sum, id) => sum + (findService(id)?.price || 0), 0)
}

export function labelFor(ids) {
  return ids
    .map((id) => findService(id)?.name)
    .filter(Boolean)
    .join(' + ')
}

// Keep selections in catalog order (Basic/Premium first, Exterior Wash last).
const sortIds = (ids) => SERVICES.map((s) => s.id).filter((id) => ids.includes(id))

// Basic and Premium are alternatives; Exterior Wash is independent.
export function toggleService(current, id) {
  if (current.includes(id)) return current.filter((x) => x !== id)
  if (id === 'basic') return sortIds([...current.filter((x) => x !== 'premium'), 'basic'])
  if (id === 'premium') return sortIds([...current.filter((x) => x !== 'basic'), 'premium'])
  return sortIds([...current, id])
}

export function couponDiscount(code, subtotal) {
  const c = COUPONS[String(code || '').trim().toUpperCase()]
  if (!c) return 0
  return Math.min(c.amount, subtotal)
}

export const money = (n) => `$${Number(n).toFixed(n % 1 === 0 ? 0 : 2)}`