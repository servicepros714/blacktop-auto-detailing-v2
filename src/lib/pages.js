// ---------------------------------------------------------------------------
// SEO landing pages. One template renders all of them (src/pages/Landing.jsx);
// head tags and schema come from src/lib/seo.js.
//
// Home targets "Mobile Car Detailing Buena Park". Luna Glow and Precision Coat (same owner)
// already have /mobile-car-detailing-buena-park, and Fullerton, Anaheim, La Palma and Cypress
// have /mobile-car-detailing-<city> pages on sister sites, so these slugs use other wording
// (car interior detail, carpet shampoo, wash & detail, prices, /auto-detailing-<city>)
// and the copy is unique. The owner is fine with city overlap.
//
// Facts: prices and package contents and the confirmed list in src/config/business.js.
// Same prices and hours in every city. The Exterior Wash is never sold on its own.
// ---------------------------------------------------------------------------

const BRANDS = ['Blacktop Auto Detailing', 'Blacktop Detailing', 'Blacktop']

// Longest title that fits in 60 chars (counting '&' as the escaped '&amp;').
// Keep ", CA" before the long brand name, then drop ", CA" if nothing fits.
export function fitTitle(keyword, city) {
  const options = [
    ...BRANDS.map((b) => `${keyword} ${city}, CA | ${b}`),
    ...BRANDS.map((b) => `${keyword} ${city} | ${b}`),
  ]
  const len = (t) => t.replace(/&/g, '&amp;').length
  return options.find((t) => len(t) <= 60) || options[options.length - 1]
}

export const HOME_CITY = 'Buena Park'

// Schema offers: only what a customer can book. The wash never appears alone.
const DETAIL_OFFERS = [
  ['Basic Detail', 150],
  ['Premium Detail', 200],
  ['Basic Detail + Exterior Wash', 200],
  ['Premium Detail + Exterior Wash', 250],
]
const PREMIUM_OFFERS = [
  ['Premium Detail', 200],
  ['Premium Detail + Exterior Wash', 250],
]
const WASH_OFFERS = [
  ['Basic Detail + Exterior Wash', 200],
  ['Premium Detail + Exterior Wash', 250],
]

// Real Blacktop job photos (public/images).
const PHOTO = {
  tesla: { src: '/images/tesla-black.jpg', alt: 'Black Tesla with a deep gloss finish after a hand wash', w: 720, h: 960 },
  teslaFoam: { src: '/images/tesla-foam.jpg', alt: 'Tesla Model Y covered in foam in a driveway', w: 960, h: 720 },
  porscheFoam: { src: '/images/porsche-foam.jpg', alt: 'White Porsche Boxster covered in foam during a mobile hand wash', w: 960, h: 720 },
  porsche: { src: '/images/porsche-dirty.jpg', alt: 'White Porsche Boxster parked in a driveway before its wash', w: 960, h: 720 },
  chevy: { src: '/images/chevy-after.jpg', alt: 'Clean Chevrolet truck grille after a hand wash', w: 444, h: 555 },
}

const FAQ_SIZE = { q: 'Does an SUV or truck cost more?', a: 'No. Cars, SUVs, trucks and minivans all pay the same price.' }
const FAQ_WATER = { q: 'Do you need my water or an outlet?', a: 'No. We bring our own water and power.' }
const FAQ_WASH = { q: 'Can I book only the exterior wash?', a: 'No. The Exterior Wash is a $50 add-on to the Basic or Premium Detail.' }
const FAQ_GUARANTEE = { q: 'What if something is missed?', a: 'Tell us. Every detail is backed by our satisfaction guarantee, and we will make it right.' }
const FAQ_PAY = { q: 'Do I have to pay when I book?', a: 'No. Pay after the detail, or pay online at checkout with code PREPAY for $15 off.' }
const FAQ_TIME = { q: 'How long does it take?', a: 'A Basic Detail usually takes 2 to 3 hours and a Premium Detail 4 to 6 hours, depending on the car.' }

