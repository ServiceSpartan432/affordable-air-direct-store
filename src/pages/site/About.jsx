import { ABOUT, WHY_US, BRANDS } from '../../data/content.js'
import { COMPANY } from '../../data/config.js'
import { usePageMeta } from '../../lib/usePageMeta.js'
import { IconCheck } from '../../components/icons.jsx'
import CtaBand from '../../components/CtaBand.jsx'

export default function About() {
  usePageMeta(
    'About Us | Affordable Air Direct',
    'Woman-owned division of Affordable Heating and Air (license #1081403). Direct wholesale HVAC pricing, expert consultation, and professional installation in greater LA.',
  )
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl">{ABOUT.headline}</h1>
        <div className="mt-6 space-y-4 text-slate-600 leading-relaxed">
          {ABOUT.body.map((p, i) => <p key={i}>{p}</p>)}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {WHY_US.map((w) => (
            <div key={w.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
              <IconCheck size={18} className="mt-0.5 shrink-0 text-brand-teal" />
              <div>
                <p className="font-semibold text-brand-navy">{w.title}</p>
                <p className="text-sm text-slate-500">{w.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-brand-mist p-6 text-sm text-slate-600">
          <p><span className="font-semibold text-brand-navy">Brands we install:</span> {BRANDS.join(' · ')}</p>
          <p className="mt-2"><span className="font-semibold text-brand-navy">Headquarters:</span> {COMPANY.address}</p>
          <p className="mt-2"><span className="font-semibold text-brand-navy">License:</span> #{COMPANY.license} · A division of {COMPANY.parent}</p>
        </div>
      </div>
      <CtaBand />
    </>
  )
}
