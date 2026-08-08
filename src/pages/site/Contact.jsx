import { useState } from 'react'
import { COMPANY, QUOTE_ENDPOINT } from '../../data/config.js'
import { usePageMeta } from '../../lib/usePageMeta.js'
import { track, contactToUser } from '../../lib/tracking.js'
import { isDemoMode } from '../../lib/demoMode.js'
import { IconPhone, IconCheck, IconArrowRight } from '../../components/icons.jsx'

// Contact endpoint lives next to the quote endpoint on the API host.
const CONTACT_ENDPOINT = QUOTE_ENDPOINT.replace(/\/quote$/, '/contact')

export default function Contact() {
  usePageMeta(
    'Contact Us | Affordable Air Direct',
    `Call ${COMPANY.phone}, email ${COMPANY.email}, or send us a message. ${COMPANY.address}.`,
  )
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const submit = (e) => {
    e.preventDefault()
    track('Lead', { custom: { content_name: 'Contact form' }, user: contactToUser(form) })
    if (!isDemoMode()) {
      try {
        fetch(CONTACT_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
          keepalive: true,
          credentials: 'omit',
        }).catch(() => {})
      } catch { /* never block the confirmation */ }
    }
    setSent(true)
  }

  return (
    <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 lg:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-brand-navy sm:text-4xl">Talk to a real person</h1>
        <p className="mt-3 text-slate-500">
          Questions about a system, your quote, or something unusual about your home?
          Call us — you will never get a salesperson, just straight answers.
        </p>
        <div className="mt-8 space-y-4 text-slate-600">
          <a href={COMPANY.phoneHref} className="flex items-center gap-3 font-semibold text-brand-navy hover:text-brand-teal">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-teal/10 text-brand-teal-dark"><IconPhone size={20} /></span>
            {COMPANY.phone}
          </a>
          <p><a href={`mailto:${COMPANY.email}`} className="hover:text-brand-teal">{COMPANY.email}</a></p>
          <p><a href={COMPANY.mapHref} className="hover:text-brand-teal">{COMPANY.address}</a></p>
          <p className="text-sm text-slate-400">License #{COMPANY.license} · A division of {COMPANY.parent} · Proudly serving all over LA</p>
        </div>
      </div>

      <div className="card p-6">
        {sent ? (
          <div className="py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand-teal/15 text-brand-teal"><IconCheck size={30} /></div>
            <h2 className="mt-4 text-xl font-bold text-brand-navy">Message sent!</h2>
            <p className="mt-2 text-slate-500">A real person will get back to you shortly{form.phone ? ` at ${form.phone}` : ''}.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <h2 className="text-lg font-bold text-brand-navy">Send us a message</h2>
            <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
            <Field label="Phone" type="tel" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} required />
            <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
            <label className="block text-sm">
              <span className="font-medium text-brand-navy">Message</span>
              <textarea
                value={form.message} rows={4}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 outline-none focus:border-brand-teal"
              />
            </label>
            <button className="btn-primary w-full">Send message <IconArrowRight size={18} /></button>
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', required }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-brand-navy">{label}{required && <span className="text-brand-cta"> *</span>}</span>
      <input
        type={type} value={value} required={required}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 outline-none focus:border-brand-teal"
      />
    </label>
  )
}
