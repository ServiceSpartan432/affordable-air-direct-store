import { Link, useNavigate } from 'react-router-dom'
import { STEPS } from '../data/journey.js'
import { COMPANY } from '../data/config.js'
import { RATING, STEPS_HOW, WHY_US, SERVICES, BRANDS, TESTIMONIALS, FAQS } from '../data/content.js'
import { useQuote } from '../context/QuoteContext.jsx'
import { usePageMeta } from '../lib/usePageMeta.js'
import {
  SYSTEM_ICONS, IconArrowRight, IconShield, IconTruck, IconBolt, IconStar, IconCheck, IconPhone,
} from '../components/icons.jsx'

const SYSTEM_OPTIONS = STEPS[0].options

export default function StoreHome() {
  usePageMeta(
    'Affordable Air Direct | Instant HVAC Quotes — Save 30-40% Buying Direct',
    'Quality, efficiency & expert installation at unbeatable prices. Get a real installed HVAC price online in 2 minutes — no salespeople. Serving greater Los Angeles.',
  )
  const navigate = useNavigate()
  const { setAnswer } = useQuote()
  const pick = (v) => { setAnswer('system_type', v); navigate('/journey/residence_type') }
  const startService = (s) => {
    if (s.journey) { setAnswer('system_type', s.journey); navigate('/journey/residence_type') }
    else navigate('/contact')
  }

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              <IconBolt size={14} className="text-brand-teal" /> INSTANT SAME-DAY QUOTES · NO SALESPEOPLE
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              Quality HVAC at <span className="text-brand-teal">unbeatable prices.</span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-white/75">
              Save 30-40% by buying direct. Answer a few quick questions and see your real
              installed price in about 2 minutes — no pushy sales visit, ever.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/journey/system_type" className="btn-primary">
                Get my instant quote <IconArrowRight size={18} />
              </Link>
              <a href={COMPANY.phoneHref} className="btn-ghost border-white/30 bg-white/5 text-white hover:border-brand-teal hover:text-brand-teal">
                <IconPhone size={17} /> {COMPANY.phone}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5">
                <IconStar size={16} className="text-brand-cta" /> {RATING.stars}/5 from {RATING.count} reviews
              </span>
              <span className="inline-flex items-center gap-1.5"><IconShield size={16} className="text-brand-teal" /> Licensed #{COMPANY.license}</span>
              <span className="inline-flex items-center gap-1.5"><IconTruck size={16} className="text-brand-teal" /> 100% satisfaction guarantee</span>
            </div>
          </div>

          {/* quick picker — straight into the funnel */}
          <div className="card bg-white/95 p-6 text-brand-ink">
            <h2 className="text-lg font-bold text-brand-navy">What are you looking for?</h2>
            <p className="text-sm text-slate-500">Pick one to jump straight into your quote.</p>
            <div className="mt-4 space-y-3">
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
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-brand-navy">How we make HVAC affordable</h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-slate-500">Three steps. No salespeople. No surprises.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {STEPS_HOW.map((s) => (
            <div key={s.n} className="card relative p-6 pt-8">
              <span className="absolute -top-4 left-6 grid h-9 w-9 place-items-center rounded-full bg-brand-teal font-bold text-white">{s.n}</span>
              <h3 className="font-bold text-brand-navy">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link to="/journey/system_type" className="btn-primary">Start step 1 now <IconArrowRight size={18} /></Link>
        </div>
      </section>

      {/* ============ WHY US ============ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-center text-3xl font-bold text-brand-navy">Why homeowners choose us</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_US.map((w) => (
              <div key={w.title} className="rounded-2xl border border-slate-200 p-6">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-teal/10 text-brand-teal-dark">
                  <IconCheck size={22} />
                </span>
                <h3 className="mt-4 font-bold text-brand-navy">{w.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ SERVICES ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-bold text-brand-navy">Our services</h2>
          <Link to="/services" className="text-sm font-semibold text-brand-teal-dark hover:underline">All services</Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <button key={s.id} onClick={() => startService(s)}
              className="card group flex flex-col p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md">
              <h3 className="font-bold text-brand-navy">{s.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-500">{s.text}</p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal-dark">
                {s.journey ? 'Get instant price' : 'Request a quote'} <IconArrowRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ============ BRANDS ============ */}
      <section className="border-y border-slate-200 bg-white py-8">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">We install</span>
          {BRANDS.map((b) => (
            <span key={b} className="text-lg font-bold tracking-tight text-slate-400">{b}</span>
          ))}
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-brand-navy">What our customers say</h2>
        <p className="mt-2 text-center text-slate-500">
          Rated {RATING.stars}/5 from {RATING.count} reviews
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {TESTIMONIALS.slice(0, 3).map((t, i) => (
            <figure key={i} className="card p-6">
              <div className="flex gap-0.5 text-brand-cta">
                {Array.from({ length: 5 }).map((_, j) => <IconStar key={j} size={15} />)}
              </div>
              <blockquote className="mt-3 text-sm leading-relaxed text-slate-600">“{t.text}”</blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-brand-navy">{t.name}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/reviews" className="text-sm font-semibold text-brand-teal-dark hover:underline">Read all reviews</Link>
        </div>
      </section>

      {/* ============ FAQ (top 4) ============ */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-center text-3xl font-bold text-brand-navy">Common questions</h2>
          <div className="mt-8 space-y-3">
            {FAQS.slice(0, 4).map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-200 bg-brand-mist/50 p-5">
                <summary className="cursor-pointer list-none font-semibold text-brand-navy marker:content-none">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link to="/faq" className="text-sm font-semibold text-brand-teal-dark hover:underline">See all FAQs</Link>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="bg-brand-teal">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-12 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">Start saving on your new HVAC system today</h2>
            <p className="text-white/85">Your instant, no-obligation quote takes about two minutes.</p>
          </div>
          <Link to="/journey/system_type" className="btn-primary bg-white text-brand-teal-dark hover:bg-white/90">
            Instant same-day quote <IconArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
