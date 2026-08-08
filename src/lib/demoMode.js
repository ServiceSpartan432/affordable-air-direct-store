// Demo mode: suppress real side effects (quote emails, Meta Pixel/CAPI events)
// while someone is just clicking through to review the funnel. Triggered once
// via ?demo=1 in the URL, then persisted for the rest of the browser session
// so it survives navigating through the whole journey.
const KEY = 'aad_demo_mode'

export function isDemoMode() {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).get('demo') === '1') {
    sessionStorage.setItem(KEY, '1')
  }
  return sessionStorage.getItem(KEY) === '1'
}
