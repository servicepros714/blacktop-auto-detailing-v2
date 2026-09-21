import { Link } from 'react-router-dom'
import { Truck, Droplets, CalendarCheck, CreditCard, Check, MapPin, Phone, ChevronDown } from 'lucide-react'
import BeforeAfter from '../components/BeforeAfter.jsx'
import { BUSINESS, SERVICES, SERVICE_AREA, FAQ, REVIEWS } from '../config/business'

const basic = SERVICES.find((s) => s.id === 'basic')
const premium = SERVICES.find((s) => s.id === 'premium')
const exterior = SERVICES.find((s) => s.id === 'exterior')

const FACTS = [
  { icon: Truck, title: 'We come to you', text: 'Mobile service at your address.' },
  { icon: Droplets, title: 'Hand washed, hand dried', text: 'Spot-free finish on every exterior wash.' },
  { icon: CalendarCheck, title: 'Book in minutes', text: 'Open times every 30 minutes, 7 AM to 7 PM.' },
  { icon: CreditCard, title: 'Pay now or later', text: 'Prepay online and take $15 off.' },
]

const STEPS = [
  { title: 'Pick your detail', text: 'Choose Basic or Premium, and add the exterior wash if the outside needs it too.' },
  { title: 'Choose a time', text: 'Open appointments run every 30 minutes, seven days a week.' },
  { title: 'Tell us where', text: 'Enter your vehicle and the address where we should meet you.' },
  { title: 'Pay now or later', text: 'Prepay with card, Apple Pay or Google Pay and save $15, or pay after the detail.' },
]

function CheckList({ items, light = false }) {
  return (
    <ul className={`checks ${light ? 'checks-light' : ''}`}>
      {items.map((f) => (
        <li key={f}>
          <span className="checks-dot" aria-hidden="true">
            <Check size={14} strokeWidth={3.5} />
          </span>
          {f}
        </li>
      ))}
    </ul>
  )
}

