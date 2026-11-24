import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Check, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import { SERVICES, BOOKING_WINDOW_DAYS } from '../config/business'
import { getAvailability } from '../lib/api'
import { SLOTS, nowLA, toISO, addDaysISO, isSlotPast, formatLong, formatShort, monthTitle, parseISO } from '../lib/dates'
import { loadDraft, saveDraft, clearDone, toggleService, subtotalFor, labelFor, money } from '../lib/booking'

const STEP_LABELS = ['Service', 'Date & time', 'Your details']
const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatPhone(value) {
  const d = value.replace(/\D/g, '').slice(0, 10)
  if (d.length < 4) return d
  if (d.length < 7) return `(${d.slice(0, 3)}) ${d.slice(3)}`
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
}

const FIELDS = [
  { key: 'name', label: 'Full name', type: 'text', auto: 'name', placeholder: 'Jane Rivera' },
  { key: 'phone', label: 'Phone', type: 'tel', auto: 'tel', placeholder: '(714) 555-0123', mode: 'tel' },
  { key: 'email', label: 'Email', type: 'email', auto: 'email', placeholder: 'you@example.com' },
  { key: 'vehicle', label: 'Vehicle (year, make, model)', type: 'text', auto: 'off', placeholder: '2021 Tesla Model Y' },
  { key: 'address', label: 'Address where we should meet you', type: 'text', auto: 'street-address', placeholder: 'Street, city', wide: true },
]

function validate(form) {
  const e = {}
  if (form.name.trim().length < 2) e.name = 'Enter your full name.'
  if (form.phone.replace(/\D/g, '').length < 10) e.phone = 'Enter a 10-digit phone number.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = 'Enter a valid email address.'
  if (form.vehicle.trim().length < 3) e.vehicle = 'Enter your vehicle, for example 2021 Tesla Model Y.'
  if (form.address.trim().length < 6) e.address = 'Enter the address where we should meet you.'
  return e
}

