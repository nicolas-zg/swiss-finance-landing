import { formatCHF, formatPercent } from '../utils/formatting.js'
import { MAX_CONTRIBUTION_2025 } from '../engine/calculator.js'

export default function ContributionSlider({ contribution, onChange }) {
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

    </div>
  )
}
