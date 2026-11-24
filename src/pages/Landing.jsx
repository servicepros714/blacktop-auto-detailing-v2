import { Link } from 'react-router-dom'
import { Check, MapPin, Phone } from 'lucide-react'
import { BUSINESS, SERVICES } from '../config/business'
import { Services, Faq, FinalCta, CheckList, ServiceChips, AreaChips } from '../components/Sections.jsx'

// One template for every SEO landing page in src/lib/pages.js.

const basic = SERVICES.find((s) => s.id === 'basic')
const premium = SERVICES.find((s) => s.id === 'premium')
const exterior = SERVICES.find((s) => s.id === 'exterior')

// Hero price card: the Premium Detail, or 'combo' = Premium + Exterior Wash.
// The Exterior Wash is never shown as a product on its own.
function PriceCard({ page }) {
  const combo = page.card === 'combo'
  const name = combo ? `${premium.name} + ${exterior.name}` : premium.name
  const price = combo ? premium.price + exterior.price : premium.price
  const items = combo
    ? ['Everything in the Premium Detail', 'Full Interior Shampooing', 'Cloth & Carpet Extraction', 'Hand-Washed Exterior', 'Detailed Rim Cleaning', 'Spot-Free Hand Drying']
    : premium.features
  return (
    <aside className="lp-card" aria-label={name}>
      <p className="lp-card-badge">{combo ? 'Inside & out' : 'Most complete'}</p>
      <h2 className="lp-card-name">{name}</h2>
      <p className="lp-card-price">
        ${price}
        <span> any vehicle</span>
      </p>
      <CheckList items={items} />
      <Link className="btn btn-orange lp-card-btn" to="/book?package=premium">
        Book this detail
      </Link>
      <p className="lp-card-note">
        {combo
          ? `Or the ${basic.name} + wash for $${basic.price + exterior.price}, or a detail alone from $${basic.price}.`
          : `Or the ${basic.name} for $${basic.price}. Prepay with code PREPAY to save $15.`}
      </p>
    </aside>
  )
}

// City pages: neighborhoods + map.
function Local({ page }) {
  return (
    <section className="sec sec-asphalt">
      <div className="wrap area">
        <div className="area-copy">
          <h2>Where we work in {page.city}</h2>
          <p>
            We come to homes and workplaces across {page.city}. Not sure about your address? Call{' '}
            <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>.
          </p>
          <ul className="chips" aria-label={`${page.city} neighborhoods`}>
            {page.areas.map((a) => (
              <li key={a}>{a.replace(/^the /, '')}</li>
            ))}
          </ul>
        </div>
        <div className="area-map">
          <iframe
            title={`Map of ${page.city}, CA`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(`${page.city}, CA`)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  )
}

export default function Landing({ page }) {
  const { intro } = page
  return (
    <main>
      <section className="lp-hero">
        <div className="wrap lp-grid">
          <div className="lp-copy">
            <nav className="lp-crumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{page.nav}</span>
            </nav>
            <p className="hero-place">
              <MapPin size={16} aria-hidden="true" />
              {page.eyebrow}
            </p>
            <h1 className="lp-title chrome-text">
              {page.h1[0]} <span>{page.h1[1]}</span>
            </h1>
            <p className="hero-lede">{page.lede}</p>
            <div className="hero-cta">
              <Link className="btn btn-orange btn-lg" to={`/book?package=${page.pkg}`}>
                Book Online
              </Link>
              <a className="btn btn-ghost btn-lg" href={BUSINESS.phoneHref}>
                <Phone size={18} aria-hidden="true" />
                {BUSINESS.phone}
              </a>
            </div>
            <ul className="lp-facts">
              {page.facts.map((f) => (
                <li key={f}>
                  <Check size={16} strokeWidth={3} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
          </div>
          <PriceCard page={page} />
        </div>
      </section>

      <section className="sec sec-light">
        <div className="wrap lp-intro">
          <div>
            <h2>{intro.h2}</h2>
            {intro.paras.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <figure className="lp-photo">
            <img src={page.photo.src} alt={page.photo.alt} width={page.photo.w} height={page.photo.h} loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="sec sec-black">
        <div className="wrap">
          <div className="sec-head sec-head-dark">
            <h2>{page.pointsTitle}</h2>
          </div>
          <ul className="lp-points">
            {page.points.map((pt) => (
              <li key={pt.title}>
                <h3>{pt.title}</h3>
                <p>{pt.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Services title="Prices for every visit" showLinks={false} />

      {page.isCity && <Local page={page} />}

      <Faq faqs={page.faqs} title={page.isCity ? `${page.city} detailing questions` : `${page.nav} questions`} />

      <section className="sec sec-black lp-related" aria-label="More from Blacktop Auto Detailing">
        <div className="wrap">
          <h2 className="lp-related-title">More detailing services</h2>
          <ServiceChips exclude={page.path} home dark />
          <h2 className="lp-related-title">Areas we serve</h2>
          <AreaChips exclude={page.path} home dark />
        </div>
      </section>

      <FinalCta where={`your address in ${page.city}`} />
    </main>
  )
}
