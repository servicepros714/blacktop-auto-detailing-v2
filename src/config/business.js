// Everything business-specific lives here. Edit this file, not the components.
//
// Confirmed facts (owner, Nov 2026): mobile only, we bring our own water and power,
// every day with start times 8 AM - 5 PM, Basic Detail usually 2-3 hours and Premium
// Detail 4-6 hours, satisfaction guarantee, same price for every vehicle size, prepay
// online with code PREPAY for $15 off. Same prices and hours in the nearby cities.
// NOT confirmed, so never claimed: ratings, insurance, years in business, customer counts,
// product brands, ceramic coating or paint correction (not offered).

// Canonical domain (no www; www redirects to it).
export const SITE_URL = (import.meta.env.VITE_SITE_URL || 'https://blacktopautodetailing.site').replace(/\/$/, '')

// Google Business Profile, used in the schema (sameAs). Leave '' until known.
export const GOOGLE_PROFILE_URL = 'https://www.google.com/search?kgmid=/g/11yy_xz7vn&q=Blacktop+Auto+Detailing'

// Shown above the reviews (not in the schema). Update together with the profile.
export const GOOGLE_RATING = { value: '4.9', count: 14, asOf: 'Nov 2026' }

export const BUSINESS = {
  name: 'Blacktop Auto Detailing',
  shortName: 'Blacktop',
  phone: '(714) 559-3882',
  phoneHref: 'tel:+17145593882',
  phoneSchema: '+1-714-559-3882',
  // Same address as the Google Business Profile (owner asked to match it). Mobile only:
  // customers are not invited to visit; we go to them.
  street: '7000 La Palma Ave',
  zip: '90620',
  city: 'Buena Park',
  state: 'CA',
  hours: 'Every day, 8 AM – 5 PM',
  // Must match SOURCE in worker/worker.js (scopes every D1 query)
  source: 'blacktop-buena-park',
  bookingPrefix: 'BLK-',
  mapQuery: 'Buena Park, CA',
}

// Neighborhoods named on the home page (Buena Park). Nearby cities with their own pages
// are listed in src/lib/pages.js (CITY_PAGES); the owner confirmed those cities.
export const HOME_AREAS = ['the Knott’s Berry Farm area', 'Buena Park Downtown', 'Beach Boulevard', 'Ralph B. Clark Regional Park', 'Bellis Park', 'Los Coyotes']

export const SERVICES = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
    duration: '2–3 hours',
    group: 'interior',
    blurb: 'A focused interior reset for cars that need a solid clean.',
    features: [
      'Triple-Stage Vacuuming for Deep Debris Removal',
      'Complete Interior Surface Wipe-Down',
      'Floor Mat Cleaning & Restoration',
    ],
  },
  {
    id: 'premium',
    name: 'Premium Detail',
    price: 200,
    duration: '4–6 hours',
    group: 'interior',
    blurb: 'Everything in the deep clean, plus shampooing and UV protection.',
    features: [
      'Triple-Stage Vacuuming',
      'Cabin Application',
      'Dust Elimination',
      'Interior Window Cleaning',
      'Deep Carpet Cleaning',
      'Cloth & Carpet Extraction',
      'Full Interior Shampooing',
      'UV-Protectant Coating',
    ],
  },
  {
    id: 'exterior',
    name: 'Exterior Wash',
    price: 50,
    group: 'exterior',
    addon: true,
    blurb: 'Hand wash, rims, tire shine, door jambs and a spot-free dry.',
    features: [
      'Hand-Washed Exterior',
      'Detailed Rim Cleaning',
      'Tire Scrub and Degrease',
      'Door Jamb & Panel Wipe-Down',
      'Premium Tire Shine Application',
      'Spot-Free Hand Drying',
    ],
  },
]

// Code -> dollars off. The Worker enforces the same table.
export const COUPONS = {
  PREPAY: { amount: 15, label: 'Prepay discount' },
}

