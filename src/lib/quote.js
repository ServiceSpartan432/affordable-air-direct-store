import { CATALOG } from '../data/catalog.js'
import { SIZE_TO_TONS } from '../data/journey.js'
import { FINANCE, ASSET_BASE } from '../data/config.js'

export const money = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

// two-decimal money (used for financing to match the sample quote)
export const money2 = (n) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

// Customer-facing tier names (sheet tier -> label shown on cards & quote).
export const TIER_LABEL = {
  'Standard': 'Base',
  'Very Good': 'Good',
  'Excellent': 'Better',
  'Best of the Best': 'Best',
  'Good': 'Good',
  'Better': 'Better',
  'Best': 'Best',
}
export const tierLabel = (tier) => TIER_LABEL[tier] || tier

// ---- Routing: answers -> which catalog (matchup set) ----------------------
// Cooling -> AC+Coil, Heating -> Furnace, Heating+Cooling -> Full-Split System,
// with a Packaged Unit answer overriding to the package catalog.
export function resolveSystemKey(answers = {}) {
  if (answers.unit_location === 'package') return 'package'
  if (answers.system_type === 'heatpump') return 'heatpump'
  if (answers.system_type === 'cooling') return 'ac'
  if (answers.system_type === 'heating') return 'heating'
  return 'both'
}

export function resolveTons(answers = {}) {
  return SIZE_TO_TONS[answers.size] ?? SIZE_TO_TONS.unknown
}

// ---- Financing ------------------------------------------------------------
// Flat factor per dollar (matches the sample quote). Returns a precise (2dp)
// figure; callers round for display as needed.
export function monthlyPayment(principal, { monthlyFactor = FINANCE.monthlyFactor } = {}) {
  return Math.round(principal * monthlyFactor * 100) / 100
}

// ---- Build the priced options for the results step ------------------------
export function buildQuote(answers = {}) {
  const systemKey = resolveSystemKey(answers)
  const tons = resolveTons(answers)
  const cat = CATALOG[systemKey]
  if (!cat) return { systemKey, tons, label: '', options: [] }

  // exact ton match, else nearest available size
  const available = Object.keys(cat.matchups).map(Number).sort((a, b) => a - b)
  const chosen = available.includes(tons)
    ? tons
    : available.reduce((best, t) => (Math.abs(t - tons) < Math.abs(best - tons) ? t : best), available[0])

  const rows = cat.matchups[String(chosen.toFixed(1))] || cat.matchups[String(chosen)] || []

  const options = rows.map((row) => ({
    ...row,
    systemKey,
    label: cat.label,
    tons: chosen,
    monthly: monthlyPayment(row.price),
    sku: `${systemKey}-${row.tier.toLowerCase().replace(/\s+/g, '-')}-${String(chosen).replace('.', '')}`,
  }))

  return { systemKey, tons: chosen, label: cat.label, options }
}

// Turn the (inconsistently formatted) model text into short card bullets.
// Returns [{text, kind}] — kind lets the UI emphasize SEER (bold, per the
// client) and warranty terms (the actual product differentiator between
// tiers) instead of treating every bullet the same. Every distinct fact the
// text supports is returned — earlier this capped at 4 bullets total, which
// silently dropped the parts-warranty line on cards whose AC and furnace each
// carry their own separate warranty clause (parts on the AC, labor on the
// furnace) once SEER/AFUE/speed-type had already used 3 of the 4 slots.
export function modelBullets(row) {
  const bits = []
  const push = (text, kind = 'spec') => { if (text && !bits.some((b) => b.text === text)) bits.push({ text, kind }) }
  const text = [row.model, row.furnace].filter(Boolean).join(' ')

  // efficiency: "21 SEER", "Goodman 14 AC", "16 True Inverter", "15 SEER HP",
  // or a bare trailing rating like "American Standard Gold 15" (product-line
  // name + number, no AC/HP/SEER suffix — fall back to a plausible SEER2 range).
  const seer =
    text.match(/(\d{2}(?:\.\d)?)\s*SEER/i) ||
    text.match(/\b(\d{2}(?:\.\d)?)\s*(?:AC|HP|True\s*Inverter)\b/i) ||
    text.match(/\b(1[3-9]|2[0-4])\s*$/)
  if (seer) push(`Up to ${seer[1]} SEER2`, 'seer')

  // heating efficiency: "80%", "96% AFUE"
  const afue = text.match(/(\d{2})\s*%/)
  if (afue) push(`${afue[1]}% AFUE furnace`)

  if (/inverter/i.test(text)) push('True inverter — quiet & variable speed')
  else if (/variable[-\s]speed/i.test(text)) push('Variable-speed comfort')
  else if (/ECM|\d\s*speed/i.test(text)) push('Multi-speed blower motor')

  if (/10[-\s]*99\s*year|unit replacement/i.test(text)) push('10-yr unit replacement coverage', 'warranty')
  // Labor and parts warranty are independent facts (often on different
  // components — labor on the furnace, parts on the AC) — check both, always.
  if (/10\s*year[s]?\s*(full\s*)?(labor|warranty)|full warranty labor/i.test(text)) push('10-year labor warranty', 'warranty')
  else if (/5\s*year[s]?\s*labor/i.test(text)) push('5-year labor warranty', 'warranty')
  if (/10\s*year[s]?\s*parts/i.test(text)) push('10-year parts warranty', 'warranty')

  // never render an empty card
  if (!bits.length) push('Professionally installed & warrantied')
  return bits
}

