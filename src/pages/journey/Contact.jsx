import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import JourneyLayout from '../../components/journey/JourneyLayout.jsx'
import { useQuote } from '../../context/QuoteContext.jsx'
import { visibleSteps } from '../../data/journey.js'
import { buildQuote } from '../../lib/quote.js'
import { track, contactToUser } from '../../lib/tracking.js'
import { IconArrowLeft, IconArrowRight, IconShield } from '../../components/icons.jsx'

export default function Contact() {
  const navigate = useNavigate()
  const { answers, contact, setContact } = useQuote()
  const steps = visibleSteps(answers)

  useEffect(() => {
    if (!answers.zip) navigate('/journey/zip', { replace: true })
    else if (!answers.system_type) navigate('/journey/system_type', { replace: true })
  }, [answers.zip, answers.system_type, navigate])

  const submit = (e) => {
    e.preventDefault()
    // Lead — the key conversion. Value = the "most popular" matched option.
    const { options, label } = buildQuote(answers)
    const featured = options[options.length >= 3 ? 1 : 0]
    track('Lead', {
      custom: featured
        ? { value: featured.price, currency: 'USD', content_name: label, content_ids: options.map((o) => o.sku) }
        : {},
      user: contactToUser(contact),
    })
    navigate('/journey/results')
  }

  return (
    <JourneyLayout
      current="contact"
      totalSteps={steps.length}
      title="Your instant quote is ready!"
      subtitle="Where should we send a copy? We'll show your prices on the next screen."
    >
      <form onSubmit={submit} className="mx-auto max-w-md space-y-4">
        <Field label="Full name" value={contact.name} onChange={(v) => setContact({ name: v })} required autoFocus />
        <Field label="Phone number" type="tel" value={contact.phone} onChange={(v) => setContact({ phone: v })} required />
        <Field label="Email address" type="email" value={contact.email} onChange={(v) => setContact({ email: v })} required />
        <Field
          label="ZIP code" value={contact.zip} required
          onChange={(v) => setContact({ zip: v.replace(/\D/g, '').slice(0, 5) })}
          inputMode="numeric" pattern="\d{5}" maxLength={5}
        />

        <button className="btn-primary w-full">
          Show my prices <IconArrowRight size={18} />
        </button>

        <p className="flex items-start gap-2 text-center text-xs text-slate-400">
          <IconShield size={15} className="mt-0.5 shrink-0 text-brand-teal" />
          <span className="text-left">
            We never sell your information, and you'll never get a pushy sales visit — that's the whole point.
          </span>
        </p>
      </form>

      <div className="mx-auto mt-6 flex max-w-md">
        <button type="button" onClick={() => navigate(`/journey/${steps[steps.length - 1].path}`)} className="btn-ghost">
          <IconArrowLeft size={18} /> Back
        </button>
      </div>
    </JourneyLayout>
  )
}

function Field({ label, value, onChange, type = 'text', required, autoFocus, ...rest }) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-brand-navy">{label}{required && <span className="text-brand-cta"> *</span>}</span>
      <input
        type={type} value={value} required={required} autoFocus={autoFocus} {...rest}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 outline-none focus:border-brand-teal"
      />
    </label>
  )
}