// Appointment start times: 8:00 AM to 5:00 PM, every 30 minutes, every day.
// Must match worker/worker.js.
export const SLOT_START_MIN = 8 * 60
export const SLOT_END_MIN = 17 * 60
export const SLOT_STEP_MIN = 30
// Bookings need at least this much notice, measured on California time (4 hours).
export const LEAD_MINUTES = 240
// How far ahead customers can book.
export const BOOKING_WINDOW_DAYS = 90

// Real Google reviews only, as { name: 'First L.', text: '...' } (first name + last initial,
// typos fixed; leave out reviews that read like a shop visit). The section and its menu
// link stay hidden while this is empty.
// From the Google profile, Nov 2026. Left out: rating-only and emoji-only reviews, the handle
// "Moxic", and two that describe visiting a shop (Mitch B. "the service there", Molly M.
// "would come here again"). Paul I.'s review is cut where Google truncates it.
export const REVIEWS = [
  { name: 'Paul I.', text: 'Had a great experience with Blacktop Detailing. They did an excellent job on both the exterior and interior. The car looks clean, shiny, and well taken care of, and the red leather interior came out looking fantastic.' },
  { name: 'Dennis G.', text: 'Blacktop Auto Detailing gave my car the refresh it seriously needed. What stood out to me was how clean everything felt afterward, not just the obvious areas, but all the small details too. The finish looked sharp, the interior felt fresh, and the whole car was noticeably better. Really pleased with how it turned out!' },
  { name: 'Josiah I.', text: 'Great work as always. This time I accidentally dropped a bunch of juice and they were able to remove it.' },
  { name: 'Thomas S.', text: 'Car is cleaner than when I got it, and I appreciated how fast the service was.' },
  { name: 'Aspen M.', text: 'Great detailing job, your car will look brand new. Highly recommend.' },
  { name: 'Danny B.', text: 'Amazing service, super quick and easy. Will definitely be returning.' },
  { name: 'Matthew S.', text: 'My car looks and smells great. Happy with the service.' },
  { name: 'Gloria S.', text: 'Very happy with the detailing. Will recommend the company to others!' },
]

// Home page FAQ. Shown on the page and used for the FAQPage schema, so keep both in sync.
export const FAQ = [
  { q: 'Do you come to me?', a: 'Yes. Blacktop is mobile only. We detail your car at your home or workplace in Buena Park and nearby cities.' },
  { q: 'Do you need my water or power?', a: 'No. We bring our own water and power, so there is nothing for you to set up.' },
  { q: 'What is the difference between the Basic and Premium Detail?', a: 'The Basic Detail ($150) is a triple-stage vacuum, a full interior wipe-down and floor mat restoration. The Premium Detail ($200) adds cabin application, dust elimination, interior windows, deep carpet cleaning and extraction, full interior shampooing and a UV-protectant coating.' },
  { q: 'Does an SUV or truck cost more?', a: 'No. Cars, SUVs, trucks and minivans all pay the same price.' },
  { q: 'How long does a detail take?', a: 'A Basic Detail usually takes 2 to 3 hours and a Premium Detail 4 to 6 hours, depending on the condition of the car.' },
  { q: 'Can I book just the exterior wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic or Premium Detail. You can add it on the screen right after you pick your detail.' },
  { q: 'Which days and times can I book?', a: 'Every day of the week, with start times from 8 AM to 5 PM.' },
  { q: 'Do I have to pay online?', a: 'No. Pay by card, Apple Pay or Google Pay at checkout and take $15 off with code PREPAY, or choose to pay later.' },
  { q: 'What if I am not happy with the result?', a: 'Tell us. Every detail is backed by our satisfaction guarantee, and we will make it right.' },
  { q: 'How do I change or cancel an appointment?', a: 'Call (714) 559-3882 and give us your booking ID from the confirmation page.' },
]
