import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { COMPANY } from '../data/config.js'
import { useCart } from '../context/CartContext.jsx'
import { IconCart, IconPhone, IconArrowRight } from './icons.jsx'

const NAV = [
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const { count } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40">
      {/* trust bar */}
      <div className="bg-brand-navy text-xs text-white/90 sm:text-[13px]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-1.5">
          <span className="hidden sm:inline">{COMPANY.tagline}</span>
          <div className="flex items-center gap-4">
            <a href={COMPANY.phoneHref} className="inline-flex items-center gap-1.5 font-medium hover:text-brand-teal">
              <IconPhone size={14} /> {COMPANY.phone}
            </a>
            <span className="hidden text-white/50 md:inline">License #{COMPANY.license}</span>
          </div>
        </div>
      </div>

      {/* main bar */}
      <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
          <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
            <img src={COMPANY.logo} alt={`${COMPANY.name} logo`} className="h-10 w-auto sm:h-11" />
          </Link>

          <nav className="ml-auto hidden items-center gap-6 lg:flex">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to}
                className={({ isActive }) =>
                  `text-sm font-semibold transition ${isActive ? 'text-brand-teal-dark' : 'text-brand-navy hover:text-brand-teal'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <Link to="/cart" aria-label="Cart" className="relative rounded-full p-2 text-brand-navy hover:bg-brand-mist">
              <IconCart size={22} />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-brand-cta text-[11px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link to="/journey/zip" className="btn-primary hidden !px-4 !py-2.5 text-sm sm:inline-flex">
              Instant quote <IconArrowRight size={16} />
            </Link>
            {/* mobile menu button */}
            <button
              aria-label="Menu" onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-lg text-brand-navy hover:bg-brand-mist lg:hidden">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {/* mobile nav */}
        {open && (
          <nav className="border-t border-slate-200 bg-white px-4 py-3 lg:hidden">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 font-semibold text-brand-navy hover:bg-brand-mist">
                {n.label}
              </NavLink>
            ))}
            <Link to="/journey/zip" onClick={() => setOpen(false)} className="btn-primary mt-2 w-full">
              Get my instant quote <IconArrowRight size={17} />
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
