import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/base.css'
import './styles/home.css'
import './styles/booking.css'
import './styles/seo.css' // last, so its rules win

const root = document.getElementById('root')
const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

// Prerendered pages already have HTML in #root: hydrate it. Booking pages are empty: render.
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, app)
else ReactDOM.createRoot(root).render(app)
