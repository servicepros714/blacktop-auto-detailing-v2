// Everything business-specific lives here. Edit this file, not the components.

export const BUSINESS = {
  name: 'Blacktop Auto Detailing',
  shortName: 'Blacktop',
  phone: '(714) 559-3882',
  phoneHref: 'tel:+17145593882',
  city: 'Buena Park',
  state: 'CA',
  hours: 'Mon–Sun, by appointment',
  // Must be unique across the portfolio (scopes every D1 query + booking IDs)
  source: 'blacktop',
  bookingPrefix: 'BLK-',
  mapQuery: 'Buena Park, CA',
}

// Cities shown in the service-area section. Confirm real coverage with the owner.
export const SERVICE_AREA = [
  'Buena Park',
  'Fullerton',
  'Anaheim',
  'La Palma',
  'Cypress',
  'La Mirada',
  'Stanton',
  'Garden Grove',
]

export const SERVICES = [
  {
    id: 'basic',
    name: 'Basic Detail',
    price: 150,
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

// Appointment start times: 7:00 AM to 7:00 PM, every 30 minutes, every day.
export const SLOT_START_MIN = 7 * 60
export const SLOT_END_MIN = 19 * 60
export const SLOT_STEP_MIN = 30
// Bookings need at least this much notice, measured on California time (4 hours).
export const LEAD_MINUTES = 240
// How far ahead customers can book.
export const BOOKING_WINDOW_DAYS = 90

// Add real customer reviews here. The section stays hidden while this is empty.
export const REVIEWS = []

export const FAQ = [
  {
    q: 'What is the difference between the Basic and Premium Detail?',
    a: 'The Basic Detail is a deep vacuum, a full surface wipe-down and floor mat restoration. The Premium Detail includes all of that cleaning and adds cabin application, dust elimination, interior window cleaning, deep carpet cleaning and extraction, full interior shampooing and a UV-protectant coating.',
  },
  {
    q: 'Can I book just the exterior wash?',
    a: 'The Exterior Wash is $50 and is added on the screen right after you pick a Basic or Premium Detail. If you only need the exterior, call us at (714) 559-3882 and we will set it up.',
  },
  {
    q: 'Do I have to pay online?',
    a: 'No. You can pay by card, Apple Pay or Google Pay at checkout, or choose to pay later. Paying online at checkout takes $15 off with code PREPAY.',
  },
  {
    q: 'Where do you work?',
    a: 'We come to you. Enter your address when you book and we will arrive at your appointment time. We cover Buena Park and nearby Orange County cities.',
  },
  {
    q: 'How do I change or cancel an appointment?',
    a: 'Call (714) 559-3882 and give us your booking ID from the confirmation page.',
  },
]