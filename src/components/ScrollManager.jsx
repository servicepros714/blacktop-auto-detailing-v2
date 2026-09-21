import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to top on route change, or to the #section when the link has a hash.
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      // Wait a tick so the target page has rendered.
      const t = setTimeout(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 60)
      return () => clearTimeout(t)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash, key])

  return null
}
