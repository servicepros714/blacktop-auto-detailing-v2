# Blacktop Auto Detailing

Vite + React booking site for Blacktop Auto Detailing (Buena Park, CA). Cloudflare Pages front end, Cloudflare Worker + D1 for bookings, Stripe for payments.

## Wire-up checklist

1. **Worker**: create a Worker from `worker/index.js`, bind the D1 database as `DB`, and add secrets `STRIPE_SECRET_KEY` (and optionally `ADMIN_TOKEN`).
2. **`.env.local`**: replace `VITE_API_URL` with the Worker URL and `VITE_STRIPE_PUBLISHABLE_KEY` with the publishable key. Until both are replaced the site runs in demo mode (no real payments or saved bookings).
3. **GitHub**: push to `main`. Repo secrets needed: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`.
4. **Cloudflare Pages**: project name `blacktop-auto-detailing` (created on first deploy), build `npm run build`, output `dist`.

## Local

```
npm install
npm run dev
```

Business details, services, prices, coupon, service area and FAQ all live in `src/config/business.js`. Add real customer reviews to the `REVIEWS` array there and the reviews section appears automatically.
