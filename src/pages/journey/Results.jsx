import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import JourneyLayout from '../../components/journey/JourneyLayout.jsx'
import { useQuote } from '../../context/QuoteContext.jsx'
import { useCart } from '../../context/CartContext.jsx'
import { buildQuote, money, money2, modelBullets, brandOf, tierLabel } from '../../lib/quote.js'
import { track, contactToUser } from '../../lib/tracking.js'
import { sendQuoteEmail } from '../../lib/quoteEmail.js'
import { visibleSteps } from '../../data/journey.js'
import { INCLUDED, FINANCE } from '../../data/config.js'
import { SYSTEM_ICONS, IconCheck, IconArrowLeft, IconStar } from '../../components/icons.jsx'

const ICON_FOR = { ac: 'ac', heating: 'furnace', both: 'complete', package: 'package', heatpump: 'heat_pump' }

export default function Results() {
  const navigate = useNavigate()
  const { answers, contact } = useQuote()
  const { addItem } = useCart()

  useEffect(() => {
    if (!answers.system_type) navigate('/journey/system_type', { replace: true })
  }, [answers.system_type, navigate])

  const { systemKey, tons, label, options } = useMemo(() => buildQuote(answers), [answers])
  const steps = visibleSteps(answers)
  if (!options.length) return null

  const Icon = SYSTEM_ICONS[ICON_FOR[systemKey]] || SYSTEM_ICONS.complete
  const featuredIdx = options.length >= 3 ? 1 : 0

  // ViewContent — customer saw real prices (value = the "most popular" option)
  useEffect(() => {
    if (!options.length) return
    track('ViewContent', {
      custom: {
        value: options[featuredIdx].price,
        currency: 'USD',
        content_type: 'product',
        content_ids: options.map((o) => o.sku),
        content_name: label,
      },
      user: contactToUser(contact),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemKey, tons])

  const choose = (opt) => {
    addItem({
      sku: opt.sku, systemKey, typeName: label, tierName: opt.tier,
      model: opt.model, furnace: opt.furnace, tons: opt.tons,
      price: opt.price, monthly: opt.monthly,
    })
    track('AddToCart', {
      custom: {
        value: opt.price, currency: 'USD', content_type: 'product',
        content_ids: [opt.sku], content_name: `${tierLabel(opt.tier)} ${label}`,
      },
      user: contactToUser(contact),
    })
    // Email the customer their quote + notify the team (fire-and-forget).
    sendQuoteEmail({ contact, systemKey, label, tons, options, selectedSku: opt.sku })
    navigate('/cart')
  }

  return (
    <JourneyLayout
      current="results"
      totalSteps={steps.length}
      title={contact.name ? `${contact.name.split(' ')[0]}, here are your options` : 'Here are your options'}
      subtitle="Real installed prices — equipment, labor, permit and haul-away included. No salesperson required."
    >
      {/* what we're quoting */}
      <div className="mx-auto mb-8 flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 font-semibold text-brand-navy shadow-sm">
          <Icon size={18} /> {label}
        </span>
        <span className="rounded-full bg-white px-3.5 py-1.5 font-semibold text-brand-navy shadow-sm">{tons}-ton</span>
      </div>

      <div className={`grid gap-5 ${options.length === 4 ? 'lg:grid-cols-4 md:grid-cols-2' : 'lg:grid-cols-3 sm:grid-cols-2'}`}>
        {options.map((opt, i) => {
          const featured = i === featuredIdx
          const brand = brandOf(opt)
          const bullets = modelBullets(opt)
          return (
            <div key={opt.sku}
              className={`card relative flex flex-col p-5 ${featured ? 'border-brand-teal ring-2 ring-brand-teal/30 lg:-mt-3 lg:mb-3' : ''}`}>
              {featured && (
                <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-teal px-3 py-1 text-xs font-bold text-white shadow">
                  <IconStar size={13} /> Most popular
                </span>
              )}
              {/* Category diagram, not a specific product photo — we can't verify
                  exact cabinet/discharge type per SKU, so we don't claim to. */}
              <div className="mb-3 flex h-32 items-center justify-center rounded-lg bg-brand-mist">
                <Icon size={56} className="text-brand-navy/70" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal-dark">{tierLabel(opt.tier)}</p>
              <h3 className="mt-0.5 text-lg font-bold text-brand-navy">{brand ? `${brand} ${label}` : label}</h3>

              <div className="mt-4">
                <p className="text-3xl font-extrabold text-brand-navy">{money(opt.price)}</p>
                <p className="text-sm text-slate-500">Fully installed — or {money2(opt.monthly)}/mo</p>
                <p className="text-xs text-slate-400">{FINANCE.label}</p>
              </div>

              <ul className="mt-4 flex-1 space-y-1.5 text-sm">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-slate-600">
                    <IconCheck size={16} className="mt-0.5 shrink-0 text-brand-teal" /> {b}
                  </li>
                ))}
              </ul>

              <p className="mt-4 border-t border-slate-100 pt-3 text-[11px] leading-relaxed text-slate-400">
                {opt.model}{opt.furnace ? ` · ${opt.furnace}` : ''}
              </p>

              <button onClick={() => choose(opt)} className={`mt-4 w-full ${featured ? 'btn-primary' : 'btn-ghost'}`}>
                Select
              </button>
            </div>
          )
        })}
      </div>

      <div className="mx-auto mt-10 max-w-3xl rounded-2xl bg-white p-6 shadow-sm">
        <h4 className="text-center font-bold text-brand-navy">Every install includes</h4>
        <ul className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {INCLUDED.map((x) => (
            <li key={x} className="flex items-start gap-2 text-slate-600">
              <IconCheck size={17} className="mt-0.5 shrink-0 text-brand-teal" /> {x}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 text-center">
        <button onClick={() => navigate('/journey/system_type')} className="btn-ghost">
          <IconArrowLeft size={18} /> Start over
        </button>
      </div>
    </JourneyLayout>
  )
}