// NOTE on equipment imagery: we do NOT map photos by brand alone — a brand
// covers many product lines with different cabinet shapes/discharge types,
// and guessing caused real mismatches (package unit shown as a split system,
// a non-side-discharge photo used for a side-discharge unit). We show a
// photo in exactly three cases, in priority order:
//   1. The text names a *specific, verified* third-party product line
//      (currently: Carrier Infinity, confirmed against carrier.com's own
//      product photos).
//   2. The text is genuine Goodman equipment — sold AS Goodman, not private-
//      labeled — so it gets Goodman's own real nameplate photo, no logo of
//      ours on it (corrected 2026-08-17: the package unit was wrongly
//      showing our badge on Goodman-branded gear; client supplied the real
//      unbadged Goodman product photo instead).
//   3. The text is "Affordable" — the same Goodman-sourced hardware, private
//      -labeled under the shop's own name — which gets OUR branded photo
//      (nameplate and all, supplied directly by the client, 2026-08-17).
// Everything else (Carrier lines other than Infinity, American Standard,
// Trane, etc.) names a real competitor product we have no verified photo
// for — showing a branded photo there would misrepresent the brand. Those
// fall back to the honest category icon in Results.jsx instead.
const VERIFIED_PHOTOS = {
  'carrier-infinity-ac': 'carrier-infinity-ac.jpg',           // Infinity 21 AC (26VNA1) — carrier.com
  'carrier-infinity-furnace': 'carrier-infinity-furnace.jpg', // Infinity 95 furnace (59CU5) — carrier.com
}
// Real Goodman-branded product photos (their own nameplate, not ours) — only
// have a package-unit shot so far; AC/furnace still fall back to OUR_PHOTOS
// below until matching unbadged Goodman photos are supplied.
const GOODMAN_PHOTOS = {
  package: 'goodman-package.jpg',
}
const OUR_PHOTOS = {
  ac: 'affordable-ac.jpg',
  furnace: 'affordable-furnace.jpg',
  package: 'affordable-package.jpg',
}

const isInfinity = (t) => /infinity/i.test(t || '')
const NAMED_COMPETITOR = /\b(Carrier|American Standard|Trane|Daikin|Lennox|Rheem|Bryant)\b/i
// Genuine Goodman (sold as itself) vs. our "Affordable" private label — a
// stray "Affordable 16 True Inverter" sitting in an otherwise Carrier-
// branded sheet row (a real data-entry inconsistency upstream) must NOT get
// a branded photo just because it says "Affordable" if a competitor name is
// also present.
const isGoodman = (t) => /\bGoodman\b/i.test(t || '') && !NAMED_COMPETITOR.test(t || '')
const isAffordable = (t) => /\bAffordable\b/i.test(t || '') && !NAMED_COMPETITOR.test(t || '')

// Returns [{src, alt}] for the row's condenser/AC and/or furnace.
// `systemKey==='heating'` stores the furnace in `row.model` (no separate
// `row.furnace` field); `systemKey==='package'` is a single combined unit
// (also stored in `row.model`) — both handled as their own cases so a
// package unit is never rendered as a split-system condenser or vice versa.
export function equipmentImages(row, systemKey, { absolute = false } = {}) {
  const base = absolute ? ASSET_BASE : `${import.meta.env.BASE_URL}equipment`
  const photo = (file, alt) => ({ src: `${base}/${file}`, alt })
  const imgs = []

  if (systemKey === 'package') {
    if (isInfinity(row.model)) imgs.push(photo(VERIFIED_PHOTOS['carrier-infinity-ac'], 'Carrier Infinity'))
    else if (isGoodman(row.model)) imgs.push(photo(GOODMAN_PHOTOS.package, 'Goodman packaged unit'))
    else if (isAffordable(row.model)) imgs.push(photo(OUR_PHOTOS.package, 'Affordable Heating and Air packaged unit'))
  } else if (systemKey === 'heating') {
    if (isInfinity(row.model)) imgs.push(photo(VERIFIED_PHOTOS['carrier-infinity-furnace'], 'Carrier Infinity gas furnace'))
    else if (isGoodman(row.model) || isAffordable(row.model)) imgs.push(photo(OUR_PHOTOS.furnace, 'Affordable Heating and Air gas furnace'))
  } else {
    if (isInfinity(row.model)) imgs.push(photo(VERIFIED_PHOTOS['carrier-infinity-ac'], 'Carrier Infinity condenser'))
    else if (isGoodman(row.model) || isAffordable(row.model)) imgs.push(photo(OUR_PHOTOS.ac, 'Affordable Heating and Air condenser'))
    if (row.furnace) {
      if (isInfinity(row.furnace)) imgs.push(photo(VERIFIED_PHOTOS['carrier-infinity-furnace'], 'Carrier Infinity gas furnace'))
      else if (isGoodman(row.furnace) || isAffordable(row.furnace)) imgs.push(photo(OUR_PHOTOS.furnace, 'Affordable Heating and Air gas furnace'))
    }
  }
  return imgs
}

// Brand kicker for the card. Falls back to product-line names.
export function brandOf(row) {
  const text = `${row.model || ''} ${row.furnace || ''}`
  const direct = text.match(/\b(Goodman|Carrier|American Standard|Trane|Daikin|Lennox|Rheem|Bryant)\b/i)
  if (direct) return direct[1]
  if (/Infinity|Greenspeed/i.test(text)) return 'Carrier'
  if (/\bGold\b|\bSilver\b/i.test(text)) return 'American Standard'
  if (/^Affordable/i.test((row.model || '').trim())) return 'Affordable'
  return ''
}
