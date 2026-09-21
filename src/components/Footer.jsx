import { Link } from 'react-router-dom'
import { Phone, MapPin, Clock } from 'lucide-react'
import { BUSINESS } from '../config/business'

export default function Footer() {
  return (
    <footer className="foot">
      <div className="foot-main wrap">
        <div className="foot-brand">
          <img src="/images/logo.png" alt={BUSINESS.name} width="220" height="87" loading="lazy" />
          <p>Mobile car detailing that comes to your driveway.</p>
        </div>

        <ul className="foot-contact">
          <li>
            <Phone size={18} aria-hidden="true" />
            <a href={BUSINESS.phoneHref}>{BUSINESS.phone}</a>
          </li>
          <li>
            <MapPin size={18} aria-hidden="true" />
            <span>
              {BUSINESS.city}, {BUSINESS.state}
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
          <Link to="/#faq">FAQ</Link>
          <Link to="/book">Book Online</Link>
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
