import { useNavigate } from 'react-router-dom'
import { SERVICES } from '../../data/content.js'
import { useQuote } from '../../context/QuoteContext.jsx'
import { usePageMeta } from '../../lib/usePageMeta.js'
import { IconArrowRight } from '../../components/icons.jsx'
import CtaBand from '../../components/CtaBand.jsx'

export default function Services() {
  usePageMeta(
    'HVAC Services | Affordable Air Direct',
    'AC installation, furnaces, heat pumps, complete systems, mini-splits and wall heaters — installed by our own certified crews at direct wholesale pricing.',
  )
  const navigate = useNavigate()
  const { setAnswer } = useQuote()
  const start = (s) => {
    if (s.journey) { setAnswer('system_type', s.journey); navigate('/journey/residence_type') }
    else navigate('/contact')
  }

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl">Our services</h1>
        <p className="mt-3 max-w-2xl text-slate-500">
          Every install is done by our own certified technicians — permit, haul-away, thermostat,
          and warranty included. Most systems have instant online pricing.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <button key={s.id} onClick={() => start(s)}
              className="card group flex flex-col p-6 text-left transition hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md">
              <h2 className="text-lg font-bold text-brand-navy">{s.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{s.text}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal-dark">
                {s.journey ? 'Get my instant price' : 'Request a quote'} <IconArrowRight size={15} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <CtaBand />
    </>
  )
}
