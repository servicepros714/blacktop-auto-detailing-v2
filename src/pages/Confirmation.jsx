import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CheckCircle2, Phone, Loader2, TriangleAlert } from 'lucide-react'
import { BUSINESS } from '../config/business'
import { createBooking } from '../lib/api'
import { formatLong } from '../lib/dates'
import {
  loadDraft,
  loadFinalize,
  loadDone,
  saveDone,
  clearDraft,
  clearFinalize,
  subtotalFor,
  couponDiscount,
  labelFor,
  money,
} from '../lib/booking'

export default function Confirmation() {
  const navigate = useNavigate()
  const started = useRef(false)
  const [state, setState] = useState('loading') // loading | done | error
  const [booking, setBooking] = useState(null)
  const [error, setError] = useState('')
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    if (started.current && attempt === 0) return
    started.current = true

    const done = loadDone()
    if (done) {
      setBooking(done)
      setState('done')
      return
    }

    const draft = loadDraft()
    const fin = loadFinalize()
    if (!draft || !fin) {
      navigate('/', { replace: true })
      return
    }

    setState('loading')
    createBooking({
      services: draft.services,
      date: draft.date,
      time: draft.time,
      name: draft.name,
      phone: draft.phone,
      email: draft.email,
      vehicle: draft.vehicle,
      address: draft.address,
      payLater: !!fin.payLater,
      paymentIntentId: fin.paymentIntentId,
      coupon: fin.coupon,
    })
      .then((res) => {
        const subtotal = subtotalFor(draft.services)
        const total = res.total ?? (fin.payLater ? subtotal : subtotal - couponDiscount(fin.coupon, subtotal))
        const record = {
          id: res.id,
          paid: res.payment_status === 'Paid',
          total,
          service: labelFor(draft.services),
          date: draft.date,
          time: draft.time,
          name: draft.name,
          vehicle: draft.vehicle,
          address: draft.address,
        }
        saveDone(record)
        clearDraft()
        clearFinalize()
        setBooking(record)
        setState('done')
      })
      .catch((e) => {
        setError(e.message)
        setState('error')
      })
  }, [attempt, navigate])

  if (state === 'loading') {
    return (
      <main className="cf">
        <div className="cf-card cf-center">
          <Loader2 className="cf-spin" size={40} aria-hidden="true" />
          <h1>Confirming your booking&hellip;</h1>
          <p>Please keep this page open for a moment.</p>
        </div>
      </main>
    )
  }

  if (state === 'error') {
    return (
      <main className="cf">
        <div className="cf-card cf-center">
          <TriangleAlert size={40} className="cf-warn" aria-hidden="true" />
          <h1>We could not finish your booking</h1>
          <p role="alert">{error}</p>
          <div className="cf-actions">
            <button type="button" className="btn btn-orange" onClick={() => setAttempt((n) => n + 1)}>
              Try again
            </button>
            <a className="btn btn-outline-black" href={BUSINESS.phoneHref}>
              <Phone size={18} aria-hidden="true" />
              Call {BUSINESS.phone}
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="cf">
      <div className="cf-card">
        <div className="cf-hero">
          <CheckCircle2 size={44} aria-hidden="true" />
          <h1>You&rsquo;re booked, {booking.name.split(' ')[0]}</h1>
          <p className="cf-id">Booking ID {booking.id}</p>
        </div>

        <dl className="cf-list">
          <div>
            <dt>Service</dt>
            <dd>{booking.service}</dd>
          </div>
          <div>
            <dt>When</dt>
            <dd>
              {formatLong(booking.date)} at {booking.time}
            </dd>
          </div>
          <div>
            <dt>Vehicle</dt>
            <dd>{booking.vehicle}</dd>
          </div>
          <div>
            <dt>Where</dt>
            <dd>{booking.address}</dd>
          </div>
          <div>
            <dt>{booking.paid ? 'Paid' : 'Due after the detail'}</dt>
            <dd>{money(booking.total)}</dd>
          </div>
        </dl>

        <p className="cf-note">
          Need to change something? Call <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a> and give us your booking ID.
        </p>

        <div className="cf-actions">
          <Link className="btn btn-orange" to="/">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}
