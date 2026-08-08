import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { money, money2, tierLabel } from '../lib/quote.js'
import { track, contactToUser } from '../lib/tracking.js'
import { usePageMeta } from '../lib/usePageMeta.js'
import { INCLUDED, FINANCE, COMPANY } from '../data/config.js'
import { SYSTEM_ICONS, IconCheck, IconArrowRight, IconShield } from '../components/icons.jsx'

const ICON_FOR = { ac: 'ac', heating: 'furnace', both: 'complete', package: 'package', heatpump: 'heat_pump' }

export default function Cart() {
  usePageMeta('Your Cart | Affordable Air Direct')
  const { items, removeItem, subtotal, clear } = useCart()
  const [placed, setPlaced] = useState(false)
  const [form, setForm] = useState({ name: '', phone: '', email: '', date: '' })

  if (placed) {
    return (
      <>
        <div className="mx-auto max-w-lg px-4 py-20 text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-teal/15 text-brand-teal">
            <IconCheck size={34} />
          </div>
          <h1 className="mt-6 text-2xl font-bold text-brand-navy">You're all set, {form.name.split(' ')[0] || 'friend'}!</h1>
          <p className="mt-3 text-slate-500">
            Your installation request is in. A real person from {COMPANY.name} — never a salesperson — will call
            {form.phone ? ` ${form.phone}` : ' you'} shortly to confirm your install date.
          </p>
          <Link to="/journey/system_type" className="btn-ghost mt-8" onClick={clear}>Start a new quote</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="text-2xl font-bold text-brand-navy sm:text-3xl">Your cart</h1>

        {items.length === 0 ? (
          <div className="card mt-6 p-10 text-center">
            <p className="text-slate-500">Your cart is empty.</p>
            <Link to="/journey/system_type" className="btn-primary mt-5">
              Build my system <IconArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
            {/* line items + schedule */}
            <div className="space-y-6">
              {items.map((it) => {
                const Icon = SYSTEM_ICONS[ICON_FOR[it.systemKey]] || SYSTEM_ICONS.complete
                return (
                  <div key={it.sku} className="card flex gap-4 p-5">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-mist text-brand-navy">
                      <Icon size={30} />
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-brand-navy">{tierLabel(it.tierName)} · {it.typeName}</h3>
                          <p className="text-sm text-slate-500">{it.tons ? `${it.tons}-ton` : ''}</p>
                          <p className="mt-1 text-xs leading-relaxed text-slate-400">
                            {it.model}{it.furnace ? ` · ${it.furnace}` : ''}
                          </p>
                        </div>
                        <button onClick={() => removeItem(it.sku)} className="text-sm text-slate-400 hover:text-red-500">
                          Remove
                        </button>
                      </div>
                      <p className="mt-3 text-lg font-bold text-brand-navy">{money(it.price)}
                        <span className="ml-2 text-sm font-normal text-slate-500">or {money2(it.monthly)}/mo · {FINANCE.label}</span>
                      </p>
                    </div>
                  </div>
                )
              })}

              {/* schedule form */}
              <div className="card p-6">
                <h2 className="font-bold text-brand-navy">Schedule your free install visit</h2>
                <p className="mt-1 text-sm text-slate-500">No deposit due now. We confirm sizing and price on-site before any work begins.</p>
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    track('Schedule', {
                      custom: {
                        value: subtotal, currency: 'USD', content_type: 'product',
                        content_ids: items.map((i) => i.sku),
                        content_name: items.map((i) => `${i.tierName} ${i.typeName}`).join(', '),
                      },
                      user: contactToUser(form),
                    })
                    setPlaced(true)
                  }}
                  className="mt-5 grid gap-4 sm:grid-cols-2"
                >
                  <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
                  <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
                  <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                  <Field label="Preferred date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
                  <div className="sm:col-span-2">
                    <button className="btn-primary w-full">Request my install <IconArrowRight size={18} /></button>
                  </div>
                </form>
              </div>
            </div>

            {/* summary */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="card p-6">
                <h2 className="font-bold text-brand-navy">Order summary</h2>
                <div className="mt-4 flex justify-between text-sm text-slate-600">
                  <span>Equipment + installation</span><span>{money(subtotal)}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-slate-600">
                  <span>Removal & haul-away</span><span className="text-brand-teal-dark">Included</span>
                </div>
                <div className="mt-2 flex justify-between text-sm text-slate-600">
                  <span>Permit & inspection</span><span className="text-brand-teal-dark">Included</span>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4 flex justify-between font-bold text-brand-navy">
                  <span>Total installed</span><span>{money(subtotal)}</span>
                </div>
                <p className="mt-1 text-right text-xs text-slate-400">Financing available · {FINANCE.label}</p>

                <div className="mt-5 rounded-xl bg-brand-mist p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-brand-navy">
                    <IconShield size={18} className="text-brand-teal" /> Included in every install
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-slate-500">
                    {INCLUDED.slice(0, 4).map((x) => <li key={x} className="flex gap-1.5"><IconCheck size={14} className="mt-0.5 text-brand-teal" />{x}</li>)}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-brand-navy">{label}{required && <span className="text-brand-cta"> *</span>}</span>
      <input
        type={type} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-brand-teal"
      />
    </label>
  )
}