export const SERVICE_PAGES = [
  {
    path: '/car-interior-detail-buena-park',
    nav: 'Interior detail',
    city: HOME_CITY,
    title: fitTitle('Car Interior Detail', HOME_CITY),
    description: 'Car interior detail in Buena Park, CA. Basic Detail $150 or Premium Detail $200 with shampoo and extraction. Mobile, every day 8 AM to 5 PM.',
    eyebrow: 'Interior detail · Buena Park, CA',
    h1: ['Car interior detail', 'in Buena Park.'],
    lede: 'Crumbs in the seat rails, dust on the dash and floor mats that never look clean again. We clean the cabin piece by piece, right where the car is parked.',
    facts: ['From $150', 'Own water & power', 'Every day 8–5'],
    card: 'premium',
    pkg: 'basic',
    photo: PHOTO.teslaFoam,
    intro: {
      h2: 'Two levels of interior detail.',
      paras: [
        'Both details start with triple-stage vacuuming: three passes for the grit a quick vacuum leaves in the carpet, under the seats and in the seams.',
        'The $150 Basic Detail then wipes down every interior surface and cleans and restores the floor mats. It usually takes 2 to 3 hours and suits a daily driver that is dusty but not stained.',
        'The $200 Premium Detail usually takes 4 to 6 hours and adds dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
      ],
    },
    pointsTitle: 'Why book an interior detail with Blacktop',
    points: [
      { title: 'Three vacuum passes', text: 'Triple-stage vacuuming comes with both details.' },
      { title: 'Nothing to set up', text: 'We bring our own water and power to your driveway or parking spot.' },
      { title: 'Satisfaction guarantee', text: 'If something is not right, tell us and we will make it right.' },
    ],
    faqs: [
      { q: 'Basic or Premium: which do I need?', a: 'The Basic Detail for a car that is dusty but not stained. The Premium Detail when seats or carpets need shampoo and extraction.' },
      FAQ_TIME,
      FAQ_SIZE,
      FAQ_WATER,
      FAQ_PAY,
    ],
    service: { type: 'Car interior detailing', offers: DETAIL_OFFERS },
  },
  {
    path: '/car-carpet-shampoo-buena-park',
    nav: 'Carpet & seat shampoo',
    city: HOME_CITY,
    title: fitTitle('Car Carpet & Seat Shampoo', HOME_CITY),
    description: 'Car carpet and seat shampoo with extraction in Buena Park, CA, part of the $200 Premium Detail. Done at your home or work. Same price any vehicle.',
    eyebrow: 'Shampoo & extraction · Buena Park, CA',
    h1: ['Car carpet & seat shampoo', 'in Buena Park.'],
    lede: 'Spilled drinks, muddy shoes and kids in the back seat leave cloth seats and carpet stained. Shampoo with extraction pulls the dirt back out instead of pushing it deeper.',
    facts: ['$200 Premium Detail', 'Any vehicle size', 'Every day 8–5'],
    card: 'premium',
    pkg: 'premium',
    photo: PHOTO.porscheFoam,
    intro: {
      h2: 'How the shampoo is done.',
      paras: [
        'Shampoo and extraction are part of the Premium Detail. Triple-stage vacuuming comes first, so the loose dirt is gone before any water touches the fabric.',
        'Cloth seats and carpets are then shampooed and extracted, which rinses the fabric and pulls the dirty water back out. Deep carpet cleaning, interior windows, dust elimination and a UV-protectant coating finish the cabin.',
        'Most everyday spills and dirt come out. Old set-in stains, ink or dye transfer may lighten rather than disappear.',
      ],
    },
    pointsTitle: 'Good to know before you book',
    points: [
      { title: 'One price', text: '$200 for a coupe or a three-row SUV.' },
      { title: '4 to 6 hours', text: 'The usual time for a Premium Detail, depending on the car.' },
      { title: 'Add the outside', text: 'The $50 Exterior Wash makes it $250 inside and out.' },
    ],
    faqs: [
      { q: 'Does the Basic Detail include shampoo?', a: 'No. Shampoo and extraction come with the Premium Detail ($200). The Basic Detail is vacuuming, a full wipe-down and floor mats.' },
      { q: 'Will every stain come out?', a: 'Most everyday stains do. Old set-in stains, ink or dye transfer may only lighten.' },
      FAQ_SIZE,
      FAQ_PAY,
      FAQ_GUARANTEE,
    ],
    service: { type: 'Car carpet and upholstery shampoo', offers: PREMIUM_OFFERS },
  },
  {
    path: '/mobile-car-wash-and-detail-buena-park',
    nav: 'Wash & detail',
    city: HOME_CITY,
    title: fitTitle('Car Wash & Detail', HOME_CITY),
    description: 'Mobile car wash and detail in Buena Park, CA: an interior detail plus a $50 exterior hand wash, from $200. We bring our own water and power.',
    eyebrow: 'Inside & out · Buena Park, CA',
    h1: ['Car wash & detail', 'in Buena Park.'],
    lede: 'Get the inside and outside done in one visit. Pick an interior detail, add the Exterior Wash, and we take care of both in your driveway.',
    facts: ['From $200', 'Hand wash & dry', 'Own water & power'],
    card: 'combo',
    pkg: 'premium',
    photo: PHOTO.tesla,
    intro: {
      h2: 'An interior detail, then the wash.',
      paras: [
        'The Exterior Wash is an add-on, so every visit starts with the Basic Detail ($150) or the Premium Detail ($200) inside the car.',
        'For $50 more we hand wash the outside, clean the rims in detail, scrub and degrease the tires, wipe down the door jambs and panels, apply tire shine and hand dry the paint so it dries without spots.',
        'That makes $200 with the Basic Detail or $250 with the Premium Detail. We bring our own water and power, so we only need room to reach the car.',
      ],
    },
    pointsTitle: 'Inside and out in one visit',
    points: [
      { title: 'Hand washed', text: 'A hand wash, detailed rims and a spot-free hand dry.' },
      { title: 'At your address', text: 'Driveway, street or work parking lot in Buena Park.' },
      { title: '$15 off online', text: 'Use code PREPAY at checkout, or pay after the detail.' },
    ],
    faqs: [
      { q: 'How much is a wash and detail?', a: '$200 for the Basic Detail with the Exterior Wash, or $250 for the Premium Detail with the Exterior Wash.' },
      FAQ_WASH,
      FAQ_WATER,
      { q: 'Can you wash a truck or work vehicle?', a: 'Yes, at the same price. The Exterior Wash covers the paint, rims, tires and door jambs of any vehicle size.' },
      FAQ_PAY,
    ],
    service: { type: 'Mobile car wash and interior detail', offers: WASH_OFFERS },
  },
  {
    path: '/detailing-prices-buena-park',
    nav: 'Prices',
    city: HOME_CITY,
    title: fitTitle('Car Detailing Prices', HOME_CITY),
    description: 'Car detailing prices in Buena Park, CA: Basic Detail $150, Premium Detail $200, Exterior Wash add-on $50. Same price for any vehicle. Book online.',
    eyebrow: 'Prices · Buena Park, CA',
    h1: ['Car detailing prices', 'in Buena Park.'],
    lede: 'Two details, one add-on, and the price stays the same whatever you drive. Here is what each one costs, includes and how long it takes.',
    facts: ['Basic $150', 'Premium $200', 'Wash add-on $50'],
    card: 'premium',
    pkg: 'premium',
    photo: PHOTO.porsche,
    intro: {
      h2: 'What each price includes.',
      paras: [
        'Basic Detail, $150, usually 2 to 3 hours: triple-stage vacuuming for deep debris, a complete wipe-down of the interior surfaces, and floor mats cleaned and restored.',
        'Premium Detail, $200, usually 4 to 6 hours: triple-stage vacuuming plus cabin application, dust elimination, interior windows, deep carpet cleaning, cloth and carpet extraction, full interior shampooing and a UV-protectant coating.',
        'Exterior Wash, +$50 on either detail: hand wash, detailed rims, tire scrub and degrease, door jambs and panels, tire shine and a spot-free hand dry. Code PREPAY takes $15 off when you pay online.',
      ],
    },
    pointsTitle: 'Simple pricing',
    points: [
      { title: 'Same price any vehicle', text: 'A sedan and a pickup pay the same.' },
      { title: 'Visit included', text: 'The price includes coming to your Buena Park address.' },
      { title: 'Pay now or later', text: 'Prepay online for $15 off, or pay after the detail.' },
    ],
    faqs: [
      { q: 'What does the most complete visit cost?', a: '$250: the Premium Detail with the Exterior Wash.' },
      FAQ_SIZE,
      FAQ_TIME,
      FAQ_WASH,
      FAQ_GUARANTEE,
    ],
    service: { type: 'Auto detailing', offers: DETAIL_OFFERS },
  },
]

