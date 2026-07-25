# Kabir — Coming Soon

A minimal "coming soon" landing page for kabir's custom domain, built with
Next.js 15 (App Router) + TypeScript. It sits in front of the full 3D
portfolio while that's still in progress.

## Stack
- Next.js (App Router, TypeScript)
- Canvas-based starfield (no external particle library)
- Google Fonts: Cormorant Garamond (display/italic) + Jost (body/labels)

## Run locally
```bash
npm install
npm run dev
```
Visit http://localhost:3000

## Build
```bash
npm run build
npm run start
```

## Deploy to a custom domain
The easiest path is Vercel (same team as Next.js):
1. Push this project to a GitHub repo.
2. Import it at vercel.com/new.
3. In the project's Settings → Domains, add your custom domain and point
   its DNS (A/CNAME per Vercel's instructions) at Vercel.
4. Every push to `main` redeploys automatically.

Any other Node host (Netlify, Render, your own VPS with `next start`) works
too — this is a standard Next.js app with no special server requirements.

## Tuning the starfield
`src/components/Starfield.tsx` has the tunables at the top of the effect:
- `STAR_DENSITY` — stars per px² (currently ~1 per 9,000px²)
- `MIN_RADIUS` / `MAX_RADIUS` — star size range
- `MIN_OPACITY` / `MAX_OPACITY` — star brightness range
- `MIN_TWINKLE_SECONDS` / `MAX_TWINKLE_SECONDS` — twinkle cycle length
- Shooting star spawn interval is randomized every 4.5–9.5s in the `draw` loop.
