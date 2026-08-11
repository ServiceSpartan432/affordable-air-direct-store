import { useEffect } from 'react'

// Injects/updates a <script type="application/ld+json"> tag scoped by `key`
// so different pages can each own their own schema block without clobbering
// each other, and it's removed when the page unmounts (never left stale on
// a route that no longer matches the visible content — Google's structured
// data policy requires schema to match what's actually on the page).
export function useStructuredData(key, data) {
  useEffect(() => {
    if (!data) return
    const id = `ld-json-${key}`
    let tag = document.getElementById(id)
    if (!tag) {
      tag = document.createElement('script')
      tag.type = 'application/ld+json'
      tag.id = id
      document.head.appendChild(tag)
    }
    tag.textContent = JSON.stringify(data)
    return () => { tag?.remove() }
  }, [key, data])
}