// City pages: same packages, prices and hours; local wording.
function cityPage({ slug, city, areas, lede, paras, photo, faq }) {
  return {
    path: `/auto-detailing-${slug}`,
    nav: city,
    city,
    isCity: true,
    title: fitTitle('Auto Detailing', city),
    description: `Mobile auto detailing in ${city}, CA by Blacktop. Details $150 and $200, $50 exterior wash add-on, same price any car. Every day 8 AM to 5 PM.`,
    eyebrow: `Mobile detailing · ${city}, CA`,
    h1: ['Auto detailing', `in ${city}.`],
    lede,
    facts: ['From $150', 'Own water & power', 'Every day 8–5'],
    card: 'combo',
    pkg: 'premium',
    photo,
    areas,
    intro: { h2: `We come to you in ${city}.`, paras },
    pointsTitle: `Why ${city} drivers book Blacktop`,
    points: [
      { title: 'Buena Park prices', text: 'The same $150 and $200 details and $50 wash add-on, for any vehicle.' },
      { title: 'Self-contained', text: 'We bring our own water and power, so there is nothing to hook up.' },
      { title: 'Satisfaction guarantee', text: 'If something is not right, tell us and we will make it right.' },
    ],
    faqs: [
      { q: `Do you come to ${city}?`, a: `Yes. We detail cars at homes and workplaces across ${city}, including ${areas.slice(0, 3).join(', ')}.` },
      faq,
      FAQ_SIZE,
      FAQ_WATER,
      FAQ_WASH,
    ],
    service: { type: 'Mobile auto detailing', offers: DETAIL_OFFERS },
  }
}

