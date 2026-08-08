// Central business config — edit these to tune the whole store.
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
  logo: 'https://affordableairdirect.com/wp-content/uploads/2024/05/Affordable-air-direct-Favicon-e1738786236559-300x104.png',
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
// Values can be overridden at build time via VITE_* env.
export const META = {
  pixelId: import.meta.env.VITE_META_PIXEL_ID || '25623586720641180',
  capiUrl: import.meta.env.VITE_CAPI_URL || 'https://app.affordableairla.com/api/capi',
}

// Endpoint (on aha-team-hub) that emails the customer their quote + notifies the team.
export const QUOTE_ENDPOINT =
  import.meta.env.VITE_QUOTE_URL || 'https://app.affordableairla.com/api/quote'

// Every quote includes these — shown on results + cart.
export const INCLUDED = [
  'Standard professional installation',
  'Removal & haul-away of old equipment',
  'New thermostat',
  'Permit & city inspection',
  '10-year manufacturer parts warranty',
  '1-year labor warranty',
]
