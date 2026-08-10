// Ad-landing headline/subhead variants — swap via ?promo=<key> so ad copy and
// page copy always match ("message match" is a real Meta Landing Page
// Experience + conversion-rate factor). Add a new key per campaign theme;
// unknown/missing keys fall back to `default`.
export const LANDING_COPY = {
  default: {
    eyebrow: 'INSTANT SAME-DAY QUOTES · NO SALESPEOPLE',
    headline: 'A new HVAC system, priced in 2 minutes.',
    sub: 'Save 30-40% buying direct. See your real installed price online — no in-home sales visit, ever.',
  },
  summer: {
    eyebrow: 'BEAT THE HEAT · INSTANT PRICING',
    headline: 'Stay cool this summer — see your AC price now.',
    sub: 'Real installed pricing in 2 minutes. Save 30-40% buying direct, no salesperson required.',
  },
  heatpump: {
    eyebrow: 'ALL-ELECTRIC COMFORT · INSTANT PRICING',
    headline: 'One system. Heating and cooling. Priced instantly.',
    sub: 'See your real heat pump installed price in 2 minutes — save 30-40% buying direct.',
  },
  financing: {
    eyebrow: '120-MONTH FINANCING AVAILABLE',
    headline: 'A new HVAC system for as little as $X/mo.',
    sub: 'See your real price and monthly payment in 2 minutes — no salesperson, no pressure.',
  },
}

export function landingCopyFor(promo) {
  return LANDING_COPY[promo] || LANDING_COPY.default
}
