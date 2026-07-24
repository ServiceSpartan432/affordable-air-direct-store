import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { COMPANY } from '../data/config.js'
import { useCart } from '../context/CartContext.jsx'
import { IconCart, IconUser, IconSearch, IconPhone } from './icons.jsx'

export default function Header() {
  const { count } = useCart()
  const navigate = useNavigate()
  const [q, setQ] = useState('')

  const onSearch = (e) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <header className="sticky top-0 z-40">
      {/* trust bar */}
      <div className="bg-brand-navy text-white/90 text-xs sm:text-[13px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5">
          <span className="hidden sm:inline">{COMPANY.tagline}</span>
          <div className="flex items-center gap-4">
            <a href={COMPANY.phoneHref} className="inline-flex items-center gap-1.5 font-medium hover:text-brand-teal">
              <IconPhone size={14} /> {COMPANY.phone}
            </a>
            <span className="hidden md:inline text-white/50">License #{COMPANY.license}</span>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="shrink-0">
            <img src={COMPANY.logo} alt={`${COMPANY.name} logo`} className="h-11 w-auto" />
          </Link>

          <form onSubmit={onSearch} className="ml-auto hidden flex-1 max-w-md md:block">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search systems, brands, parts…"
                className="w-full rounded-full border border-slate-300 bg-brand-mist py-2 pl-4 pr-11 text-sm outline-none focus:border-brand-teal focus:bg-white"
              />
              <button aria-label="Search" className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full bg-brand-teal p-1.5 text-white hover:bg-brand-teal-dark">
                <IconSearch size={16} />
              </button>
            </div>
          </form>

          <div className="ml-auto flex items-center gap-1 md:ml-3">
            <button aria-label="Account" className="rounded-full p-2 text-brand-navy hover:bg-brand-mist">
              <IconUser size={22} />
            </button>
            <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 text-brand-navy hover:bg-brand-mist">
              <IconCart size={22} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-cta text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
