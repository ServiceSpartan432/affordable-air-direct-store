import { useEffect } from 'react'

// Per-page <title> + meta description (+ optional noindex) for SEO. Call at
// the top of each page. noindex is cleaned up on unmount so it never leaks
// onto a different page later in the same SPA session.
export function usePageMeta(title, description, { noindex = false } = {}) {
  useEffect(() => {
    if (title) document.title = title
    if (description) {
      let tag = document.querySelector('meta[name="description"]')
      if (!tag) {
        tag = document.createElement('meta')
        tag.setAttribute('name', 'description')
        document.head.appendChild(tag)
      }
      tag.setAttribute('content', description)
    }
  }, [title, description])

  useEffect(() => {
    if (!noindex) return
    const tag = document.createElement('meta')
    tag.setAttribute('name', 'robots')
    tag.setAttribute('content', 'noindex, follow')
    document.head.appendChild(tag)
    return () => { tag.remove() }
  }, [noindex])
}
