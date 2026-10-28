# Solonaras Store guide API

This folder is a **forked copy** of [kwstas-website-assistant](https://github.com/christossolonos-bit/kwstas-website-assistant).

That original repo powers a **different site** (YGIA Natural Health shop).  
**This copy is for Solonaras Store only.**

## Behavior

- `ASSISTANT_MODE` defaults to `portfolio`
- Answers come from Solonaras portfolio knowledge / page scan / FAQs
- No YGIA products, shipping, COD, or shop phone (`+357 22 610 418`)
- Contact = end-of-aisle form → `christossolonos@gmail.com` + socials on the store

To force the old shop brain (not for this site): `ASSISTANT_MODE=ygia` — do not use on Solonaras.

## Run with the store

From the portfolio root:

```bash
cp .env.example .env   # if needed
# set NVIDIA_API_KEY in assistant/.env
npm run dev
```

Or API only:

```bash
npm run assistant:seed
npm run assistant:dev
```
