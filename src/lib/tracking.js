// ---------------------------------------------------------------------------
// Meta tracking: browser Pixel + server Conversions API, deduplicated.
//
// Every event is sent TWICE with the SAME event_id — once via the Pixel (fbq)
// and once via the server relay (CAPI) — so Meta deduplicates and you get the
// highest-quality signal. Raw PII (email/phone/name) is sent only to your own
// relay over HTTPS; the relay hashes it before it ever reaches Meta. The CAPI
// access token never touches the browser.
// ---------------------------------------------------------------------------
import { META } from '../data/config.js'

let pixelReady = false

// ---- Meta Pixel base code (injected once, only if a pixel id is set) -------
export function initPixel() {
  if (pixelReady || !META.pixelId || typeof window === 'undefined') return
  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }
    if (!f._fbq) f._fbq = n
    n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []
    t = b.createElement(e); t.async = !0; t.src = v
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */
  window.fbq('init', META.pixelId)
  pixelReady = true
}

// ---- helpers --------------------------------------------------------------
const uuid = () =>
  (crypto.randomUUID && crypto.randomUUID()) ||
  'xxxxxxxxyxxx4xxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })

const getCookie = (name) => {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return m ? m.pop() : ''
}

// _fbc is derived from the fbclid URL param on first landing if the cookie
// isn't set yet — captures paid-click attribution even before fbevents writes it.
function getFbc() {
  const existing = getCookie('_fbc')
  if (existing) return existing
  const fbclid = new URLSearchParams(window.location.search).get('fbclid')
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : ''
}

// ---- core -----------------------------------------------------------------
// eventName: standard Meta event ("PageView", "ViewContent", "Lead", "Schedule")
// opts.custom: { value, currency, content_ids, content_type, contents, ... }
// opts.user:   { email, phone, firstName, lastName }  (raw — relay hashes it)
export function track(eventName, opts = {}) {
  if (typeof window === 'undefined') return
  const eventId = uuid()
  const custom = opts.custom || {}

  // 1) Browser Pixel (dedup key = eventID)
  if (META.pixelId && window.fbq) {
    window.fbq('track', eventName, custom, { eventID: eventId })
  }

  // 2) Server relay -> Conversions API (raw PII + cookies; relay hashes + adds IP/UA)
  if (META.capiUrl) {
    const body = {
      event_name: eventName,
      event_id: eventId,
      event_source_url: window.location.href,
      action_source: 'website',
      event_time: Math.floor(Date.now() / 1000),
      user_data: {
        ...(opts.user || {}),
        fbp: getCookie('_fbp'),
        fbc: getFbc(),
        client_user_agent: navigator.userAgent,
      },
      custom_data: custom,
    }
    // keepalive so the request survives a page navigation (e.g. form submit)
    try {
      fetch(META.capiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
        credentials: 'omit',
      }).catch(() => {})
    } catch { /* never block the UI on tracking */ }
  }

  return eventId
}

export const trackPageView = () => track('PageView')

// Split the store's contact record into Meta match keys (raw; relay hashes).
export function contactToUser(contact = {}) {
  const name = (contact.name || '').trim()
  const [firstName, ...rest] = name.split(/\s+/)
  return {
    email: contact.email || '',
    phone: contact.phone || '',
    firstName: firstName || '',
    lastName: rest.join(' ') || '',
  }
}
