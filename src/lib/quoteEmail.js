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
  const payload = {
    contact,
    systemKey,
    systemLabel: label,
    tons,
    selectedSku,
    quotedValue: selected?.price,
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
      spec: modelBullets(o).find((b) => /SEER2|AFUE/.test(b)) || '',
    })),
  }
  try {
    fetch(QUOTE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {})
  } catch { /* tracking/email must never break the flow */ }
}
