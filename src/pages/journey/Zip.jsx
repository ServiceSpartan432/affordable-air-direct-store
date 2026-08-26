import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import JourneyLayout from '../../components/journey/JourneyLayout.jsx'
import { useQuote } from '../../context/QuoteContext.jsx'
import { STEPS } from '../../data/journey.js'
import { inServiceArea } from '../../data/serviceZips.js'
import { trackFunnel } from '../../lib/funnel.js'
import { IconArrowRight, IconShield } from '../../components/icons.jsx'

// The front door of the funnel. Roughly 40% of the leads this store produced
// were ZIPs we can't reach (NC, OH, AZ, TX), which cost real ad money and real
// CSR time before anyone noticed. Asking first is the cheapest possible place
// to find that out — nobody has spent five steps building a quote yet, and no
// Lead event or ServiceTitan booking is created for someone we can't serve.
export default function Zip() {
  const navigate = useNavigate()
  const { setAnswer, setContact } = useQuote()
  const [zip, setZip] = useState('')
  const [blocked, setBlocked] = useState('')

  const submit = (e) => {
    e.preventDefault()
    const z = zip.replace(/\D/g, '')
    if (z.length !== 5) return

    if (inServiceArea(z)) {
      setAnswer('zip', z)
      setContact({ zip: z }) // prefills the contact gate later in the funnel
      trackFunnel('zip_ok', { zip: z })
      navigate(`/journey/${STEPS[0].path}`)
      return
    }
    // Out of area: no Meta event, no lead, no booking. Telemetry only, so the
    // funnel report can show how much of the ad spend is landing out of reach.
    trackFunnel('zip_blocked', { zip: z })
    setBlocked(z)
  }

  if (blocked) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-20 pt-10">
        <h1 className="mb-8 text-center text-2xl font-bold text-brand-navy sm:text-3xl">
          We're not in your area yet
        </h1>
        <div className="card mx-auto max-w-md space-y-4 p-6 text-center">
          <p className="text-slate-600">
            We install across Los Angeles and Ventura County, and {blocked} is outside where our
            crews can get to. Rather than take your information and waste your time, we'd
            rather tell you now.
          </p>
          <p className="text-sm text-slate-500">
            If you typed it wrong, fix it below and we'll pull your prices right up.
          </p>
          <button type="button" onClick={() => { setBlocked(''); setZip('') }} className="btn-primary w-full">
            Try a different ZIP
          </button>
          <button type="button" onClick={() => navigate('/')} className="btn-ghost w-full">
            Back to home
          </button>
        </div>
      </div>
    )
  }

  const complete = zip.replace(/\D/g, '').length === 5

  return (
    <JourneyLayout
      current="zip"
      title="First, where are we installing?"
      subtitle="We'll check that your address is in our service area before we price anything."
    >
      <form onSubmit={submit} className="mx-auto max-w-sm space-y-4">
        <label className="block text-sm">
          <span className="font-medium text-brand-navy">ZIP code<span className="text-brand-cta"> *</span></span>
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
            inputMode="numeric"
            pattern="\d{5}"
            maxLength={5}
            required
            autoFocus
            placeholder="91311"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-center text-lg tracking-[0.3em] outline-none focus:border-brand-teal"
          />
        </label>

        <button className="btn-primary w-full" disabled={!complete}>
          Continue <IconArrowRight size={18} />
        </button>

        <p className="flex items-start gap-2 text-xs text-slate-400">
          <IconShield size={15} className="mt-0.5 shrink-0 text-brand-teal" />
          <span className="text-left">
            Just your ZIP for now. No name, no phone, no email until you've seen your prices.
          </span>
        </p>
      </form>
    </JourneyLayout>
  )
}
