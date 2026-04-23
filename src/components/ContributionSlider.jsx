import { formatCHF, formatPercent } from '../utils/formatting.js'
import { MAX_CONTRIBUTION_2025 } from '../engine/calculator.js'

export default function ContributionSlider({ contribution, onChange, annualTaxSaving, effectiveCost, marginalRate }) {
  const pct = (contribution / MAX_CONTRIBUTION_2025) * 100
  const isMax = contribution >= MAX_CONTRIBUTION_2025

  return (
    <div>
      <div className="flex justify-between items-baseline mb-2">
        <label className="text-xs uppercase tracking-widest" style={{ color: 'var(--cream-dim)' }}>
          Annual 3a contribution
        </label>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm" style={{ color: 'var(--cream)' }}>
            {formatCHF(contribution)}
          </span>
          {isMax && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(201,168,76,.15)', color: 'var(--gold)' }}>
              Max 2025
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={0}
          max={MAX_CONTRIBUTION_2025}
          step={100}
          value={contribution}
          onChange={e => onChange(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, var(--gold) ${pct}%, var(--navy-light) ${pct}%)`,
          }}
        />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg p-3" style={{ background: 'rgba(201,168,76,.08)', border: '1px solid rgba(201,168,76,.2)' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--cream-dim)' }}>Tax saving this year</div>
          <div className="text-lg font-semibold font-serif" style={{ color: 'var(--gold)' }}>
            {formatCHF(annualTaxSaving)}
          </div>
        </div>
        <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,.03)', border: '1px solid var(--navy-light)' }}>
          <div className="text-xs mb-1" style={{ color: 'var(--cream-dim)' }}>What you pay</div>
          <div className="text-lg font-semibold" style={{ color: 'var(--cream)' }}>
            {formatCHF(effectiveCost)}
          </div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--cream-dim)', opacity: 0.7 }}>after tax benefit</div>
        </div>
      </div>
    </div>
  )
}
