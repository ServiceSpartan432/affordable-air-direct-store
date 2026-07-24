import { Link, useNavigate } from 'react-router-dom'
import { STEPS } from '../data/journey.js'
import { COMPANY } from '../data/config.js'
import { useQuote } from '../context/QuoteContext.jsx'
import {
  SYSTEM_ICONS, IconArrowRight, IconShield, IconTruck, IconBolt, IconLeaf, IconStar,
} from '../components/icons.jsx'

const SYSTEM_OPTIONS = STEPS[0].options

export default function StoreHome() {
  const navigate = useNavigate()
  const { setAnswer } = useQuote()
  const pick = (v) => { setAnswer('system_type', v); navigate('/journey/residence_type') }

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden bg-brand-navy text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-teal/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-brand-teal/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold tracking-wide">
              <IconBolt size={14} className="text-brand-teal" /> INSTANT HVAC QUOTE · NO SALESPEOPLE
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-5xl">
              A new HVAC system, <span className="text-brand-teal">priced &amp; installed</span> — the honest way.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-white/75">
              Answer a few quick questions and get a real installed price in about 2 minutes. No pushy sales visit,
              no games — just direct, affordable, quality HVAC.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/journey/system_type" className="btn-primary">
                Get my instant price <IconArrowRight size={18} />
              </Link>
              <a href={COMPANY.phoneHref} className="btn-ghost border-white/30 bg-white/5 text-white hover:border-brand-teal hover:text-brand-teal">
                Call {COMPANY.phone}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              <span className="inline-flex items-center gap-1.5"><IconStar size={16} className="text-brand-cta" /> 4.9 rating</span>
              <span className="inline-flex items-center gap-1.5"><IconShield size={16} className="text-brand-teal" /> Licensed #{COMPANY.license}</span>
              <span className="inline-flex items-center gap-1.5"><IconTruck size={16} className="text-brand-teal" /> Free installation quote</span>
            </div>
          </div>

          {/* quick picker */}
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

      {/* value props */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: IconBolt, t: 'Instant pricing', d: 'Real installed prices on screen — no waiting for a quote.' },
            { icon: IconShield, t: 'No salespeople', d: 'Nobody working a commission. Just the right system at the right price.' },
            { icon: IconLeaf, t: 'Energy savings', d: 'High-efficiency options that cut your monthly bills.' },
            { icon: IconTruck, t: 'Fast install', d: 'Most systems installed in a single day by our own crews.' },
          ].map((v) => (
            <div key={v.t} className="card p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-teal/10 text-brand-teal-dark">
                <v.icon size={22} />
              </span>
              <h3 className="mt-4 font-bold text-brand-navy">{v.t}</h3>
              <p className="mt-1 text-sm text-slate-500">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA band */}
      <section className="bg-brand-teal">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-10 text-center sm:flex-row sm:text-left">
          <div>
            <h2 className="text-2xl font-bold text-white">Ready to see your price?</h2>
            <p className="text-white/85">It takes about two minutes — and there's never a salesperson.</p>
          </div>
          <Link to="/journey/system_type" className="btn-primary bg-white text-brand-teal-dark hover:bg-white/90">
            Start my instant quote <IconArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
