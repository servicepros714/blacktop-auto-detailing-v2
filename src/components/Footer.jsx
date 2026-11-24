import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { BUSINESS, REVIEWS } from '../config/business'
import { SERVICE_PAGES, CITY_PAGES, HOME_CITY } from '../lib/pages'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-main wrap">
        <div className="foot-brand">
          <img src="/images/logo.png" alt={BUSINESS.name} width="220" height="87" loading="lazy" />
          <p>Mobile car detailing based in {BUSINESS.city}, CA. We bring our own water and power to your driveway.</p>
        </div>

        <ul className="foot-contact">
          <li>
            <Phone size={18} aria-hidden="true" />
            <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
          </li>
          <li>
            <MapPin size={18} aria-hidden="true" />
            <span>
              {BUSINESS.street}, {BUSINESS.city}, {BUSINESS.state} {BUSINESS.zip}
            </span>
          </li>
          <li>
            <Clock size={18} aria-hidden="true" />
            <span>{BUSINESS.hours}</span>
          </li>
        </ul>

        <nav className="foot-links" aria-label="Footer">
          <Link to="/#services">Services</Link>
          <Link to="/#work">Our work</Link>
          <Link to="/#how-it-works">How it works</Link>
          {REVIEWS.length > 0 && <Link to="/#reviews">Reviews</Link>}
          <Link to="/#faq">FAQ</Link>
          <Link to="/book">Book Online</Link>
        </nav>

        <nav className="foot-links" aria-label="Services">
          <p className="foot-head">Services</p>
          {SERVICE_PAGES.map((p) => (
            <Link key={p.path} to={p.path}>
              {p.nav}
            </Link>
          ))}
        </nav>

        <nav className="foot-links" aria-label="Areas">
          <p className="foot-head">Areas</p>
          <Link to="/">{HOME_CITY}</Link>
          {CITY_PAGES.map((p) => (
            <Link key={p.path} to={p.path}>
              {p.city}
            </Link>
          ))}
        </nav>
      </div>

      <div className="foot-mark" aria-hidden="true">
        BLACKTOP
      </div>

      <div className="foot-legal wrap">
        <span>
          &copy; {new Date().getFullYear()} {BUSINESS.name}. All rights reserved.
        </span>
      </div>
    </footer>
  )
}
