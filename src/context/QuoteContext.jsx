import { createContext, useContext, useEffect, useState } from 'react'

const QuoteContext = createContext(null)
const KEY = 'aad_quote_v2'

const initial = { answers: {}, contact: { name: '', phone: '', email: '' } }

export function QuoteProvider({ children }) {
  const [quote, setQuote] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      return saved ? { ...initial, ...saved } : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(quote))
  }, [quote])

  const setAnswer = (id, value) =>
    setQuote((q) => ({ ...q, answers: { ...q.answers, [id]: value } }))
  const setContact = (patch) => setQuote((q) => ({ ...q, contact: { ...q.contact, ...patch } }))
  const reset = () => setQuote(initial)

  return (
    <QuoteContext.Provider value={{ ...quote, setAnswer, setContact, reset }}>
      {children}
    </QuoteContext.Provider>
  )
}

export const useQuote = () => useContext(QuoteContext)
