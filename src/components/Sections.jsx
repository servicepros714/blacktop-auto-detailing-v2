import { Link } from 'react-router-dom'
import { Check, MapPin, Phone, ChevronDown } from 'lucide-react'
import { BUSINESS, SERVICES, FAQ, REVIEWS } from '../config/business'
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages'

// Sections shared by the home page and the SEO landing pages.

const basic = SERVICES.find((s) => s.id === 'basic')
const premium = SERVICES.find((s) => s.id === 'premium')
const exterior = SERVICES.find((s) => s.id === 'exterior')

export function CheckList({ items, light = false }) {
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

// Link chips to the landing pages. `exclude` skips the page you are on; `home` adds a link home.
export function ServiceChips({ exclude, home = false, dark = false }) {
  return (
    <ul className={`lk-chips ${dark ? 'lk-chips-dark' : ''}`}>
      {home && (
        <li>
          <Link to="/">Mobile car detailing in {HOME_CITY}</Link>
        </li>
      )}
      {SERVICE_PAGES.filter((p) => p.path !== exclude).map((p) => (
        <li key={p.path}>
          <Link to={p.path}>{p.nav}</Link>
        </li>
      ))}
    </ul>
  )
}

export function AreaChips({ exclude, home = false, dark = false }) {
  return (
    <ul className={`lk-chips ${dark ? 'lk-chips-dark' : ''}`}>
      {home && (
        <li>
          <Link to="/#area">
            <MapPin size={14} aria-hidden="true" /> {HOME_CITY}
          </Link>
        </li>
      )}
      {CITY_PAGES.filter((p) => p.path !== exclude).map((p) => (
        <li key={p.path}>
          <Link to={p.path}>
            <MapPin size={14} aria-hidden="true" /> {p.city}
          </Link>
        </li>
      ))}
    </ul>
  )
}

export function Services({ title = 'Services and pricing', showLinks = true }) {
  return (
    <section className="sec sec-light" id="services">
      <div className="wrap">
        <div className="sec-head">
          <h2>{title}</h2>
          <p>
            Choose a Basic or Premium interior detail, then add an exterior wash if the outside needs attention too.
            Same price for any car, SUV, truck or minivan.
          </p>
        </div>

        <div className="svc-grid">
          <article className="svc-card">
            <header>
              <h3>{basic.name}</h3>
              <p className="svc-price">${basic.price}</p>
            </header>
            <p className="svc-blurb">
              {basic.blurb} Usually {basic.duration}.
            </p>
            <CheckList items={basic.features} light />
            <p className="svc-upsell">Want more? Premium adds shampooing, extraction and UV protection.</p>
          </article>

          <article className="svc-card svc-card-dark">
            <header>
              <h3>{premium.name}</h3>
              <p className="svc-price">${premium.price}</p>
            </header>
            <p className="svc-blurb">
              {premium.blurb} Usually {premium.duration}.
            </p>
            <CheckList items={premium.features} />
          </article>
        </div>

        <article className="svc-wide">
          <div className="svc-wide-head">
            <h3>{exterior.name}</h3>
            <p className="svc-price">+${exterior.price}</p>
            <p className="svc-blurb">{exterior.blurb} Added to a Basic or Premium Detail.</p>
          </div>
          <CheckList items={exterior.features} light />
        </article>

        {showLinks && (
          <div className="svc-links">
            <p>Compare in detail:</p>
            <ServiceChips />
          </div>
        )}

        <div className="svc-cta">
          <Link to="/book" className="btn btn-orange btn-lg">
            Book now
          </Link>
        </div>
      </div>
    </section>
  )
}

export function Reviews() {
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
              <footer>{r.name}, Google review</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Faq({ faqs = FAQ, title = 'Questions, answered' }) {
  return (
    <section className="sec sec-light" id="faq">
      <div className="wrap faq">
        <div className="faq-side">
          <h2>{title}</h2>
          <p>Still curious? Call us and we will walk you through it.</p>
          <a href={BUSINESS.phoneHref} className="btn btn-black">
            <Phone size={18} aria-hidden="true" />
            {BUSINESS.phone}
          </a>
        </div>
        <div className="faq-list">
          {faqs.map((f) => (
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

export function FinalCta({ where = 'your address' }) {
  return (
    <section className="cta">
      <div className="wrap cta-inner">
        <h2>Ready for a cleaner car?</h2>
        <p>Pick a service and a time. We handle the rest at {where}.</p>
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
