# Affordable Air Direct — Instant HVAC Quote Store

Your own in-house replacement for the Contractor Commerce store embed. A full
store page + the "Instant HVAC Quote" journey (system type → home details →
matched Good/Better/Best options → cart → schedule install). React + Vite +
Tailwind v4, no third-party subscription.

## Run it

Node lives at `~/.local/node/bin` on this machine. Start the dev server:

```bash
export PATH="$HOME/.local/node/bin:$PATH"
cd ~/affordable-air-direct-store
npm run dev
```

Then open the printed URL (e.g. http://localhost:5173). The journey lives at
`#/journey/system_type`.

Build for production: `npm run build` → static files in `dist/` (host anywhere).

## Where to edit things

| What | File |
| --- | --- |
| Company info, phone, financing terms, what's included | `src/data/config.js` |
| System types shown on step 1 | `src/data/systems.js` → `SYSTEM_TYPES` |
| Equipment tiers + installed prices | `src/data/systems.js` → `CATALOG` |
| Sizing (sqft → tonnage) + pricing/financing math | `src/lib/quote.js` |
| Brand colors / fonts | `src/index.css` (`@theme` block) |
| Header / footer | `src/components/Header.jsx`, `Footer.jsx` |
| Journey steps | `src/pages/journey/*` |
| Cart + schedule form | `src/pages/Cart.jsx` |

## Notes / next steps

- **Prices** are installed prices for a 3-ton reference job and scale per ton in
  `lib/quote.js`. Swap in your real numbers in `CATALOG`.
- **Schedule form** currently shows a confirmation screen only. To capture leads,
  POST the form payload to ServiceTitan / an email endpoint from `Cart.jsx`.
- Tier names are generic ("Value / Premium / Elite") — add real brand/model names
  and photos in `CATALOG` when ready.
