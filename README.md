# Solonaras Store

Scroll-through portfolio for [Christos Solonos](https://github.com/christossolonos-bit) — Three.js atmosphere, product tours, Shopify product links, and an in-page voice guide.

Repo: [christossolonos-bit/My-portofolio-Store](https://github.com/christossolonos-bit/My-portofolio-Store)

## Run locally

```bash
npm install
npm run assistant:install
cp .env.example .env
cp assistant/.env.example assistant/.env
# set NVIDIA_API_KEY=nvapi-... in assistant/.env
npm run dev
```

- Store → http://localhost:5173  
- Guide API → http://localhost:3000 (proxied as `/api` in Vite)

## Deploy on Railway (two services)

Use this monorepo twice — one service for the static store, one for the guide API. See `DEPLOY.md` for Shopify and env detail.

### 1) Store (root)

| Setting | Value |
|--------|--------|
| Root directory | `/` (repo root) |
| Config | `railway.toml` |
| Build | `npm run build` |
| Start | `npx serve dist -s -l $PORT` |

**Build-time env** (Vite bakes these in):

```env
VITE_SITE_URL=https://your-store.up.railway.app
VITE_ASSISTANT_URL=https://your-assistant.up.railway.app
VITE_SHOPIFY_STORE=christossolonos.myshopify.com
```

### 2) Assistant (`assistant/`)

| Setting | Value |
|--------|--------|
| Root directory | `assistant` |
| Config | `assistant/railway.toml` |
| Build | seeds knowledge + `next build` |
| Start | `npm run start` |

**Runtime env:**

```env
ASSISTANT_MODE=portfolio
NVIDIA_API_KEY=nvapi-...
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=nvidia/nemotron-3.5-lightning-30b-a3b
TTS_PROVIDER=edge
SITE_BASE_URL=https://your-store.up.railway.app
NEXT_PUBLIC_APP_URL=https://your-assistant.up.railway.app
DEMO_MODE=false
ADMIN_SECRET=change-me
```

After both are live, set `VITE_ASSISTANT_URL` / `VITE_SITE_URL` on the store service and **redeploy the store** so the client bundle picks them up.

## Shopify

Import `shopify/products-import.csv` in Shopify Admin → Products → Import. Portfolio links use matching handles (`/products/luna-agent`, etc.).

## Stack

Vite · React · TypeScript · Three.js · React Three Fiber · Next.js guide API · Shopify (Option 1 links)
