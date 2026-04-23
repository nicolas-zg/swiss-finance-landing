import { INVESTMENT_STRATEGIES } from '../engine/calculator.js'

export default function StrategyPicker({ strategy, onChange }) {
  const current = INVESTMENT_STRATEGIES[strategy]

  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--cream-dim)' }}>
        Investment strategy
      </label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(INVESTMENT_STRATEGIES).map(([key, s]) => {
          const active = key === strategy
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-col items-center px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150"
              style={{
                background: active ? 'var(--gold)' : 'rgba(255,255,255,.04)',
                border: `1px solid ${active ? 'var(--gold)' : 'var(--navy-light)'}`,
                color: active ? 'var(--navy)' : 'var(--cream-dim)',
              }}
            >
              <span className="font-semibold">{s.label}</span>
              <span style={{ opacity: 0.75 }}>{(s.return * 100).toFixed(1)}%/yr</span>
            </button>
          )
        })}
      </div>
      {current && (
        <p className="mt-2 text-xs" style={{ color: 'var(--cream-dim)' }}>{current.description}</p>
      )}
    </div>
  )
}
