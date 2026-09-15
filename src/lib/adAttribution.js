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
