import { TESTIMONIALS, RATING, GOOGLE_REVIEWS_URL, INSTALL_PHOTOS } from '../../data/content.js'
import { usePageMeta } from '../../lib/usePageMeta.js'
import { IconStar, IconArrowRight } from '../../components/icons.jsx'
import CtaBand from '../../components/CtaBand.jsx'

export default function Reviews() {
  usePageMeta(
    'Reviews | Affordable Air Direct',
    `Rated ${RATING.stars}/5 from ${RATING.count} Google reviews. See what LA homeowners say about buying HVAC direct — honest pricing, clean installs, no salespeople.`,
  )
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl">What our customers say</h1>
        <a
          href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 text-slate-500 hover:text-brand-teal-dark"
        >
          <span className="inline-flex gap-0.5 text-brand-cta">
            {Array.from({ length: 5 }).map((_, j) => <IconStar key={j} size={16} />)}
          </span>
          Rated {RATING.stars}/5 from {RATING.count} Google reviews
          <IconArrowRight size={14} />
        </a>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <figure key={i} className="card p-6">
              <div className="flex gap-0.5 text-brand-cta">
                {Array.from({ length: 5 }).map((_, j) => <IconStar key={j} size={15} />)}
              </div>
              <blockquote className="mt-3 leading-relaxed text-slate-600">“{t.text}”</blockquote>
              <figcaption className="mt-3 flex items-center justify-between text-sm">
                <span className="font-semibold text-brand-navy">{t.name}</span>
                <span className="text-slate-400">{t.when}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* real jobs, real photos — from our Google Business Profile */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-brand-navy">Real installs, straight from our Google listing</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {INSTALL_PHOTOS.map((p) => (
              <img key={p.src} src={p.src} alt={p.alt} loading="lazy"
                className="aspect-[3/4] w-full rounded-xl border border-slate-200 object-cover" />
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="btn-ghost">
            Read all {RATING.count} reviews on Google <IconArrowRight size={16} />
          </a>
        </div>
      </div>
      <CtaBand />
    </>
  )
}
