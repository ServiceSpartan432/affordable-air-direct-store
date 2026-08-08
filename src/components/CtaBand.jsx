import { Link } from 'react-router-dom'
import { IconArrowRight } from './icons.jsx'

// Reusable bottom-of-page conversion band.
export default function CtaBand() {
  return (
    <section className="bg-brand-teal">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-12 text-center sm:flex-row sm:text-left">
        <div>
          <h2 className="text-2xl font-bold text-white">Ready to see your price?</h2>
          <p className="text-white/85">Instant, no-obligation quote — about two minutes, never a salesperson.</p>
        </div>
        <Link to="/journey/system_type" className="btn-primary bg-white text-brand-teal-dark hover:bg-white/90">
          Get my instant quote <IconArrowRight size={18} />
        </Link>
      </div>
    </section>
  )
}
