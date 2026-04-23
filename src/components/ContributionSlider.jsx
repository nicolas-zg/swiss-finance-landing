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
          <div className="flex items-center gap-1 mb-1">
            <span className="text-xs" style={{ color: 'var(--cream-dim)' }}>Your effective cost</span>
            <div className="relative group">
              <span className="text-xs cursor-help" style={{ color: 'var(--cream-dim)' }}>ⓘ</span>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 text-xs rounded-lg p-2.5 z-10 hidden group-hover:block"
                style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)', color: 'var(--cream-dim)' }}>
                The government subsidizes {formatPercent(marginalRate)} of your contribution via tax savings. This is your true out-of-pocket cost.
              </div>
            </div>
          </div>
          <div className="text-lg font-semibold" style={{ color: 'var(--cream)' }}>
            {formatCHF(effectiveCost)}
          </div>
        </div>
      </div>
    </div>
  )
}
