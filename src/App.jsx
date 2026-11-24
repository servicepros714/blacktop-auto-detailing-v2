import { Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import MobileActionBar from './components/MobileActionBar.jsx'
import ScrollManager from './components/ScrollManager.jsx'
import Seo from './components/Seo.jsx'
import Home from './pages/Home.jsx'
import Book from './pages/Book.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmation from './pages/Confirmation.jsx'
import Landing from './pages/Landing.jsx'
import NotFound from './pages/NotFound.jsx'
import { LANDING_PAGES } from './lib/pages.js'

const FLOW = ['/book', '/checkout', '/confirmation']

export default function App() {
  const { pathname } = useLocation()
  return (
    <>
      <ScrollManager />
      <Seo />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {LANDING_PAGES.map((page) => (
          <Route key={page.path} path={page.path} element={<Landing page={page} />} />
        ))}
        <Route path="/book" element={<Book />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!FLOW.includes(pathname) && <Footer />}
      <MobileActionBar />
      <Toaster
        position="top-center"
        toastOptions={{
          style: { background: '#000', color: '#fff', border: '1px solid #FF7A00', fontWeight: 600 },
        }}
      />
    </>
  )
}
