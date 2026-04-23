import { useState } from 'react'
import { CANTON_NAMES } from '../engine/taxRates.js'
import { MAX_CONTRIBUTION_2025 } from '../engine/calculator.js'
import { formatCHF } from '../utils/formatting.js'
import ContributionSlider from './ContributionSlider.jsx'
import StrategyPicker from './StrategyPicker.jsx'

const SORTED_CANTONS = Object.entries(CANTON_NAMES).sort((a, b) => a[1].localeCompare(b[1]))

export default function InputPanel({ inputs, onChange, results }) {
  const [incomeDisplay, setIncomeDisplay] = useState(inputs.income.toLocaleString('de-CH'))
  const [ageStr, setAgeStr] = useState(String(inputs.age))
  const [balanceStr, setBalanceStr] = useState(String(inputs.currentBalance || ''))
  const [showBalance, setShowBalance] = useState(inputs.showCurrentBalance)

  function set(key, val) { onChange({ ...inputs, [key]: val }) }

  function handleIncomeBlur(e) {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const val = Math.min(500000, Math.max(20000, Number(raw) || 20000))
    set('income', val)
    setIncomeDisplay(val.toLocaleString('de-CH'))
  }

  function handleAgeChange(e) {
    const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 2) // integers only, max 2 digits
    setAgeStr(digits)
    const n = parseInt(digits, 10)
    if (!isNaN(n) && n >= 18 && n <= 64) set('age', n)
  }

  function handleAgeBlur() {
    const n = parseInt(ageStr, 10)
    const clamped = isNaN(n) ? 32 : Math.min(64, Math.max(18, n))
    set('age', clamped)
    setAgeStr(String(clamped))
  }

  function handleBalanceChange(e) {
    const str = e.target.value
    setBalanceStr(str)
    const n = parseInt(str.replace(/[^\d]/g, ''), 10)
    if (!isNaN(n) && n >= 0) set('currentBalance', n)
  }

  function handleBalanceBlur() {
    const n = parseInt(balanceStr.replace(/[^\d]/g, ''), 10)
    const val = isNaN(n) ? 0 : Math.max(0, n)
    set('currentBalance', val)
    setBalanceStr(val === 0 ? '' : String(val))
  }

  function handleBalanceToggle() {
    const next = !showBalance
    setShowBalance(next)
    if (!next) setBalanceStr('')
    onChange({ ...inputs, showCurrentBalance: next, currentBalance: next ? inputs.currentBalance : 0 })
  }

  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)' }}>
      {/* Canton */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
          Canton of residence
        </label>
        <select
          value={inputs.canton}
          onChange={e => set('canton', e.target.value)}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium pr-10"
          style={{ background: 'var(--navy)', border: '1px solid var(--navy-light)', color: 'var(--cream)' }}
        >
          {SORTED_CANTONS.map(([code, name]) => (
            <option key={code} value={code}>{name} ({code})</option>
          ))}
        </select>
      </div>

      {/* Income */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
          Gross annual salary
        </label>
        <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--navy-light)' }}>
          <span className="px-4 py-3 text-sm font-medium" style={{ background: 'var(--navy)', color: 'var(--cream-dim)', borderRight: '1px solid var(--navy-light)' }}>
            CHF
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={incomeDisplay}
            onChange={e => setIncomeDisplay(e.target.value)}
            onBlur={handleIncomeBlur}
            className="flex-1 px-4 py-3 text-sm font-medium outline-none"
            style={{ background: 'var(--navy)', color: 'var(--cream)' }}
          />
        </div>
        <p className="mt-1 text-xs" style={{ color: 'var(--cream-dim)' }}>Used to estimate your marginal tax rate</p>
      </div>

      {/* Age */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
          Your age
        </label>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="18–64"
          value={ageStr}
          onChange={handleAgeChange}
          onBlur={handleAgeBlur}
          className="w-full px-4 py-3 rounded-xl text-sm font-medium outline-none"
          style={{ background: 'var(--navy)', border: '1px solid var(--navy-light)', color: 'var(--cream)' }}
        />
        {inputs.age >= 63 && (
          <p className="mt-1 text-xs" style={{ color: 'var(--gold)' }}>
            {65 - inputs.age === 1 ? '1 year' : `${65 - inputs.age} years`} until retirement — maximise your contribution now.
          </p>
        )}
      </div>

      {/* Contribution slider */}
      <ContributionSlider
        contribution={inputs.contribution}
        onChange={val => set('contribution', val)}
        annualTaxSaving={results?.annualTaxSaving ?? 0}
        effectiveCost={results?.effectiveCost ?? inputs.contribution}
        marginalRate={results?.marginalRate ?? 0}
      />

      {/* Strategy */}
      <StrategyPicker
        strategy={inputs.strategy}
        onChange={val => set('strategy', val)}
      />

      {/* Current balance toggle */}
      <div>
        {!showBalance ? (
          <button
            onClick={handleBalanceToggle}
            className="text-xs font-medium transition-colors"
            style={{ color: 'var(--cream-dim)' }}
          >
            + I already have a 3a balance →
          </button>
        ) : (
          <div>
            <div className="flex justify-between items-baseline mb-2">
              <label className="text-xs uppercase tracking-widest" style={{ color: 'var(--cream-dim)' }}>
                Current 3a balance
              </label>
              <button onClick={handleBalanceToggle} className="text-xs" style={{ color: 'var(--cream-dim)' }}>
                Remove ×
              </button>
            </div>
            <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1px solid var(--navy-light)' }}>
              <span className="px-4 py-3 text-sm" style={{ background: 'var(--navy)', color: 'var(--cream-dim)', borderRight: '1px solid var(--navy-light)' }}>
                CHF
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={balanceStr}
                onChange={handleBalanceChange}
                onBlur={handleBalanceBlur}
                className="flex-1 px-4 py-3 text-sm outline-none"
                style={{ background: 'var(--navy)', color: 'var(--cream)' }}
                placeholder="e.g. 25000"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
