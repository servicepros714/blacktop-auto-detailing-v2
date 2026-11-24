# Blacktop Auto Detailing

Mobile car detailing site for Blacktop Auto Detailing (Buena Park, CA), live at
https://blacktopautodetailing.site (no www; www redirects to it).
Vite + React 18, React Router, Stripe (Payment Element + Express Checkout), Cloudflare Pages,
and a Cloudflare Worker that stores bookings in the shared D1 database on the Remoticojobs account.

- Booking IDs start with `BLK-`, bookings are stored with `source = 'blacktop-buena-park'`.
- Services: Basic Detail $150 (about 2–3 hours), Premium Detail $200 (about 4–6 hours),
  Exterior Wash +$50 (add-on only, the Worker rejects it on its own). Same price for any vehicle.
  Coupon `PREPAY` = $15 off when paying online.
- Slots: start times 8:00 AM to 5:00 PM, every 30 minutes, 7 days a week, Pacific time,
  4-hour lead time, up to 90 days ahead. Keep `src/config/business.js` and `worker/worker.js` in sync.

## Build

```bash
npm install
npm run build   # vite build + SSR build + scripts/prerender.js
```

`scripts/prerender.js` writes one static HTML file per route (`dist/<slug>.html`) with its own
title, description, canonical, Open Graph tags and JSON-LD, writes `dist/sitemap.xml`, and fails the
build if a title is over 60 or a description over 160 characters. Booking, checkout and
confirmation ship head tags only (they render in the browser). There is no `_redirects` file:
Cloudflare Pages serves `dist/404.html` for unknown URLs, and `public/_headers` keeps
`*.pages.dev` out of search results.

## Where things live

- Business facts, prices, hours, home FAQ, reviews, Google profile link: `src/config/business.js`
  (confirmed facts are listed at the top)
- Head tags and schema: `src/lib/seo.js`
- Service and city landing pages (data): `src/lib/pages.js`, rendered by `src/pages/Landing.jsx`
- Sections shared by home and landing pages: `src/components/Sections.jsx`
- Reviews: `REVIEWS` in `src/config/business.js` (real Google reviews only; the section and its menu
  link stay hidden while the list is empty)
- Photos: `public/images/`, share image `public/og-image.jpg`

## Booking flow

1. `/book` saves the choices in sessionStorage; `/checkout` shows the total.
2. Card / Apple Pay / Google Pay / Link: `POST /api/create-payment-intent` (the Worker prices it),
   the browser confirms with Stripe, then `/confirmation` calls `POST /api/bookings` with the
   `paymentIntentId`. The Worker re-reads the PaymentIntent from Stripe and checks status, site,
   amount, services, date and time before saving it as Paid. If the slot was taken meanwhile, it
   refunds the payment automatically.
3. "I'll pay later": `/confirmation` calls `POST /api/bookings` with `payLater: true`.
4. Each new booking sends one `booking_confirmed` event to the GHL webhook
   (`booking_notifications` makes sure it is sent only once). Pricing and the PaymentIntent are
   stored in `booking_payments`, like the other Remoticojobs sites.

## Worker

`worker/worker.js`, config in `worker/wrangler.jsonc` (account Remoticojobs, D1
`detailing-bookings-remoticojobs`, shared with Alera, Apex, Aventa and Aurum; every query is
scoped by `source`). The Worker never creates or alters tables. Deploy from `worker/`:

```bash
npx wrangler deploy
```

Secrets (dashboard → Workers → blacktop-auto-detailing-v2 → Settings → Variables and Secrets):

| Name | Required | What |
|---|---|---|
| `STRIPE_SECRET_KEY` | yes | Same Stripe account as `VITE_STRIPE_PUBLISHABLE_KEY` |
| `GHL_WEBHOOK_URL` | yes | GoHighLevel inbound webhook for the booking email |
| `ADMIN_TOKEN` | no | `Authorization: Bearer <token>` for `GET/PATCH /api/bookings` (closed without it) |

## Site deploy

Cloudflare Pages project `blacktop-auto-detailing-v2` on Remoticojobs (direct upload, no Git connection):

```bash
npm run build
npx wrangler pages deploy dist --project-name blacktop-auto-detailing-v2 --branch main
```

`.env.local` holds only public values (Stripe publishable key, Worker URL) and is committed on purpose.
