import { Link } from 'react-router-dom'
import { ServiceChips } from '../components/Sections.jsx'

// Prerendered as dist/404.html, which Cloudflare Pages serves (with a 404 status) for unknown URLs.
export default function NotFound() {
  return (
    <main className="sec sec-black nf">
      <div className="wrap">
        <h1 className="chrome-text">Page not found</h1>
        <p>That page does not exist. See our detailing services or book online.</p>
        <ServiceChips home dark />
        <Link to="/book" className="btn btn-orange btn-lg">
          Book Online
        </Link>
      </div>
    </main>
  )
}
