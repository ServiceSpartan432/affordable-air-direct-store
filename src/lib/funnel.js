// ---------------------------------------------------------------------------
// First-party funnel telemetry.
//
// Meta's Pixel already reports conversions, but it can only answer "how many
// leads" — not "of the people who started, where did they stop". That gap is
// real: on 2026-08-17 the store took 106 ad clicks and produced zero leads,
// and nothing on our side could distinguish "nobody entered the funnel" from
// "everybody bailed at the contact gate", because the contact-gate submit was
// the FIRST server-side signal we recorded.
//
// So: one beacon per step, keyed by a session id, with the entry context
// (landing page, paid vs organic, device) captured once. That makes the
// classic step -> step -> drop-off report possible.
//
// Deliberately NOT analytics-in-general: no PII, no cross-site identifiers, no
// third party. Same-origin-family POST to our own API, and it never blocks or
// breaks the UI — every failure path here is a silent no-op, because a
// telemetry bug must never cost a lead.
// ---------------------------------------------------------------------------
import { FUNNEL_ENDPOINT } from '../data/config.js'
import { isDemoMode } from './demoMode.js'

const SKEY = 'aad_fs' // session (one funnel attempt, per tab)
const VKEY = 'aad_vid' // visitor (persists, so repeat visits are visible)

const uuid = () =>
  (crypto.randomUUID && crypto.randomUUID()) ||
  'xxxxxxxxyxxx4xxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })

// sessionStorage/localStorage throw in some privacy modes — never let that
// bubble into a render.
const readStore = (store, key) => {
  try { return window[store].getItem(key) } catch { return null }
}
const writeStore = (store, key, val) => {
  try { window[store].setItem(key, val) } catch { /* ignore */ }
}

function sessionId() {
  let id = readStore('sessionStorage', SKEY)
  if (!id) {
    id = uuid()
    writeStore('sessionStorage', SKEY, id)
  }
  return id
}

function visitorId() {
  let id = readStore('localStorage', VKEY)
  if (!id) {
    id = uuid()
    writeStore('localStorage', VKEY, id)
  }
  return id
}

/**
 * The entry context, captured from the FIRST page of the session and then
 * frozen. Read on every event from sessionStorage rather than recomputed,
 * because by step 4 the URL no longer carries the fbclid/utm that says where
 * this person came from — which is exactly what we need to segment by.
 */
function entry() {
  const cached = readStore('sessionStorage', SKEY + '_entry')
  if (cached) {
    try { return JSON.parse(cached) } catch { /* fall through and rebuild */ }
  }
  const qs = new URLSearchParams(window.location.search)
  const paid = Boolean(qs.get('fbclid') || qs.get('gclid') || qs.get('utm_source'))
  const e = {
    landing: window.location.pathname || '/',
    host: window.location.host || '',
    paid,
    source: qs.get('utm_source') || (qs.get('fbclid') ? 'facebook' : qs.get('gclid') ? 'google' : ''),
    campaign: qs.get('utm_campaign') || '',
    content: qs.get('utm_content') || '',
    referrer: (document.referrer || '').slice(0, 300),
    // Coarse on purpose — enough to spot "the funnel breaks on mobile", not
    // enough to fingerprint anyone.
    device: window.matchMedia && window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
  }
  writeStore('sessionStorage', SKEY + '_entry', JSON.stringify(e))
  return e
}

/**
 * Record one funnel step.
 *
 * @param step  canonical step name — a route view is "view:/journey/size",
 *              a milestone is a bare verb like "contact_submit".
 * @param props small, non-identifying extras (system type, tier, error code)
 */
export function trackFunnel(step, props = {}) {
  if (typeof window === 'undefined' || !FUNNEL_ENDPOINT) return
  // Demo mode is for clicking through the funnel in front of people — that
  // must not show up as real traffic in the drop-off report.
  if (isDemoMode()) return

  const body = JSON.stringify({
    sessionId: sessionId(),
    visitorId: visitorId(),
    step,
    path: window.location.pathname || '/',
    props,
    entry: entry(),
    at: new Date().toISOString(),
  })

  // sendBeacon is the right tool: it survives the page being unloaded, which
  // is precisely when a drop-off happens. fetch(keepalive) is the fallback for
  // browsers where sendBeacon is unavailable or refuses the payload.
  try {
    if (navigator.sendBeacon) {
      // Blob with an explicit type keeps it a "simple request" — no CORS
      // preflight, so a beacon fired during unload isn't dropped waiting on
      // an OPTIONS round-trip it will never get to complete.
      const blob = new Blob([body], { type: 'text/plain;charset=UTF-8' })
      if (navigator.sendBeacon(FUNNEL_ENDPOINT, blob)) return
    }
    fetch(FUNNEL_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body,
      keepalive: true,
      credentials: 'omit',
    }).catch(() => {})
  } catch { /* telemetry must never break the funnel */ }
}

/** A route view. Called centrally on every navigation. */
export const trackFunnelView = () => trackFunnel(`view:${window.location.pathname || '/'}`)
