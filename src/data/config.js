// Central business config — edit these to tune the whole store.

// Dynamic number insertion for ChatGPT ad traffic — see lib/phone.js. Visitors
// who arrive from a ChatGPT ad are shown this line instead of COMPANY.phone, so
// the call is credited to its own ServiceTitan campaign rather than absorbed
// into whichever campaign owns the main number.
//
// This must be a number that RINGS THE AIR DIRECT TEAM and is mapped to an Air
// Direct campaign in ServiceTitan — deliberately NOT affordableairla.com's
// ChatGPT line, which would land these callers on the AHA CSR desk when the
// whole pitch here is that nobody gets handed to a salesperson.
//
// The number is the default rather than env-only on purpose. These are
// build-time Vite vars, so a deploy that simply forgot to set them would
// silently put the untracked number back with nothing to see — the same shape
// of bug as a var missing from the hub's compose allowlist. It is not a secret;
// it is printed on the page. The env var still overrides for a one-off build.
//
// Set `phone` to '' to turn the swap off entirely.
export const CHATGPT_ADS = {
  phone: import.meta.env.VITE_CHATGPT_ADS_PHONE ?? '+1 818-217-1540',
  phoneHref: import.meta.env.VITE_CHATGPT_ADS_PHONE_HREF ?? 'tel:8182171540',
}

export const COMPANY = {
  name: 'Affordable Air Direct',
  parent: 'Affordable Heating and Air',
  tagline: 'Direct, affordable, quality HVAC. No salespeople.',
  phone: '+1 818-208-4291',
  phoneHref: 'tel:8182084291',
  email: 'info@affordableairdirect.com',
  address: '9614 Cozycroft Ave # F, Chatsworth, CA 91311',
  license: '1081403',
  mapHref: 'https://maps.app.goo.gl/4TZ5yAGvNeDW9JdCA',
  logo: 'https://affordableairdirect.com/logo.png',
  socials: {
    facebook: 'http://facebook.com/affordableairdirect',
    x: 'https://x.com/AffordableAirDi',
    instagram: 'https://www.instagram.com/affordable_air_direct/',
  },
}

// Financing: flat payment factor per dollar over the term (matches the sample
// quote — e.g. $9,037 -> $114.28/mo). monthly = price * monthlyFactor.
export const FINANCE = {
  monthlyFactor: 0.012646, // ~$12.65 per $1,000 financed, 120-month term
  months: 120,
  label: '120-month financing',
}

// Clientcare contact shown on the quote (separate from the store's general line).
export const CLIENTCARE = {
  email: 'Clientcare@affordableairdirect.com',
  phone: '(818) 452-5794',
}

// Meta (Facebook) tracking. Pixel/Dataset ID is public (ships in the browser).
// The CAPI access token is NEVER here — it lives only on the server route.
// The API runs in the aha_team_hub container but is exposed under the store's
// own domain (capi.affordableairdirect.com) so fbp/fbc are first-party.
// Values can be overridden at build time via VITE_* env.
export const META = {
  pixelId: import.meta.env.VITE_META_PIXEL_ID || '25623586720641180',
  capiUrl: import.meta.env.VITE_CAPI_URL || 'https://capi.affordableairdirect.com/api/capi',
}

// Endpoint that emails the customer their quote + notifies the team.
export const QUOTE_ENDPOINT =
  import.meta.env.VITE_QUOTE_URL || 'https://capi.affordableairdirect.com/api/quote'

// First-party funnel telemetry (step-by-step drop-off). Same host as the quote
// endpoint so it is first-party and covered by the same CORS rule. Set
// VITE_FUNNEL_URL="" at build time to compile the beacons out entirely.
export const FUNNEL_ENDPOINT =
  import.meta.env.VITE_FUNNEL_URL ?? 'https://capi.affordableairdirect.com/api/funnel'

// Absolute base for equipment images (emails need absolute URLs). The store
// takes over the whole site, so images live at the root domain's /equipment.
export const ASSET_BASE =
  import.meta.env.VITE_ASSET_BASE || 'https://affordableairdirect.com/equipment'

// Every quote includes these — shown on results + cart.
export const INCLUDED = [
  'Standard professional installation',
  'Removal & haul-away of old equipment',
  'New thermostat',
  'Permit & city inspection',
  '10-year manufacturer parts warranty',
  '1-year labor warranty',
]
