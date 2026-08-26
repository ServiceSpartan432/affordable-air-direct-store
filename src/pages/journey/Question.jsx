import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import JourneyLayout from '../../components/journey/JourneyLayout.jsx'
import { STEPS, visibleSteps } from '../../data/journey.js'
import { useQuote } from '../../context/QuoteContext.jsx'
import { SYSTEM_ICONS, IconArrowLeft, IconArrowRight, IconCheck } from '../../components/icons.jsx'

export default function Question() {
  const { stepId } = useParams()
  const navigate = useNavigate()
  const { answers, setAnswer } = useQuote()

  const step = STEPS.find((s) => s.path === stepId)
  const steps = visibleSteps(answers)
  const idx = steps.findIndex((s) => s.id === step?.id)

  // guard: unknown step, no ZIP yet, or landing mid-journey without prior
  // answers. The ZIP check comes first and applies to every step — an ad that
  // deep-links to /journey/system_type must still pass the service-area gate.
  useEffect(() => {
    if (!answers.zip) navigate('/journey/zip', { replace: true })
    else if (!step) navigate('/journey/system_type', { replace: true })
    else if (step.id !== 'system_type' && !answers.system_type)
      navigate('/journey/system_type', { replace: true })
  }, [step, answers.zip, answers.system_type, navigate])

  if (!step) return null

  const goNext = (value) => {
    setAnswer(step.id, value)
    // recompute visible steps with the new answer so conditional steps resolve
    const next = visibleSteps({ ...answers, [step.id]: value })
    const here = next.findIndex((s) => s.id === step.id)
    const following = next[here + 1]
    navigate(following ? `/journey/${following.path}` : '/journey/contact')
  }

  const goBack = () => {
    if (idx > 0) navigate(`/journey/${steps[idx - 1].path}`)
    else navigate('/journey/zip')
  }

  const selected = answers[step.id]
  const tiles = step.layout === 'tiles'

  return (
    <JourneyLayout current="questions" stepIndex={idx} totalSteps={steps.length} title={step.question}>
      <div className={tiles
        ? 'mx-auto grid max-w-3xl gap-4 sm:grid-cols-3'
        : 'mx-auto max-w-lg space-y-3'}>
        {step.options.map((o) => {
          const active = selected === o.value
          const Icon = o.icon ? SYSTEM_ICONS[o.icon] : null
          return tiles ? (
            <button key={o.value} onClick={() => goNext(o.value)}
              className={`card group flex flex-col items-center gap-3 p-6 text-center transition hover:-translate-y-0.5 hover:border-brand-teal hover:shadow-md
                ${active ? 'border-brand-teal ring-2 ring-brand-teal/30' : ''}`}>
              {Icon && (
                <span className="grid h-14 w-14 place-items-center rounded-xl bg-brand-mist text-brand-navy transition group-hover:bg-brand-teal group-hover:text-white">
                  <Icon size={30} />
                </span>
              )}
              <span className="font-bold text-brand-navy">{o.label}</span>
              {o.hint && <span className="-mt-2 text-sm text-slate-500">{o.hint}</span>}
            </button>
          ) : (
            <button key={o.value} onClick={() => goNext(o.value)}
              className={`flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3.5 text-left font-medium transition hover:border-brand-teal hover:bg-brand-mist
                ${active ? 'border-brand-teal bg-brand-teal/5 text-brand-teal-dark' : 'border-slate-200 text-brand-navy'}`}>
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${active ? 'border-brand-teal bg-brand-teal text-white' : 'border-slate-300'}`}>
                {active && <IconCheck size={12} />}
              </span>
              {o.label}
            </button>
          )
        })}
      </div>

      <div className="mx-auto mt-8 flex max-w-lg items-center justify-between">
        <button onClick={goBack} className="btn-ghost">
          <IconArrowLeft size={18} /> Back
        </button>
        {step.skip && (
          <button onClick={() => goNext(step.skip.value)} className="text-sm font-semibold text-slate-500 hover:text-brand-teal">
            {step.skip.label} <IconArrowRight size={14} className="inline" />
          </button>
        )}
      </div>
    </JourneyLayout>
  )
}
