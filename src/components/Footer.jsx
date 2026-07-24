import { COMPANY } from '../data/config.js'
import { IconPhone } from './icons.jsx'

export default function Footer() {
  return (
    <footer className="mt-16 bg-brand-navy-deep text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img src={COMPANY.logo} alt={`${COMPANY.name} logo`} className="h-12 w-auto brightness-0 invert" />
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            At {COMPANY.name}, we keep it simple: no salespeople, just direct, affordable, quality HVAC.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Contact</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href={COMPANY.phoneHref} className="inline-flex items-center gap-2 hover:text-brand-teal">
                <IconPhone size={15} /> {COMPANY.phone}
              </a>
            </li>
            <li><a href={`mailto:${COMPANY.email}`} className="hover:text-brand-teal">{COMPANY.email}</a></li>
            <li><a href={COMPANY.mapHref} className="hover:text-brand-teal">{COMPANY.address}</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Shop</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href="#/journey/system_type" className="hover:text-brand-teal">Instant HVAC Quote</a></li>
            <li><a href="#/journey/system_type" className="hover:text-brand-teal">Air Conditioners</a></li>
            <li><a href="#/journey/system_type" className="hover:text-brand-teal">Heat Pumps</a></li>
            <li><a href="#/journey/system_type" className="hover:text-brand-teal">Furnaces</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">Follow</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a href={COMPANY.socials.facebook} className="hover:text-brand-teal">Facebook</a></li>
            <li><a href={COMPANY.socials.x} className="hover:text-brand-teal">X (Twitter)</a></li>
            <li><a href={COMPANY.socials.instagram} className="hover:text-brand-teal">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-400 sm:flex-row">
          <p>License #{COMPANY.license} · A Division of {COMPANY.parent}</p>
          <p>© {new Date().getFullYear()} {COMPANY.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
