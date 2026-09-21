import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, Lock, Tag, X } from 'lucide-react'
import { Elements, PaymentElement, ExpressCheckoutElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { STRIPE_PK, isDemoStripe, createPaymentIntent } from '../lib/api'
import { loadDraft, saveFinalize, subtotalFor, labelFor, couponDiscount, money } from '../lib/booking'
import { COUPONS } from '../config/business'

const stripePromise = isDemoStripe ? null : loadStripe(STRIPE_PK)

const APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#E45F00',
    colorText: '#141518',
    colorDanger: '#C62828',
    fontFamily: 'Manrope, system-ui, sans-serif',
    borderRadius: '8px',
  },
}

function PayForm({ draft, coupon, amount }) {
  const stripe = useStripe()
  const elements = useElements()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [slotTaken, setSlotTaken] = useState(false)
  const [expressReady, setExpressReady] = useState(false)

  async function run() {
    if (!stripe || !elements) return false
    setBusy(true)
    setError('')
    setSlotTaken(false)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setError(submitError.message || 'Check your payment details and try again.')
      setBusy(false)
      return false
    }

    try {
      const intent = await createPaymentIntent({
        services: draft.services,
        coupon,
        date: draft.date,
        time: draft.time,
        name: draft.name,
        email: draft.email,
      })
      // Saved first so a redirect-based payment method can still finish on /confirmation.
      saveFinalize({ paymentIntentId: intent.paymentIntentId, coupon })

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        clientSecret: intent.clientSecret,
        confirmParams: { return_url: `${window.location.origin}/confirmation` },
        redirect: 'if_required',
      })
      if (confirmError) {
        setError(confirmError.message || 'The payment did not go through. Try another card.')
        setBusy(false)
        return false
      }
      navigate('/confirmation')
      return true
    } catch (e) {
      setSlotTaken(e.code === 'slot_taken')
      setError(e.message)
      setBusy(false)
      return false
    }
  }

  return (
    <div className="co-form">
      <div className={expressReady ? 'co-express' : 'co-express is-empty'}>
        <ExpressCheckoutElement
          onReady={({ availablePaymentMethods }) => setExpressReady(!!availablePaymentMethods)}
          onConfirm={async (event) => {
            const ok = await run()
            if (!ok) event.paymentFailed?.({ reason: 'fail' })
          }}
        />
        {expressReady && <p className="co-or">or pay with card</p>}
      </div>

      <PaymentElement />

      {error && (
        <div className="co-error" role="alert">
          <p>{error}</p>
          {slotTaken && (
            <Link to="/book" state={{ step: 2 }}>
              Choose another time
            </Link>
          )}
        </div>
      )}

      <button type="button" className="btn btn-orange btn-lg co-pay" onClick={run} disabled={busy || !stripe}>
        <Lock size={18} aria-hidden="true" />
        {busy ? 'Processing…' : `Pay ${money(amount)}`}
      </button>
    </div>
  )
}

export default function Checkout() {
  const navigate = useNavigate()
  const draft = loadDraft()
  const [coupon, setCoupon] = useState('')
  const [code, setCode] = useState('')
  const [codeError, setCodeError] = useState('')

  const valid = draft && draft.services?.length && draft.date && draft.time && draft.name && draft.address
  if (!valid) return <Navigate to="/book" replace />

  const subtotal = subtotalFor(draft.services)
  const discount = couponDiscount(coupon, subtotal)
  const total = subtotal - discount

  function applyCode(value) {
    const c = String(value || '').trim().toUpperCase()
    if (!c) return setCodeError('Enter a code first.')
    if (!COUPONS[c]) return setCodeError('That code is not valid.')
    setCoupon(c)
    setCode('')
    setCodeError('')
  }

  function payLater() {
    saveFinalize({ payLater: true })
    navigate('/confirmation')
  }

  function confirmDemo() {
    saveFinalize({ paymentIntentId: 'pi_demo', coupon })
    navigate('/confirmation')
  }

  return (
    <main className="co">
      <div className="co-wrap">
        <div className="co-top">
          <Link className="co-back" to="/book" state={{ step: 3 }}>
            <ArrowLeft size={18} aria-hidden="true" />
            Back to details
          </Link>
          <span className="co-secure">
            <Lock size={15} aria-hidden="true" />
            Secure checkout
          </span>
        </div>

        {!coupon && (
          <div className="co-prepay">
            <div>
              <p className="co-prepay-title">$15 off when you pay now</p>
              <p className="co-prepay-text">Use code PREPAY at checkout. Paying later is always an option.</p>
            </div>
            <button type="button" className="btn btn-black" onClick={() => applyCode('PREPAY')}>
              Apply code
            </button>
          </div>
        )}

        <section className="co-card" aria-labelledby="co-sum">
          <h1 id="co-sum">Order summary</h1>
          <p className="co-line">
            <span>{labelFor(draft.services)}</span>
            <span>{money(subtotal)}</span>
          </p>
          {discount > 0 && (
            <p className="co-line co-line-discount">
              <span>
                {coupon} applied
                <button type="button" className="co-remove" onClick={() => setCoupon('')} aria-label={`Remove code ${coupon}`}>
                  <X size={14} />
                </button>
              </span>
              <span>&minus;{money(discount)}</span>
            </p>
          )}
          <p className="co-line co-total">
            <span>Total</span>
            <span>{money(total)}</span>
          </p>
        </section>

        <section className="co-card co-coupon" aria-label="Coupon code">
          <label htmlFor="coupon">
            <Tag size={16} aria-hidden="true" /> Coupon code
          </label>
          <div className="co-coupon-row">
            <input
              id="coupon"
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                setCodeError('')
              }}
              onKeyDown={(e) => e.key === 'Enter' && applyCode(code)}
              placeholder="Enter code"
              autoComplete="off"
              autoCapitalize="characters"
            />
            <button type="button" className="btn btn-outline-black" onClick={() => applyCode(code)}>
              Apply
            </button>
          </div>
          {codeError && (
            <p className="co-code-error" role="alert">
              {codeError}
            </p>
          )}
        </section>

        <section className="co-card" aria-label="Payment">
          {stripePromise ? (
            <Elements
              key={total}
              stripe={stripePromise}
              options={{ mode: 'payment', amount: total * 100, currency: 'usd', appearance: APPEARANCE }}
            >
              <PayForm draft={draft} coupon={coupon} amount={total} />
            </Elements>
          ) : (
            <div className="co-demo">
              <p>
                <strong>Demo mode.</strong> Add your Stripe publishable key to <code>.env.local</code> to take real
                payments.
              </p>
              <button type="button" className="btn btn-orange btn-lg co-pay" onClick={confirmDemo}>
                Confirm booking (demo)
              </button>
            </div>
          )}
        </section>

        <p className="co-later">
          <button type="button" onClick={payLater}>
            I&rsquo;ll pay later
          </button>
        </p>
      </div>
    </main>
  )
}
