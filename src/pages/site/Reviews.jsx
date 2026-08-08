import { TESTIMONIALS, RATING } from '../../data/content.js'
import { usePageMeta } from '../../lib/usePageMeta.js'
import { IconStar } from '../../components/icons.jsx'
import CtaBand from '../../components/CtaBand.jsx'

export default function Reviews() {
  usePageMeta(
    'Reviews | Affordable Air Direct',
    `Rated ${RATING.stars}/5 from ${RATING.count} reviews. See what LA homeowners say about buying HVAC direct — honest pricing, clean installs, no salespeople.`,
  )
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl">What our customers say</h1>
        <p className="mt-2 inline-flex items-center gap-2 text-slate-500">
          <span className="inline-flex gap-0.5 text-brand-cta">
            {Array.from({ length: 5 }).map((_, j) => <IconStar key={j} size={16} />)}
          </span>
          Rated {RATING.stars}/5 from {RATING.count} reviews
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="card p-6">
              <div className="flex gap-0.5 text-brand-cta">
                {Array.from({ length: 5 }).map((_, j) => <IconStar key={j} size={15} />)}
              </div>
              <blockquote className="mt-3 leading-relaxed text-slate-600">“{t.text}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-brand-navy">{t.name}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <CtaBand />
    </>
  )
}