export const CITY_PAGES = [
  cityPage({
    slug: 'fullerton',
    city: 'Fullerton',
    areas: ['Sunny Hills', 'Downtown Fullerton', 'Golden Hill', 'the Cal State Fullerton area', 'Laguna Lake'],
    lede: 'Fullerton sits right next to Buena Park, and it gets the same mobile service: we drive to your address and detail the car where it is parked.',
    paras: [
      'We work across Fullerton, from Sunny Hills and Golden Hill to the streets around Laguna Lake, downtown and the Cal State Fullerton area.',
      'Pick the $150 Basic Detail for three vacuum passes, a full wipe-down and clean floor mats, or the $200 Premium Detail when seats and carpets need shampoo and extraction.',
      'Add the $50 Exterior Wash for a hand wash and spot-free dry. Start times run every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.teslaFoam,
    faq: { q: 'Can you detail my car at work in Fullerton?', a: 'Yes. Enter the work address when you book; we only need room around the car to open the doors.' },
  }),
  cityPage({
    slug: 'la-palma',
    city: 'La Palma',
    areas: ['Central Park', 'La Palma Avenue', 'Valley View Street', 'Walker Street', 'Orangethorpe Avenue'],
    lede: 'La Palma borders Buena Park to the south. It is a short drive for us, so you get the full detail at home without moving the car.',
    paras: [
      'We come to homes all over La Palma, from the streets around Central Park to the neighborhoods off La Palma Avenue, Walker Street, Valley View Street and Orangethorpe Avenue.',
      'The Basic Detail ($150, usually 2 to 3 hours) covers vacuuming, a full wipe-down and floor mats. The Premium Detail ($200, usually 4 to 6 hours) adds deep carpet cleaning, extraction, shampoo and UV protection.',
      'There is no extra charge for an SUV, truck or minivan, and code PREPAY takes $15 off when you pay online.',
    ],
    photo: PHOTO.porscheFoam,
    faq: { q: 'Is La Palma the same price as Buena Park?', a: 'Yes. Same packages, same prices and the same hours, every day from 8 AM to 5 PM.' },
  }),
  cityPage({
    slug: 'cypress',
    city: 'Cypress',
    areas: ['the Cypress College area', 'Lincoln Avenue', 'Ball Road', 'Katella Avenue', 'the Los Alamitos Race Course area'],
    lede: 'Cypress is just south of Buena Park. Book a detail for your home or office and we bring everything we need with us.',
    paras: [
      'We detail cars throughout Cypress, from the Cypress College area and the homes along Lincoln Avenue and Ball Road to the streets near Katella Avenue and the Los Alamitos Race Course.',
      'Book the $150 Basic Detail or the $200 Premium Detail, which adds full shampoo and cloth and carpet extraction to the interior.',
      'Want the outside done too? The $50 Exterior Wash adds a hand wash, detailed rims, tire shine and a spot-free hand dry.',
    ],
    photo: PHOTO.tesla,
    faq: { q: 'How much is inside and out in Cypress?', a: '$250 for the Premium Detail with the Exterior Wash, or $200 for the Basic Detail with the Exterior Wash.' },
  }),
  cityPage({
    slug: 'la-mirada',
    city: 'La Mirada',
    areas: ['La Mirada Creek Park', 'the Biola University area', 'Imperial Highway', 'La Mirada Boulevard', 'Valley View Avenue'],
    lede: 'La Mirada is right across the county line from Buena Park, and it gets the same mobile detailing at the same prices.',
    paras: [
      'We come to homes and workplaces across La Mirada, from the neighborhoods around La Mirada Creek Park and Biola University to the streets off Imperial Highway, La Mirada Boulevard and Valley View Avenue.',
      'Choose the $150 Basic Detail or the $200 Premium Detail with deep carpet cleaning, extraction, full shampoo and a UV-protectant coating.',
      'Add the $50 Exterior Wash for the outside. Pay online with code PREPAY for $15 off, or pay after the detail.',
    ],
    photo: PHOTO.chevy,
    faq: { q: 'Do you charge more to come to La Mirada?', a: 'No. La Mirada pays the same prices as Buena Park.' },
  }),
  cityPage({
    slug: 'cerritos',
    city: 'Cerritos',
    areas: ['Cerritos Towne Center', 'Los Cerritos Center', 'Cerritos Regional Park', 'Bloomfield Avenue', 'Del Amo Boulevard'],
    lede: 'Cerritos is Buena Park’s neighbor to the west. Book a detail and we set up in your driveway or at your office parking.',
    paras: [
      'We detail cars across Cerritos, from the homes near Cerritos Regional Park and Bloomfield Avenue to the offices around Cerritos Towne Center, Los Cerritos Center and Del Amo Boulevard.',
      'The $150 Basic Detail gives the cabin three vacuum passes, a full wipe-down and clean floor mats. The $200 Premium Detail adds shampoo, extraction and a UV-protectant coating.',
      'Same price for any vehicle size, and start times every day from 8 AM to 5 PM.',
    ],
    photo: PHOTO.porsche,
    faq: { q: 'Can I book for a weekend in Cerritos?', a: 'Yes. We work every day of the week, with start times from 8 AM to 5 PM.' },
  }),
  cityPage({
    slug: 'anaheim',
    city: 'Anaheim',
    areas: ['West Anaheim', 'Downtown Anaheim', 'the Anaheim Resort area', 'the Platinum Triangle', 'Anaheim Hills'],
    lede: 'West Anaheim starts at the Buena Park line. We bring the same interior details, and the hand wash if you want it, anywhere in Anaheim.',
    paras: [
      'We come to homes and workplaces across Anaheim, from West Anaheim and downtown to the Anaheim Resort area, the Platinum Triangle and Anaheim Hills.',
      'Pick the $150 Basic Detail or the $200 Premium Detail when the seats and carpets need shampoo and extraction.',
      'The $50 Exterior Wash adds a hand wash, rims, tire shine and a spot-free dry. Code PREPAY takes $15 off when you pay online.',
    ],
    photo: PHOTO.teslaFoam,
    faq: { q: 'Do you cover Anaheim Hills too?', a: 'Yes. All of Anaheim gets the same prices and hours as Buena Park.' },
  }),
]

export const LANDING_PAGES = [...SERVICE_PAGES, ...CITY_PAGES]

export function findLanding(path) {
  return LANDING_PAGES.find((p) => p.path === path)
}
