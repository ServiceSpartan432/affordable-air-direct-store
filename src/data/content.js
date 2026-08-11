// ---------------------------------------------------------------------------
// Site content ported from the original affordableairdirect.com WordPress site.
// Edit copy here — pages render from this data.
// ---------------------------------------------------------------------------

// Pulled live from the real Affordable Air Direct Google Business Profile
// (not the parent Affordable Heating and Air listing, which is a different,
// much larger profile). This grows continuously — verify + refresh
// periodically (checked 2026-08-10, was 49 then 51 within the same day):
// https://www.google.com/maps?cid=15696765585030183137
export const RATING = { stars: 4.9, count: 51 }
export const GOOGLE_REVIEWS_URL = 'https://www.google.com/maps?cid=15696765585030183137'

// Exact NAP as it appears on the Google Business Profile above — keep this
// byte-for-byte consistent with GBP (name/address/phone mismatches actively
// hurt local ranking). Geo pulled from the same listing.
export const GEO = { lat: 34.2450286, lng: -118.5814663 }

export const STEPS_HOW = [
  {
    n: 1,
    title: 'Answer a few quick questions',
    text: 'Tell us about your home online — or talk it through by phone or Zoom. It takes about two minutes and there is never a salesperson.',
  },
  {
    n: 2,
    title: 'See your instant quote',
    text: 'Real installed prices on screen, matched to your home. Your quote is emailed to you and our team pre-engineers the job before install day.',
  },
  {
    n: 3,
    title: 'We install your HVAC',
    text: 'Certified technicians install your system — most jobs in a single day — with permit, haul-away, and warranty included.',
  },
]

export const WHY_US = [
  { title: 'Buy direct, save 30-40%', text: 'Wholesale pricing with no showroom markup and no commissioned salespeople in your living room.' },
  { title: 'Transparent process', text: 'The price you see is the price you pay — equipment, labor, permit, and haul-away included.' },
  { title: '100% satisfaction guarantee', text: 'We stand behind every install with real manufacturer and labor warranties.' },
  { title: 'Reliable installation', text: 'Our own certified crews — a division of Affordable Heating and Air, license #1081403.' },
]

export const SERVICES = [
  {
    id: 'ac',
    title: 'Air Conditioning Installation',
    text: 'Central AC systems sized and installed right, from value single-stage to whisper-quiet inverter systems.',
    journey: 'cooling',
  },
  {
    id: 'heating',
    title: 'Heating System Installation',
    text: 'Gas furnaces from 80% to 98% AFUE — installed, permitted, and warrantied.',
    journey: 'heating',
  },
  {
    id: 'complete',
    title: 'Complete System Replacement',
    text: 'AC + furnace together for the best long-term value and efficiency.',
    journey: 'both',
  },
  {
    id: 'heatpump',
    title: 'Heat Pump Conversion',
    text: 'Go all-electric with one efficient system that heats and cools your whole home.',
    journey: 'heatpump',
  },
  {
    id: 'minisplit',
    title: 'Mini-Split Single & Multi-Zone',
    text: 'Ductless comfort for additions, garages, and homes without ductwork. Quoted by our team.',
    journey: null,
  },
  {
    id: 'wallheater',
    title: 'Wall Heater Installation',
    text: 'Fast, clean wall heater replacements. Quoted by our team.',
    journey: null,
  },
]

export const BRANDS = ['American Standard', 'Carrier', 'Mitsubishi Electric', 'Daikin', 'Lennox', 'Goodman']

// Real customer reviews, pulled directly from our Google Business Profile
// (see GOOGLE_REVIEWS_URL above) — not written copy. Refresh from the source
// periodically; don't invent or edit the wording.
export const TESTIMONIALS = [
  {
    name: 'Teri A.',
    when: '2 weeks ago',
    text: 'Juan G arrived at our home with a wonderful smile and introduction even though we were his last customer of the day! He worked tirelessly to resolve our problem and gave us updates as he went along.',
  },
  {
    name: 'Christine M.',
    when: '2 weeks ago',
    text: "Juan was terrific! He was prompt, professional & he explained everything clearly. He interfaced with Rheem to verify my HVAC warranty coverage. I'm very happy now.",
  },
  {
    name: 'Cynthia B.',
    when: '11 months ago',
    text: 'We had to replace our central HVAC system and Alfredo was great through the entire process. Attentive, communicative, and ensuring we were taken care of. Will definitely come back for any HVAC needs.',
  },
]

// Real installs, photographed on real jobs — from our Google Business Profile.
export const INSTALL_PHOTOS = [
  { src: '/reviews/install-1.jpg', alt: 'Furnace installed in a customer attic by our crew' },
  { src: '/reviews/install-2.jpg', alt: 'HVAC system installed in a customer attic by our crew' },
]

export const FAQS = [
  {
    q: 'How much can I save with Affordable Air Direct?',
    a: 'Typically 30-40% versus traditional retail HVAC pricing. We connect you directly to wholesale equipment pricing and skip the commissioned sales visit, so you are not paying for a salesperson or a showroom.',
  },
  {
    q: 'What makes Affordable Air Direct different from other HVAC companies?',
    a: 'No salespeople — ever. You see real installed prices online in about two minutes, matched to your home. We are a woman-owned division of Affordable Heating and Air (license #1081403), so your install is done by our own certified crews, not subcontractors.',
  },
  {
    q: 'What is included in the installed price?',
    a: 'Equipment, professional installation, removal and haul-away of your old system, a new thermostat, permit and city inspection, a 10-year manufacturer parts warranty, and a labor warranty. The price you see is the price you pay.',
  },
  {
    q: 'How does the process work?',
    a: 'Answer a few questions about your home, see your instant quote with Base / Good / Better / Best options, and pick one. We confirm the details with a quick pre-install visit — at no charge — then our certified technicians install your system, usually in a single day.',
  },
  {
    q: 'Is financing available?',
    a: 'Yes — every quote shows a monthly payment option alongside the installed price, with 120-month financing available on approved credit.',
  },
  {
    q: 'What areas do you serve?',
    a: 'We proudly serve homeowners all over the greater Los Angeles area from our Chatsworth headquarters.',
  },
  {
    q: 'What if my home needs something unusual?',
    a: 'Your quote is pending final engineering — a real person reviews every job before install day. If anything about your home needs special handling, we will let you know up front and work out the details before any work begins.',
  },
]

export const ABOUT = {
  headline: 'A smarter, more affordable way to buy HVAC',
  body: [
    "At Affordable Air Direct, we're changing the way homeowners shop for HVAC systems. Instead of paying inflated retail prices or dealing with pushy salespeople, we connect you directly to wholesale HVAC pricing — paired with expert consultation and professional installation.",
    'We are a woman-owned division of Affordable Heating and Air (California license #1081403), serving the greater Los Angeles area. Our own certified crews handle every installation — no subcontractors, no games, no salespeople.',
    'Quality, efficiency, and expert installation at unbeatable prices. That is the whole pitch.',
  ],
}
