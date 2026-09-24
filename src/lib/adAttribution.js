// ---------------------------------------------------------------------------
// OpenAI Ads (ChatGPT Ads) click attribution for the store.
//
// `oppref` is OpenAI's click identifier. It arrives once, on the landing URL of
// an ad click, and it is the only thing that lets OpenAI tie a lead we report
// back to the ad that produced it. Everything else is a guess.
//
// Two things make it easy to lose, and this module exists for both:
//
//  1. It is on the LANDING url only. This is a single-page app, so by the time
//     someone reaches /journey/contact the query string is long gone. Capture
//     happens at boot and the value is kept in a first-party cookie, the same
//     shape as _fbc next door in tracking.js.
//  2. It cannot be read back server-side. There is no pixel on this domain and
//     no server rendering the page, so if the browser does not carry it to us
//     with the lead, nothing does.
//
// The lesson this encodes: on affordableairla.com the conversions were reported
// by a browser pixel and silently stopped for twelve days with every piece of
// the wiring still looking correct. The browser's job here is only to carry the
// click id; the conversion itself is reported by the server once the lead is in
// the database, where a failure is visible and retryable.
// ---------------------------------------------------------------------------

const PARAM = 'oppref'
const COOKIE = 'aad_oppref'
const DAYS = 30 // matches OpenAI's 720-hour click window

// Every ChatGPT ad lands with `offer=chatgpt`. It is a broader marker than the
// click id — oppref is occasionally absent, the offer tag never is — and it is
// what decides whether this visitor sees the tracking phone number.
const OFFER_PARAM = 'offer'
const OFFER_VALUE = 'chatgpt'
const OFFER_COOKIE = 'aad_chatgpt'

// Deliberately strict: this value is echoed to OpenAI and stored, so it only
// ever holds the URL-safe shape their click ids actually use.
const SHAPE = /^[\w.:~-]{1,500}$/

function readCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
  return m ? decodeURIComponent(m.pop()) : ''
}

function writeCookie(name, value, days) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  // Lax so it survives the click in from ChatGPT; host-only scope is fine
  // because every page that can produce a lead is on this domain.
  document.cookie =
    `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax` +
    (location.protocol === 'https:' ? '; Secure' : '')
}

/**
 * Capture `oppref` from the current URL if it's there. Call once at boot,
 * before the router has a chance to replace the location.
 */
export function captureOppref() {
  if (typeof window === 'undefined') return ''
  let params = null
  try {
    params = new URLSearchParams(window.location.search)
  } catch {
    /* ancient browser — fall through to whatever is already stored */
  }

  // Remember that this visitor came from a ChatGPT ad, independently of
  // whether the click id survived. A click id is itself proof of one.
  const fromUrl = (params && params.get(PARAM)) || ''
  const tagged = ((params && params.get(OFFER_PARAM)) || '').toLowerCase()
  if (tagged === OFFER_VALUE || (fromUrl && SHAPE.test(fromUrl))) {
    writeCookie(OFFER_COOKIE, '1', DAYS)
  }

  if (fromUrl && SHAPE.test(fromUrl)) {
    writeCookie(COOKIE, fromUrl, DAYS)
    return fromUrl
  }
  return getOppref()
}

/**
 * Whether this visitor arrived from a ChatGPT ad — the gate for showing the
 * tracking phone number instead of the main line. Remembered for 30 days so
 * the number still holds on the second visit, the way the call itself might.
 */
export function isFromChatGptAds() {
  if (typeof window === 'undefined') return false
  return readCookie(OFFER_COOKIE) === '1' || Boolean(getOppref())
}

/** The click id for this visitor, or '' for everyone who didn't come from an ad. */
export function getOppref() {
  if (typeof window === 'undefined') return ''
  const stored = readCookie(COOKIE)
  return SHAPE.test(stored) ? stored : ''
}

/**
 * The page this lead came from. OpenAI requires a source_url on web events that
 * carry a click id, and wants the real page rather than the site root.
 *
 * Query string stripped on purpose: it can carry the customer's own inputs, and
 * none of it is needed for attribution once oppref is sent as its own field.
 */
export function getSourceUrl() {
  if (typeof window === 'undefined') return ''
  return (window.location.origin + window.location.pathname).slice(0, 2000)
}

// ---------------------------------------------------------------------------
// Phone and email taps.
//
// This is the conversion that actually happens here. In the first two weeks of
// the Air Direct ads, ChatGPT traffic produced three phone calls and two booked
// jobs — and zero form submissions. Ads Manager showed the group at 0
// conversions the whole time, because a tap on a phone number never reaches a
// server on its own. OpenAI was bidding the group against a false zero.
//
// The sink is aha-scheduler's /api/ad-click, the same endpoint affordableairla.com
// has posted to since August: it already de-duplicates on (oppref, kind), already
// reports to OpenAI, and is already deployed. Re-implementing it here would mean
// a second copy of a thing that works.
//
// Cross-origin is fine. sendBeacon with a plain string body is a CORS-safelisted
// "simple" request, so it is never preflighted — which matters, because the
// browser is already handing off to the dialer and a preflight would lose the race.
// ---------------------------------------------------------------------------

const TAP_ENDPOINT = 'https://book.affordableairla.com/api/ad-click'

const tapsSent = Object.create(null)

function reportTap(kind) {
  // One tap per kind per page view is one lead; a customer who taps call twice
  // has not converted twice.
  if (tapsSent[kind]) return
  const oppref = getOppref()
  // Without a click id there is nothing to attribute, and the endpoint rejects
  // it anyway. An ordinary visitor tapping the number is not an ad conversion.
  if (!oppref) return
  tapsSent[kind] = true

  const body = JSON.stringify({ kind, oppref, pageUrl: getSourceUrl() })
  try {
    if (navigator.sendBeacon) {
      // Plain string, NOT a typed Blob — a typed Blob reintroduces the preflight
      // this whole approach exists to avoid (see quoteEmail.js for the incident).
      navigator.sendBeacon(TAP_ENDPOINT, body)
      return
    }
  } catch { /* fall through to fetch */ }
  try {
    fetch(TAP_ENDPOINT, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'text/plain' },
      keepalive: true,
      mode: 'no-cors',
      credentials: 'omit',
    })
  } catch { /* nothing more we can do, and the visitor must not notice */ }
}

function onInteract(e) {
  let el = e.target
  while (el && el !== document && el.tagName !== 'A') el = el.parentNode
  if (!el || el.tagName !== 'A') return
  const href = (el.getAttribute('href') || '').toLowerCase()
  if (href.startsWith('tel:')) reportTap('phone')
  else if (href.startsWith('mailto:')) reportTap('email')
}

/**
 * Start watching for taps. Delegated and capturing, and bound to pointerdown as
 * well as click: on mobile the browser hands off to the dialer fast enough that
 * a listener on the anchor itself can be torn down before it runs.
 */
export function watchAdTaps() {
  if (typeof document === 'undefined') return
  document.addEventListener('pointerdown', onInteract, true)
  document.addEventListener('click', onInteract, true)
}
