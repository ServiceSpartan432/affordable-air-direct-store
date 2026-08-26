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
      {/* No header bar at all — even a non-clickable logo+border reads as
          "site chrome" and invites people to look for an exit. The original,
          proven-converting Contractor Commerce funnel had no branded header
          either, just the offer itself. Click-to-call is still here (a real
          conversion path, not a distraction) but framed as part of the offer,
          not as navigation. */}
      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 py-10 sm:py-14">
          {/* single promise, above the fold */}
          <div className="flex flex-col items-center text-center">
            <a href={COMPANY.phoneHref} className="inline-flex items-center gap-1.5 text-xs font-semibold text-white/70 hover:text-brand-teal">
              <IconPhone size={13} /> Prefer to talk? Call {COMPANY.phone}
            </a>
            <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              {copy.eyebrow}
            </span>
            <h1 className="mx-auto mt-5 max-w-xl text-3xl font-extrabold leading-tight sm:text-4xl">
              {copy.headline}
            </h1>
            <p className="mx-auto mt-3 max-w-md text-white/75">{copy.sub}</p>
          </div>

          {/* trust, moved ABOVE the picker — most real visitors are on a phone
              inside the Facebook/Instagram in-app browser, which leaves
              noticeably less visible height than a normal mobile tab. This
              used to run below all 4 options, meaning most people never
              scrolled far enough to see it before deciding whether to engage. */}
          <div className="mx-auto mt-5 flex max-w-xl flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-1.5"><IconStar size={15} className="text-brand-cta" /> {RATING.stars}/5 from {RATING.count} reviews</span>
            <span className="inline-flex items-center gap-1.5"><IconShield size={15} className="text-brand-teal" /> Licensed #{COMPANY.license}</span>
            <span className="inline-flex items-center gap-1.5"><IconCheck size={15} className="text-brand-teal" /> 100% satisfaction guarantee</span>
          </div>

          {/* the CTA — pick a system, straight into the funnel, no extra click.
              2-col grid on mobile (compact — fits above the fold even inside
              an in-app browser's shrunken viewport); reverts to the roomier
              full-width row layout from sm: up, where height isn't the
              constraint. */}
          <div className="card mx-auto mt-6 max-w-xl bg-white p-5 text-brand-ink sm:p-6">
            <p className="text-center text-sm font-semibold text-brand-navy">What are you looking for?</p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-1">
              {SYSTEM_OPTIONS.map((s) => {
                const Icon = SYSTEM_ICONS[s.icon]
                return (
                  <button key={s.value} onClick={() => pick(s.value)}
                    className="group flex flex-col items-center gap-1.5 rounded-xl border border-slate-200 p-3 text-center transition hover:border-brand-teal hover:bg-brand-mist sm:w-full sm:flex-row sm:gap-3 sm:p-3.5 sm:text-left">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-mist text-brand-navy group-hover:bg-brand-teal group-hover:text-white sm:h-11 sm:w-11">
                      <Icon size={22} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold leading-tight text-brand-navy sm:text-base">{s.label}</span>
                      <span className="block text-xs leading-tight text-slate-500 sm:text-sm">{s.hint}</span>
                    </span>
                    <IconArrowRight size={18} className="hidden text-slate-300 group-hover:text-brand-teal sm:ml-auto sm:block" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50">
        {COMPANY.name} · License #{COMPANY.license} · A division of {COMPANY.parent}
      </footer>
    </div>
  )
}
