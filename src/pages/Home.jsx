import { Link } from 'react-router-dom'
import { Truck, Droplets, CalendarCheck, CreditCard, MapPin, Phone } from 'lucide-react'
import BeforeAfter from '../components/BeforeAfter.jsx'
import { Services, Reviews, Faq, FinalCta, AreaChips } from '../components/Sections.jsx'
import { BUSINESS, HOME_AREAS } from '../config/business'

const FACTS = [
  { icon: Truck, title: 'We come to you', text: 'We bring our own water and power.' },
  { icon: Droplets, title: 'Same price, any vehicle', text: 'Cars, SUVs, trucks and minivans.' },
  { icon: CalendarCheck, title: 'Every day, 8 AM – 5 PM', text: 'Start times every 30 minutes.' },
  { icon: CreditCard, title: 'Pay now or later', text: 'Prepay online and take $15 off.' },
]

const STEPS = [
  { title: 'Pick your detail', text: 'Choose Basic or Premium, and add the exterior wash if the outside needs it too.' },
  { title: 'Choose a time', text: 'Start times run every 30 minutes from 8 AM to 5 PM, seven days a week.' },
  { title: 'Tell us where', text: 'Enter your vehicle and the address where we should meet you.' },
  { title: 'Pay now or later', text: 'Prepay with card, Apple Pay or Google Pay and save $15, or pay after the detail.' },
]

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
          <h1 className="hero-place">
            <MapPin size={16} aria-hidden="true" />
            Mobile car detailing in {BUSINESS.city}, {BUSINESS.state}
          </h1>
          <p className="chrome-text hero-title">A deep black shine, delivered to your driveway</p>
          <p className="hero-lede">
            Deep-cleaned interiors, plus an optional hand-washed exterior, done at your address with our own water and
            power. Pick a service, choose a time and book online in a few minutes.
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
            Blacktop is based in {BUSINESS.city}, {BUSINESS.state}. We detail cars all over town, from{' '}
            {HOME_AREAS.slice(0, 3).join(', ')} to {HOME_AREAS[3]}, and in these nearby cities at the same prices:
          </p>
          <AreaChips dark />
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
