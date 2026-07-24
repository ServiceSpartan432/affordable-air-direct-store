// Progress across the whole journey: N questions -> contact -> your options
export default function JourneyLayout({ current, stepIndex = 0, totalSteps = 5, title, subtitle, children }) {
  const total = totalSteps + 2 // questions + contact + results
  const position =
    current === 'results' ? total : current === 'contact' ? totalSteps + 1 : stepIndex + 1
  const pct = Math.round((position / total) * 100)

  const stageLabel =
    current === 'results' ? 'Your options' : current === 'contact' ? 'Almost there' : `Step ${position} of ${total}`

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      {/* progress */}
      <div className="mx-auto mb-8 max-w-2xl">
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-slate-500">
          <span>{stageLabel}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-brand-teal transition-all duration-500 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="animate-rise">
        {title && (
          <div className="mb-8 text-center">
            <h1 className="mx-auto max-w-2xl text-2xl font-bold text-brand-navy sm:text-3xl">{title}</h1>
            {subtitle && <p className="mx-auto mt-3 max-w-xl text-slate-500">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
