import { COMPANY } from '../../data/config.js'
import { usePageMeta } from '../../lib/usePageMeta.js'

// Standard privacy policy for the site + quote funnel. Have counsel review
// before launch if you want belt-and-suspenders.
export default function Privacy() {
  usePageMeta('Privacy Policy | Affordable Air Direct', 'How Affordable Air Direct collects, uses, and protects your information.')
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-brand-navy">Privacy Policy</h1>
      <div className="prose-sm mt-6 space-y-5 leading-relaxed text-slate-600">
        <p>
          {COMPANY.name}, a division of {COMPANY.parent} (&ldquo;we&rdquo;, &ldquo;us&rdquo;), respects your privacy.
          This policy describes what we collect on affordableairdirect.com and how we use it.
        </p>
        <Sec t="What we collect">
          Information you provide when requesting a quote or contacting us — name, phone number, email address,
          and details about your home and HVAC needs. We also collect standard analytics data (pages visited,
          device and browser information, IP address) via cookies and similar technologies.
        </Sec>
        <Sec t="How we use it">
          To generate and email your quote, schedule and perform installations, respond to your inquiries, and
          improve our website and advertising. We use advertising and analytics partners (such as Meta) to measure
          our marketing; where we share data for measurement, identifiers like email and phone are hashed first.
        </Sec>
        <Sec t="What we don't do">
          We do not sell your personal information. We share it only with service providers who help us operate
          (for example, scheduling, email delivery, and payment or financing partners you choose to use).
        </Sec>
        <Sec t="Calls and text messages">
          If you check the consent box on our quote form, you agree that {COMPANY.name} may contact you by phone
          call and text message — including using an autodialer or automated/prerecorded messages — at the number
          you provide, for both servicing your request and marketing. Consent is not required to get a quote or
          make a purchase. Message and data rates may apply; message frequency varies. Reply STOP to any text to
          opt out, or contact us at {COMPANY.email} or {COMPANY.phone}.
        </Sec>
        <Sec t="Your choices">
          You can request access to, correction of, or deletion of your personal information at any time by
          emailing {COMPANY.email} or calling {COMPANY.phone}. You can also disable cookies in your browser.
        </Sec>
        <Sec t="Contact">
          {COMPANY.name} · {COMPANY.address} · {COMPANY.email} · {COMPANY.phone}. License #{COMPANY.license}.
        </Sec>
      </div>
    </div>
  )
}

function Sec({ t, children }) {
  return (
    <div>
      <h2 className="mb-1 font-bold text-brand-navy">{t}</h2>
      <p>{children}</p>
    </div>
  )
}
