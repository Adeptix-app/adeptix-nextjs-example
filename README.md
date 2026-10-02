# Adeptix + Next.js example

A minimal Next.js (App Router) example showing both API categories end to end:

- `src/app/page.tsx` — a client component with two buttons: pay by card (Merchant Payments API) or
  pay in USDC (Crypto Payments API)
- `src/app/api/checkout/merchant/route.ts` — creates a hosted checkout, returns its URL for the
  client to redirect to
- `src/app/api/checkout/crypto/route.ts` — creates a crypto payment request, returns the deposit
  details for the client to display
- `src/app/api/webhooks/adeptix/route.ts` — signature-verified webhook handler that marks an order
  paid

Orders are kept in a module-level `Map` (`src/lib/orders.ts`) purely so this example has something
to mark "paid" — replace that with your real database; the lookup/update shape stays the same. Note
this in-memory approach only works for a single local dev server process, not a real deployment.

## Run it

```bash
npm install
ADEPTIX_API_KEY=ak_live_... ADEPTIX_WEBHOOK_SECRET=whsec_... npm run dev
```

Then open http://localhost:3000.

`npm install` pulls the [Adeptix Node SDK](https://github.com/Adeptix-app/adeptix-node) straight
from GitHub (it isn't on the npm registry yet), so `git` needs to be on your `PATH`.

To receive webhooks locally, tunnel your dev server (e.g. with `cloudflared tunnel` or
`ngrok http 3000`) and set the tunnel's URL + `/api/webhooks/adeptix` as your webhook URL in the
Adeptix dashboard's Settings page, alongside the same secret you pass as `ADEPTIX_WEBHOOK_SECRET`
here.

Full API reference: **https://docs.adeptix.app**

## Verified

`next build` succeeds with no errors, and every route was exercised for real against the live
production Adeptix API: both checkout routes correctly propagate a real `401 unauthorized` (using a
deliberately invalid key) all the way from `api.adeptix.app` through the SDK's error handling into
the route's own JSON response, and the webhook route correctly accepts a real HMAC-signed payload
(200) and rejects a tampered/invalid one (401).
