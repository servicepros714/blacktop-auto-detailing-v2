import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { BUSINESS } from '../config/business'

const HIDDEN_ON = ['/book', '/checkout', '/confirmation']

// Sticky Call now / Book online bar on phones. Slides in after the hero scrolls away.
export default function MobileActionBar() {
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)
  const hidden = HIDDEN_ON.includes(pathname)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.65)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [pathname])

  if (hidden) return null

  return (
    <div className={`mbar ${show ? 'is-visible' : ''}`} role="group" aria-label="Quick actions">
      <a className="btn btn-ghost" href={BUSINESS.phoneHref}>
        <Phone size={18} aria-hidden="true" />
        Call Now
      </a>
      <Link className="btn btn-orange" to="/book">
        Book Online
      </Link>
    </div>
  )
}
