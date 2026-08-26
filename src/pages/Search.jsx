import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { STEPS } from '../data/journey.js'
import { CATALOG } from '../data/catalog.js'
import { useQuote } from '../context/QuoteContext.jsx'
import { SYSTEM_ICONS, IconArrowRight, IconSearch } from '../components/icons.jsx'

// searchable entry points -> which system_type answer they set
const ENTRIES = [
  { key: 'both',     label: CATALOG.both.label,     terms: 'complete system ac furnace heating cooling split', icon: 'complete' },
  { key: 'cooling',  label: CATALOG.ac.label,       terms: 'air conditioner ac cooling condenser coil',        icon: 'ac' },
  { key: 'heating',  label: CATALOG.heating.label,  terms: 'furnace heater heating gas',                       icon: 'furnace' },
  { key: 'heatpump', label: CATALOG.heatpump.label, terms: 'heat pump electric heating cooling all-electric',  icon: 'heat_pump' },
]

export default function Search() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').toLowerCase().trim()
  const navigate = useNavigate()
  const { setAnswer } = useQuote()
  const pick = (v) => { setAnswer('system_type', v); navigate('/journey/residence_type') }

  const results = q
    ? ENTRIES.filter((e) => `${e.label} ${e.terms}`.toLowerCase().includes(q))
    : ENTRIES

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-sm text-slate-500">
        Search results{q && <> for “<span className="font-medium text-brand-navy">{q}</span>”</>}
      </p>
      <h1 className="mt-1 text-2xl font-bold text-brand-navy">
        {results.length} system{results.length !== 1 && 's'} found
      </h1>

      {results.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <IconSearch size={28} className="mx-auto text-slate-300" />
          <p className="mt-3 text-slate-500">No match. Try “AC”, “furnace”, or “complete system”.</p>
          <Link to="/journey/zip" className="btn-primary mt-5">
            Start my quote <IconArrowRight size={18} />
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((e) => {
            const Icon = SYSTEM_ICONS[e.icon]
            return (
              <button key={e.key} onClick={() => pick(e.key)}
                className="card group flex flex-col p-5 text-left transition hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-mist text-brand-navy group-hover:bg-brand-teal group-hover:text-white">
                  <Icon size={26} />
                </span>
                <h3 className="mt-4 font-bold text-brand-navy">{e.label}</h3>
                <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-teal-dark">
                  Get my price <IconArrowRight size={15} />
                </span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
