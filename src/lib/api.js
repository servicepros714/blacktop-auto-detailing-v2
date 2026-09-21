import { BUSINESS } from '../config/business'

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
export const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''

// With placeholder env values the site runs in demo mode so it can be clicked through.
export const isDemoApi = !API || API.includes('REPLACE')
export const isDemoStripe = !STRIPE_PK || STRIPE_PK.includes('REPLACE')

async function request(path, { method = 'GET', body } = {}) {
  let res
  try {
    res = await fetch(`${API}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw Object.assign(new Error('Could not reach the booking server. Check your connection and try again.'), {
      code: 'network',
    })
  }
  let data = null
  try {
    data = await res.json()
  } catch {
    /* non-JSON error body */
  }
  if (!res.ok) {
    const err = new Error(data?.error || 'Something went wrong. Please try again.')
    err.status = res.status
    err.code = data?.code
    throw err
  }
  return data
}

// -> { "2026-10-02": ["9:00 AM", ...] }
export async function getAvailability(start, end) {
  if (isDemoApi) return {}
  const data = await request(`/api/availability?start=${start}&end=${end}`)
  return data.booked || {}
}

export function createPaymentIntent(payload) {
  return request('/api/create-payment-intent', { method: 'POST', body: payload })
}

export function createBooking(payload) {
  if (isDemoApi) {
    return Promise.resolve({
      id: `${BUSINESS.bookingPrefix}DEMO`,
      payment_status: payload.payLater ? 'Pay Later' : 'Paid',
      demo: true,
    })
  }
  return request('/api/bookings', { method: 'POST', body: payload })
}
