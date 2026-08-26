import { createContext, useContext, useEffect, useState } from 'react'
import { track } from '../lib/tracking.js'

const QuoteContext = createContext(null)
const KEY = 'aad_quote_v2'

// Both consent boxes default checked (easy uncheck), matching the disclaimer
// pattern the prior Contractor Commerce funnel actually used — it never had
// an active opt-in checkbox at all, just passive disclaimer text.
const initial = { answers: {}, contact: { name: '', phone: '', email: '', zip: '', smsConsent: true, policyAccepted: true } }

export function QuoteProvider({ children }) {
  const [quote, setQuote] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      return saved ? { ...initial, ...saved, contact: { ...initial.contact, ...saved.contact } } : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(quote))
  }, [quote])

  const setAnswer = (id, value) => {
    // InitiateCheckout — the earliest funnel signal, fires from every entry
    // point (home quick-picker, services page, direct nav) since they all
    // funnel through this one setter. Meta learns from people who bounce
    // before finishing, not just completed leads.
    if (id === 'system_type') {
      track('InitiateCheckout', { custom: { content_name: value, content_category: 'hvac_quote' } })
    }
    setQuote((q) => ({ ...q, answers: { ...q.answers, [id]: value } }))
  }
  const setContact = (patch) => setQuote((q) => ({ ...q, contact: { ...q.contact, ...patch } }))
  const reset = () => setQuote(initial)

  return (
    <QuoteContext.Provider value={{ ...quote, setAnswer, setContact, reset }}>
      {children}
    </QuoteContext.Provider>
  )
}

export const useQuote = () => useContext(QuoteContext)