export default function Book() {
  const navigate = useNavigate()
  const location = useLocation()
  const now = useMemo(() => nowLA(), [])
  const maxISO = useMemo(() => addDaysISO(now.iso, BOOKING_WINDOW_DAYS), [now.iso])
  const draft = useMemo(() => loadDraft(), [])

  const draftSlotOk = draft?.date && draft?.time && !isSlotPast(draft.date, draft.time, now)

  const [step, setStep] = useState(location.state?.step || 1)
  // Landing pages link to /book?package=basic|premium to preselect a detail.
  const pkg = new URLSearchParams(location.search).get('package')
  const [services, setServices] = useState(
    pkg === 'basic' || pkg === 'premium' ? [pkg] : draft?.services || [],
  )
  const [addon, setAddon] = useState(false) // step 1 second screen: optional exterior wash
  const [date, setDate] = useState(draftSlotOk ? draft.date : null)
  const [time, setTime] = useState(draftSlotOk ? draft.time : null)
  const [form, setForm] = useState({
    name: draft?.name || '',
    phone: draft?.phone || '',
    email: draft?.email || '',
    vehicle: draft?.vehicle || '',
    address: draft?.address || '',
  })
  const [errors, setErrors] = useState({})
  const [view, setView] = useState(() => {
    const base = draftSlotOk ? parseISO(draft.date) : new Date(now.y, now.m, 1)
    return { y: base.getFullYear(), m: base.getMonth() }
  })
  const [bookedByMonth, setBookedByMonth] = useState({})
  const [loadingAvail, setLoadingAvail] = useState(false)

  const firstServiceRef = useRef(null)
  const slotsRef = useRef(null)
  const fieldRefs = useRef({})

  // Starting (or resuming) a booking invalidates any earlier confirmation screen.
  useEffect(() => {
    clearDone()
  }, [])

  // Keep the draft in sync so a refresh or trip to checkout and back keeps everything.
  useEffect(() => {
    saveDraft({ services, date, time, ...form })
  }, [services, date, time, form])

  // Load availability for the month on screen.
  useEffect(() => {
    if (step !== 2) return
    const start = toISO(view.y, view.m, 1)
    const end = toISO(view.y, view.m, new Date(view.y, view.m + 1, 0).getDate())
    const monthKey = start.slice(0, 7)
    let cancelled = false
    setLoadingAvail(true)
    getAvailability(start, end)
      .then((booked) => !cancelled && setBookedByMonth((prev) => ({ ...prev, [monthKey]: booked })))
      .catch(() => !cancelled && toast.error('Could not load open times. Refresh to try again.'))
      .finally(() => !cancelled && setLoadingAvail(false))
    return () => {
      cancelled = true
    }
  }, [step, view.y, view.m])

  const bookedFor = (iso) => bookedByMonth[iso.slice(0, 7)]?.[iso] || []
  const slotState = (iso, label) => {
    if (isSlotPast(iso, label, now)) return 'past'
    if (bookedFor(iso).includes(label)) return 'booked'
    return 'open'
  }
  const dayFull = (iso) => SLOTS.every((s) => slotState(iso, s) !== 'open')

  const total = subtotalFor(services)
  const detailName = services.includes('premium') ? 'Premium Detail' : 'Basic Detail'
  const exteriorService = SERVICES.find((s) => s.addon)

  function goBack() {
    if (step === 1 && addon) {
      setAddon(false)
      window.scrollTo(0, 0)
      return
    }
    if (step === 2) setAddon(true) // return to the add-on screen
    go(step - 1)
  }

  function renderService(s, ref) {
    const on = services.includes(s.id)
    return (
      <div key={s.id} className={`bk-svc ${on ? 'is-on' : ''}`}>
        <label className="bk-svc-row">
          <input
            type="checkbox"
            checked={on}
            onChange={() => setServices((cur) => toggleService(cur, s.id))}
            ref={ref}
          />
          <span className="bk-check" aria-hidden="true">
            <Check size={18} strokeWidth={3.5} />
          </span>
          <span className="bk-svc-main">
            <span className="bk-svc-name">{s.name}</span>
            <span className="bk-svc-blurb">{s.blurb}</span>
          </span>
          <span className="bk-svc-price">
            {s.addon ? '+' : ''}${s.price}
          </span>
        </label>
        <details className="bk-svc-more">
          <summary>What&rsquo;s included</summary>
          <ul>
            {s.features.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </details>
      </div>
    )
  }

  function go(n) {
    setStep(n)
    window.scrollTo(0, 0)
  }

  function pickDate(iso) {
    setDate(iso)
    if (time && slotState(iso, time) !== 'open') setTime(null)
    if (window.matchMedia('(max-width: 820px)').matches) {
      setTimeout(() => slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
    }
  }

  function next() {
    if (step === 1) {
      if (!addon) {
        if (!services.some((id) => id === 'basic' || id === 'premium')) {
          toast.error('Choose a Basic or Premium detail to continue.')
          firstServiceRef.current?.focus()
          return
        }
        setAddon(true)
        window.scrollTo(0, 0)
        return
      }
      return go(2)
    }
    if (step === 2) {
      if (!date) return toast.error('Pick a date to continue.')
      if (!time) return toast.error('Pick a time to continue.')
      return go(3)
    }
    const found = validate(form)
    setErrors(found)
    const firstBad = FIELDS.find((f) => found[f.key])
    if (firstBad) {
      toast.error(found[firstBad.key])
      fieldRefs.current[firstBad.key]?.focus()
      return
    }
    saveDraft({ services, date, time, ...form })
    navigate('/checkout')
  }

  function setField(key, value) {
    setForm((f) => ({ ...f, [key]: key === 'phone' ? formatPhone(value) : value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }))
  }

  // Calendar cells
  const firstDow = new Date(view.y, view.m, 1).getDay()
  const daysInMonth = new Date(view.y, view.m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(toISO(view.y, view.m, d))
  const canPrev = !(view.y === now.y && view.m === now.m)
  const nextMonth = new Date(view.y, view.m + 1, 1)
  const canNext = toISO(nextMonth.getFullYear(), nextMonth.getMonth(), 1) <= maxISO
  const shiftMonth = (delta) =>
    setView((v) => {
      const d = new Date(v.y, v.m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })

  return (
    <main className="bk">
      <header className="bk-head">
        <div className="wrap">
          <h1>Book your detail</h1>
          <ol className="bk-progress" aria-label="Booking steps">
            {STEP_LABELS.map((label, i) => {
              const n = i + 1
              const state = n === step ? 'is-current' : n < step ? 'is-done' : ''
              return (
                <li key={label} className={state} aria-current={n === step ? 'step' : undefined}>
                  <span className="bk-node">{n < step ? <Check size={16} strokeWidth={3.5} /> : n}</span>
                  <span className="bk-step-label">{label}</span>
                </li>
              )
            })}
          </ol>
        </div>
      </header>

      <div className="bk-panel wrap">
        {step > 1 && (
          <p className="bk-recap">
            <span>{labelFor(services)}</span>
            {step === 3 && date && time && (
              <span>
                {formatShort(date)} at {time}
              </span>
            )}
          </p>
        )}

        {step === 1 && !addon && (
          <fieldset className="bk-fieldset">
            <legend>Choose your detail</legend>
            <p className="bk-hint">
              Pick a Basic or Premium interior detail. You can add an exterior wash on the next screen.
            </p>
            {SERVICES.filter((s) => !s.addon).map((s, i) => renderService(s, i === 0 ? firstServiceRef : null))}
          </fieldset>
        )}

        {step === 1 && addon && (
          <fieldset className="bk-fieldset">
            <legend>Add an exterior wash?</legend>
            <p className="bk-hint">
              Optional. Add a full hand wash and shine to your {detailName}. Leave it off to continue with interior only.
            </p>
            {renderService(exteriorService, firstServiceRef)}
          </fieldset>
        )}

        {step === 2 && (
          <div className="bk-dt">
            <section className="bk-cal" aria-label="Choose a date">
              <div className="bk-cal-head">
                <button type="button" className="bk-cal-nav" onClick={() => shiftMonth(-1)} disabled={!canPrev} aria-label="Previous month">
                  <ChevronLeft size={22} />
                </button>
                <h2 aria-live="polite">{monthTitle(view.y, view.m)}</h2>
                <button type="button" className="bk-cal-nav" onClick={() => shiftMonth(1)} disabled={!canNext} aria-label="Next month">
                  <ChevronRight size={22} />
                </button>
              </div>
              <div className="bk-cal-dow" aria-hidden="true">
                {DOW.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              <div className="bk-cal-grid">
                {cells.map((iso, i) => {
                  if (!iso) return <span key={`b${i}`} />
                  const disabled = iso < now.iso || iso > maxISO || dayFull(iso)
                  const selected = iso === date
                  return (
                    <button
                      key={iso}
                      type="button"
                      className={`bk-day ${selected ? 'is-selected' : ''} ${iso === now.iso ? 'is-today' : ''}`}
                      disabled={disabled}
                      aria-pressed={selected}
                      aria-label={formatLong(iso)}
                      onClick={() => pickDate(iso)}
                    >
                      {Number(iso.slice(8))}
                    </button>
                  )
                })}
              </div>
              <p className="bk-cal-note">{loadingAvail ? 'Checking availability…' : 'Struck-out days are fully booked or past.'}</p>
            </section>

            <section className="bk-slots" ref={slotsRef} aria-label="Choose a time">
              <h2>{date ? formatLong(date) : 'Open times'}</h2>
              {!date && <p className="bk-empty">Pick a date to see open times.</p>}
              {date && (
                <div className="bk-slot-grid">
                  {SLOTS.map((label) => {
                    const st = slotState(date, label)
                    return (
                      <button
                        key={label}
                        type="button"
                        className={`bk-slot ${time === label ? 'is-selected' : ''}`}
                        disabled={st !== 'open'}
                        aria-pressed={time === label}
                        onClick={() => setTime(label)}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              )}
            </section>
          </div>
        )}

        {step === 3 && (
          <fieldset className="bk-fieldset">
            <legend>Your details</legend>
            <div className="bk-form">
              {FIELDS.map((f) => (
                <div key={f.key} className={`bk-field ${f.wide ? 'is-wide' : ''}`}>
                  <label htmlFor={`f-${f.key}`}>{f.label}</label>
                  <input
                    id={`f-${f.key}`}
                    ref={(el) => (fieldRefs.current[f.key] = el)}
                    type={f.type}
                    inputMode={f.mode}
                    autoComplete={f.auto}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={(e) => setField(f.key, e.target.value)}
                    aria-invalid={errors[f.key] ? 'true' : undefined}
                    aria-describedby={errors[f.key] ? `e-${f.key}` : undefined}
                  />
                  {errors[f.key] && (
                    <p className="bk-error" id={`e-${f.key}`} role="alert">
                      {errors[f.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </fieldset>
        )}
      </div>

      <div className="bk-bar" role="group" aria-label="Booking navigation">
        <div className="bk-bar-inner wrap">
          <p className="bk-bar-total">
            <span>Total</span>
            <span className="bk-bar-amount">{services.length ? money(total) : '$0'}</span>
          </p>
          <div className="bk-bar-btns">
            {(step > 1 || addon) && (
              <button type="button" className="btn btn-ghost" onClick={goBack}>
                Back
              </button>
            )}
            <button type="button" className="btn btn-orange" onClick={next}>
              Continue
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}