import { useSearchParams, useNavigate } from 'react-router-dom'
import { STEPS } from '../data/journey.js'
import { COMPANY } from '../data/config.js'
import { RATING } from '../data/content.js'
import { landingCopyFor } from '../data/landingCopy.js'
import { useQuote } from '../context/QuoteContext.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'
import { SYSTEM_ICONS, IconArrowRight, IconShield, IconStar, IconPhone, IconCheck } from '../components/icons.jsx'

const SYSTEM_OPTIONS = STEPS[0].options

// Dedicated ad-traffic landing page — deliberately NOT wrapped in the site's
// normal Header/Footer. Every distraction on a paid click is money leaking:
// one page, one promise, one CTA above the fold, no nav to wander off into.
// ?promo=<key> swaps the headline to match a specific ad's exact wording.
export default function Landing() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const { setAnswer } = useQuote()
  const copy = landingCopyFor(params.get('promo'))

  // Ad landing page — deliberately excluded from organic search (thin,
  // ad-copy-matched content that would otherwise compete with / dilute the
  // homepage). Fully crawlable and functional for paid traffic + Meta's own
  // page-quality signals; just not something we want ranking organically.
  usePageMeta(`${copy.headline} | ${COMPANY.name}`, copy.sub, { noindex: true })

  const pick = (v) => { setAnswer('system_type', v); navigate('/journey/residence_type') }

  return (
    <div className="min-h-screen bg-brand-navy text-white">
      {/* minimal top bar — logo + phone only, no nav to leak clicks */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <img src={COMPANY.logo} alt={COMPANY.name} className="h-9 w-auto rounded bg-white/95 px-1.5 py-1" />
          <a href={COMPANY.phoneHref} className="inline-flex items-center gap-1.5 text-sm font-bold text-white hover:text-brand-teal">
            <IconPhone size={16} /> {COMPANY.phone}
          </a>
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 py-10 sm:py-14">
          {/* single promise, above the fold */}
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              {copy.eyebrow}
            </span>
            <h1 className="mx-auto mt-5 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
              {copy.headline}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-white/75">{copy.sub}</p>
          </div>

          {/* the CTA — pick a system, straight into the funnel, no extra click */}
          <div className="card mx-auto mt-8 max-w-xl bg-white p-5 text-brand-ink sm:p-6">
            <p className="text-center text-sm font-semibold text-brand-navy">What are you looking for?</p>
            <div className="mt-4 space-y-2.5">
              {SYSTEM_OPTIONS.map((s) => {
                const Icon = SYSTEM_ICONS[s.icon]
                return (
                  <button key={s.value} onClick={() => pick(s.value)}
                    className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 p-3.5 text-left transition hover:border-brand-teal hover:bg-brand-mist">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-brand-mist text-brand-navy group-hover:bg-brand-teal group-hover:text-white">
                      <Icon size={24} />
                    </span>
                    <span>
                      <span className="block font-semibold text-brand-navy">{s.label}</span>
                      <span className="block text-sm text-slate-500">{s.hint}</span>
                    </span>
                    <IconArrowRight size={18} className="ml-auto text-slate-300 group-hover:text-brand-teal" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* condensed trust — no scrolling required to see it */}
          <div className="mx-auto mt-6 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5"><IconStar size={15} className="text-brand-cta" /> {RATING.stars}/5 from {RATING.count} reviews</span>
            <span className="inline-flex items-center gap-1.5"><IconShield size={15} className="text-brand-teal" /> Licensed #{COMPANY.license}</span>
            <span className="inline-flex items-center gap-1.5"><IconCheck size={15} className="text-brand-teal" /> 100% satisfaction guarantee</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        {COMPANY.name} · License #{COMPANY.license} · A division of {COMPANY.parent}
      </footer>
    </div>
  )
}