function Hero() {
  return (
    <section className="hero" id="top">
      <svg className="hero-swoosh" viewBox="0 0 1440 700" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="sw" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0.42" stopColor="#FF7A00" stopOpacity="0" />
            <stop offset="0.68" stopColor="#FF7A00" stopOpacity="1" />
            <stop offset="1" stopColor="#FF7A00" stopOpacity="0.9" />
          </linearGradient>
        </defs>
        <path pathLength="1" d="M-60 520 C 300 400, 760 190, 1500 110" strokeWidth="10" />
        <path pathLength="1" d="M-60 590 C 320 470, 780 300, 1500 228" strokeWidth="5" />
        <path pathLength="1" d="M-60 650 C 340 545, 820 410, 1500 345" strokeWidth="2.5" />
      </svg>

      <div className="hero-inner wrap">
        <div className="hero-copy">
          <p className="hero-place">
            <MapPin size={16} aria-hidden="true" />
            Mobile detailing in {BUSINESS.city}, {BUSINESS.state}
          </p>
          <h1 className="chrome-text">A deep black shine, delivered to your driveway</h1>
          <p className="hero-lede">
            Hand-washed exteriors and deep-cleaned interiors, done at your address. Pick a service, choose a time and
            book online in a few minutes.
          </p>
          <div className="hero-cta">
            <Link to="/book" className="btn btn-orange btn-lg">
              Book Online
            </Link>
            <a href={BUSINESS.phoneHref} className="btn btn-ghost btn-lg">
              <Phone size={18} aria-hidden="true" />
              {BUSINESS.phone}
            </a>
          </div>
        </div>

        <div className="hero-lanes">
          <figure className="lane lane-a">
            <img src="/images/porsche-foam.jpg" alt="White Porsche Boxster covered in foam during a hand wash" style={{ objectPosition: '38% 50%' }} />
          </figure>
          <figure className="lane lane-b">
            <img src="/images/tesla-black.jpg" alt="Glossy black Tesla with a mirror-deep hood" style={{ objectPosition: '50% 40%' }} />
          </figure>
          <figure className="lane lane-c">
            <img src="/images/tesla-foam.jpg" alt="Tesla Model Y covered in thick foam before rinsing" style={{ objectPosition: '32% 50%' }} />
          </figure>
        </div>
      </div>

      <ul className="facts wrap">
        {FACTS.map(({ icon: Icon, title, text }) => (
          <li key={title}>
            <Icon size={26} aria-hidden="true" />
            <div>
              <p className="facts-title">{title}</p>
              <p>{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}

function Services() {
  return (
    <section className="sec sec-light" id="services">
      <div className="wrap">
        <div className="sec-head">
          <h2>Services and pricing</h2>
          <p>
            Choose a Basic or Premium interior detail, then add an exterior wash if the outside needs attention too.
          </p>
        </div>

        <div className="svc-grid">
          <article className="svc-card">
            <header>
              <h3>{basic.name}</h3>
              <p className="svc-price">${basic.price}</p>
            </header>
            <p className="svc-blurb">{basic.blurb}</p>
            <CheckList items={basic.features} light />
            <p className="svc-upsell">Want more? Premium adds shampooing, extraction and UV protection.</p>
          </article>

          <article className="svc-card svc-card-dark">
            <header>
              <h3>{premium.name}</h3>
              <p className="svc-price">${premium.price}</p>
            </header>
            <p className="svc-blurb">{premium.blurb}</p>
            <CheckList items={premium.features} />
          </article>
        </div>

        <article className="svc-wide">
          <div className="svc-wide-head">
            <h3>{exterior.name}</h3>
            <p className="svc-price">+${exterior.price}</p>
            <p className="svc-blurb">{exterior.blurb}</p>
          </div>
          <CheckList items={exterior.features} light />
        </article>

        <div className="svc-cta">
          <Link to="/book" className="btn btn-orange btn-lg">
            Book now
          </Link>
        </div>
      </div>
    </section>
  )
}

function Work() {
  return (
    <section className="sec sec-asphalt" id="work">
      <div className="wrap">
        <div className="sec-head sec-head-dark">
          <h2>Recent work</h2>
          <p>Drag the slider to see the difference a proper wash makes on a work truck.</p>
        </div>

        <div className="work-grid">
          <div className="work-ba">
            <BeforeAfter
              before="/images/chevy-before.jpg"
              after="/images/chevy-after.jpg"
              beforeAlt="Chevrolet work truck grille caked in dirt and debris"
              afterAlt="The same Chevrolet grille clean and bright after detailing"
            />
          </div>
          <figure className="work-tile work-a">
            <img src="/images/porsche-dirty.jpg" alt="White Porsche Boxster with dull, dirty paint before washing" loading="lazy" />
            <figcaption>Before the wash</figcaption>
          </figure>
          <figure className="work-tile work-b">
            <img src="/images/porsche-foam.jpg" alt="The same Porsche covered in white foam mid-wash" loading="lazy" style={{ objectPosition: '50% 60%' }} />
            <figcaption>Foam soak</figcaption>
          </figure>
          <figure className="work-tile work-c">
            <img src="/images/tesla-black.jpg" alt="Black Tesla with a deep gloss finish reflecting the sky" loading="lazy" />
            <figcaption>Gloss finish</figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="sec sec-black" id="how-it-works">
      <div className="wrap">
        <div className="sec-head sec-head-dark">
          <h2>How booking works</h2>
          <p>Four quick steps. You can finish on your phone in a couple of minutes.</p>
        </div>

        <ol className="road">
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="road-node">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Area() {
  const src = `https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapQuery)}&output=embed`
  return (
    <section className="sec sec-asphalt" id="area">
      <div className="wrap area">
        <div className="area-copy">
          <h2>We come to you across {BUSINESS.city} and nearby</h2>
          <p>
            Blacktop is based in {BUSINESS.city}, {BUSINESS.state}. Enter your address when you book and we will meet you
            there.
          </p>
          <ul className="chips">
            {SERVICE_AREA.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
          <p className="area-note">
            Not sure we cover your neighborhood? Call <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
          </p>
        </div>
        <div className="area-map">
          <iframe title={`Map of ${BUSINESS.city}, ${BUSINESS.state}`} src={src} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  if (!REVIEWS.length) return null
  return (
    <section className="sec sec-black" id="reviews">
      <div className="wrap">
        <div className="sec-head sec-head-dark">
          <h2>What customers say</h2>
        </div>
        <div className="rev-grid">
          {REVIEWS.map((r) => (
            <blockquote key={r.name} className="rev">
              <p>{r.text}</p>
              <footer>{r.name}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="sec sec-light" id="faq">
      <div className="wrap faq">
        <div className="faq-side">
          <h2>Questions, answered</h2>
          <p>Still curious? Call us and we will walk you through it.</p>
          <a href={BUSINESS.phoneHref} className="btn btn-black">
            <Phone size={18} aria-hidden="true" />
            {BUSINESS.phone}
          </a>
        </div>
        <div className="faq-list">
          {FAQ.map((f) => (
            <details key={f.q}>
              <summary>
                {f.q}
                <ChevronDown size={22} aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="cta">
      <div className="wrap cta-inner">
        <h2>Ready for a cleaner car?</h2>
        <p>Pick a service and a time. We handle the rest at your address.</p>
        <div className="cta-buttons">
          <Link to="/book" className="btn btn-black btn-lg">
            Book Online
          </Link>
          <a href={BUSINESS.phoneHref} className="btn btn-outline-black btn-lg">
            <Phone size={18} aria-hidden="true" />
            {BUSINESS.phone}
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Work />
      <HowItWorks />
      <Area />
      <Reviews />
      <Faq />
      <FinalCta />
    </main>
  )
}