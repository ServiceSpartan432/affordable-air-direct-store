// ---------------------------------------------------------------------------
// Which phone number to show.
//
// Visitors who arrived from a ChatGPT ad see a dedicated tracking line instead
// of the main number, so the call lands on its own ServiceTitan campaign. This
// matters more than it sounds: a tap-to-call from an ad is the single most
// common way this channel converts, and on affordableairla.com those calls were
// being credited to Google Organic — a ChatGPT tap rang in 93 seconds later,
// booked a job, and filed under someone else's campaign. The revenue was real
// and the channel showed $0 beside it.
//
// Everyone else sees COMPANY.phone, unchanged.
//
// Deliberately NOT applied on the privacy policy: that page states how to reach
// the company as a matter of record, and a marketing tracking line has no
// business standing in for the real one there.
// ---------------------------------------------------------------------------
import { COMPANY, CHATGPT_ADS } from '../data/config.js'
import { isFromChatGptAds } from './adAttribution.js'

/** The number to print, in the same format COMPANY.phone uses. */
export function displayPhone() {
  return CHATGPT_ADS.phone && isFromChatGptAds() ? CHATGPT_ADS.phone : COMPANY.phone
}

/** The matching tel: target. */
export function phoneHref() {
  return CHATGPT_ADS.phoneHref && isFromChatGptAds() ? CHATGPT_ADS.phoneHref : COMPANY.phoneHref
}
