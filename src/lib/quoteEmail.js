// Fire-and-forget: send the selected quote to the server, which emails the
// customer a copy and notifies the team. Never blocks or breaks the UI.
import { QUOTE_ENDPOINT } from '../data/config.js'
import { tierLabel, brandOf, modelBullets, equipmentImages } from './quote.js'
import { isDemoMode } from './demoMode.js'
import { getCookie, getFbc } from './tracking.js'

export function sendQuoteEmail({ contact, systemKey, label, tons, options, selectedSku }) {
  if (!QUOTE_ENDPOINT) return
  // Demo mode: never actually email the customer or the team.
  if (isDemoMode()) return
  const selected = options.find((o) => o.sku === selectedSku)
  // Value = the "most popular" option when nothing's been selected yet
  // (fires right at contact submission, before Results renders).
  const featured = options[options.length >= 3 ? 1 : 0]
  const payload = {
    contact,
    systemKey,
    systemLabel: label,
    tons,
    selectedSku: selectedSku || undefined,
    quotedValue: selected?.price ?? featured?.price,
    // Original ad-click match keys, stored so a later ServiceTitan sale can
    // be tied back to this exact visit — see lib/metaRevenueSync.ts (server).
    fbp: getCookie('_fbp'),
    fbc: getFbc(),
    options: options.map((o) => ({
      sku: o.sku,
      tier: o.tier,
      tierLabel: tierLabel(o.tier),
      brand: brandOf(o),
      // Real photos only for verified product lines (e.g. Carrier Infinity);
      // [] otherwise — the email template skips the photo slot gracefully.
      images: equipmentImages(o, systemKey, { absolute: true }),
      price: o.price,
      monthly: o.monthly,
      model: o.model,
      furnace: o.furnace,
      spec: modelBullets(o).find((b) => b.kind === 'seer' || /AFUE/.test(b.text))?.text || '',
    })),
  }
  const json = JSON.stringify(payload)

  // Guaranteed delivery: fetch() is a CORS-preflighted request (Content-Type:
  // application/json), so if the origin isn't allowed server-side, the
  // browser aborts it BEFORE any data is sent — no error visible to the
  // customer, nothing in any server log, the lead just vanishes. That's
  // exactly what happened on 2026-08-15 when a new ad-landing subdomain
  // wasn't on the CORS whitelist for ~22 hours. navigator.sendBeacon() is not
  // subject to CORS preflight at all (it's designed for one-way delivery,
  // same mechanism analytics beacons use to reach third-party origins) and
  // survives page unload — used here ONLY as a fallback when fetch fails, so
  // the common case still sends exactly once. The server treats a same-phone
  // resubmission within a few minutes as a duplicate and no-ops it, so even
  // a fetch-then-beacon retry can't create two leads.
  const sendViaBeacon = () => {
    try {
      // Send as a plain string, NOT a Blob with type 'application/json' — a
      // typed Blob still triggers a CORS preflight (verified live: it
      // silently fails exactly like fetch does). A plain string defaults to
      // text/plain, a CORS-safelisted type that genuinely never preflights.
      // The server parses the body as JSON regardless of the declared
      // content-type, so this loses nothing.
      if (navigator.sendBeacon) navigator.sendBeacon(QUOTE_ENDPOINT, json)
    } catch { /* nothing further we can do from the client */ }
  }

  try {
    fetch(QUOTE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: json,
      keepalive: true,
      credentials: 'omit',
    }).catch(sendViaBeacon)
  } catch {
    sendViaBeacon()
  }
}
