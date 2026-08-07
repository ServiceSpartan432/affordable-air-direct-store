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

// Financing shown as "as low as $X/mo". Tune term + APR to match your lender.
export const FINANCE = {
  apr: 0.0999,
  months: 120,
  label: '120 mo · 9.99% APR',
}

// Meta (Facebook) tracking. Pixel ID is public (ships in the browser).
// The CAPI access token is NEVER here — it lives only on the server relay.
// Values can also be injected at build time via VITE_META_PIXEL_ID / VITE_CAPI_URL.
export const META = {
  pixelId: import.meta.env.VITE_META_PIXEL_ID || '', // e.g. "1234567890123456"
  capiUrl: import.meta.env.VITE_CAPI_URL || '',      // e.g. "https://capi.affordableairdirect.com/capi"
}

// Every quote includes these — shown on results + cart.
export const INCLUDED = [
  'Standard professional installation',
  'Removal & haul-away of old equipment',
  'New thermostat',
  'Permit & city inspection',
  '10-year manufacturer parts warranty',
  '1-year labor warranty',
]
