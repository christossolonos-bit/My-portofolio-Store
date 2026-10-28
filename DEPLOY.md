# Deploy Solonaras Store + Guide

## Two Railway services

1. **Store (this repo root)**  
   - Build: `npm run build`  
   - Start: `npx serve dist -s -l $PORT` (see `railway.toml`)  
   - Env: `VITE_ASSISTANT_URL`, `VITE_SITE_URL`, optional Stripe/webhook/analytics

2. **Assistant (`assistant/`)**  
   - Use existing `assistant/railway.toml`  
   - Env: `NVIDIA_API_KEY`, `ASSISTANT_MODE=portfolio`, TTS keys as needed  
   - Allow CORS from the store origin

Rebuild the store after setting `VITE_*` so they bake into the client bundle.

## Shopify product links (Option 1)

Portfolio stays on Railway/Vite. Default shop: `christossolonos.myshopify.com`.

Each build shows **View on Shopify** → `/products/{handle}` (handles = project ids).

### Import all 12 builds (one CSV)

1. Open [Shopify Admin → Products](https://admin.shopify.com/store/christossolonos/products).
2. **Import** → upload `shopify/products-import.csv` from this repo.
3. Confirm the preview, then import. Products publish as active (no shipping; service-style).
4. Optional: add images / media in Admin for each product.
5. Rebuild the portfolio if needed — default handles already match the CSV.

Regen CSV after editing catalog data:

```bash
node shopify/generate-products-csv.mjs
```

If you change a handle in Shopify, map it in `.env`:

```env
VITE_SHOPIFY_STORE=christossolonos.myshopify.com
VITE_SHOPIFY_HANDLES={"luna-agent":"your-new-handle"}
```

Optional later for cart buy: `VITE_SHOPIFY_VARIANTS` with variant IDs.

Project ids / handles: `luna-agent`, `luna-gaida`, `luna-minecraft`, `luna-streamer`, `luna-vision`, `dj-agent`, `fluffy`, `singing-sdk`, `lunariko`, `choko`, `book-editor`, `client-work`.

## Local

```bash
npm run dev          # store + guide
# or
npm run dev:store
npm run assistant:dev
```

`/questionnaire` only works in local `DEV` — not in production builds.
