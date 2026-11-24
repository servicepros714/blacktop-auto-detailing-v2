import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { BUSINESS, REVIEWS } from '../config/business'

const LINKS = [
  { to: '/#services', label: 'Services' },
  { to: '/#work', label: 'Our work' },
  { to: '/#how-it-works', label: 'How it works' },
  { to: '/#area', label: 'Service area' },
  ...(REVIEWS.length ? [{ to: '/#reviews', label: 'Reviews' }] : []),
  { to: '/#faq', label: 'FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname, location.hash])

  useEffect(() => {
    document.body.classList.toggle('menu-open', open)
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.classList.remove('menu-open')
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <>
      <header className="cap">
        <div className="cap-bar">
          <Link to="/" className="cap-logo" aria-label={`${BUSINESS.name} home`}>
            <img src="/images/logo.png" alt={BUSINESS.name} width="150" height="59" />
          </Link>

          <nav className="cap-links" aria-label="Main">
            {LINKS.map((l) => (
              <Link key={l.to} to={l.to}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="cap-actions">
            <a className="cap-phone" href={BUSINESS.phoneHref}>
              <Phone size={16} aria-hidden="true" />
              {BUSINESS.phone}
            </a>
            <Link to="/book" className="btn btn-orange cap-book">
              Book Online
            </Link>
          </div>

          <button
            type="button"
            className="cap-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`menu ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <nav className="menu-links" aria-label="Mobile">
          {LINKS.map((l) => (
            <Link key={l.to} to={l.to} tabIndex={open ? 0 : -1}>
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="menu-meta">
          {BUSINESS.city}, {BUSINESS.state}. {BUSINESS.hours}.
        </p>
        <div className="menu-actions">
          <a className="btn btn-ghost" href={BUSINESS.phoneHref} tabIndex={open ? 0 : -1}>
            <Phone size={18} aria-hidden="true" />
            Call Now
          </a>
          <Link className="btn btn-orange" to="/book" tabIndex={open ? 0 : -1}>
            Book Online
          </Link>
        </div>
      </div>
    </>
  )
}
