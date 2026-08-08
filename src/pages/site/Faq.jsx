import { FAQS } from '../../data/content.js'
import { usePageMeta } from '../../lib/usePageMeta.js'
import CtaBand from '../../components/CtaBand.jsx'

export default function Faq() {
  usePageMeta(
    'FAQ | Affordable Air Direct',
    'How much can you save buying HVAC direct? What is included in the installed price? Financing, service area, and how the instant quote works.',
  )
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl">Frequently asked questions</h1>
        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-xl border border-slate-200 bg-white p-5">
              <summary className="cursor-pointer list-none font-semibold text-brand-navy marker:content-none">
                {f.q}
              </summary>
              <p className="mt-3 leading-relaxed text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
      <CtaBand />
    </>
  )
}
