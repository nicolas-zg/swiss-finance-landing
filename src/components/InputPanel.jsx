import { useState } from 'react'
import { CANTON_NAMES } from '../engine/taxRates.js'
import { getMaxContribution } from '../engine/calculator.js'
import { formatCHF } from '../utils/formatting.js'
import ContributionSlider from './ContributionSlider.jsx'
import StrategyPicker from './StrategyPicker.jsx'

const SORTED_CANTONS = Object.entries(CANTON_NAMES).sort((a, b) => a[1].localeCompare(b[1]))

export default function InputPanel({ inputs, onChange }) {
  const [incomeDisplay, setIncomeDisplay] = useState(inputs.income.toLocaleString('de-CH'))
  const [ageStr, setAgeStr] = useState(String(inputs.age))
  const [balanceStr, setBalanceStr] = useState(String(inputs.currentBalance || ''))
  const [showBalance, setShowBalance] = useState(inputs.showCurrentBalance)

  const maxContribution = getMaxContribution(inputs)
  const isSelfEmployed = inputs.employmentStatus === 'self-employed'

  function set(key, val) { onChange({ ...inputs, [key]: val }) }

  function handleIncomeBlur(e) {
    const raw = e.target.value.replace(/[^\d]/g, '')
    const val = Math.min(500000, Math.max(20000, Number(raw) || 20000))
    set('income', val)
    setIncomeDisplay(val.toLocaleString('de-CH'))
  }

  function handleAgeChange(e) {
    const digits = e.target.value.replace(/[^\d]/g, '').slice(0, 2)
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

  function handleEmploymentChange(status) {
    const newInputs = { ...inputs, employmentStatus: status }
    const newMax = getMaxContribution(newInputs)
    if (inputs.contribution > newMax) newInputs.contribution = newMax
    onChange(newInputs)
  }

  function handlePillarTwoChange(hasPillarTwo) {
    const newInputs = { ...inputs, hasPillarTwo }
    const newMax = getMaxContribution(newInputs)
    if (inputs.contribution > newMax) newInputs.contribution = newMax
    onChange(newInputs)
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

      {/* Employment status */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
          Employment status
        </label>
        <div className="flex gap-2">
          {[
            { value: 'employed', label: 'Employed' },
            { value: 'self-employed', label: 'Self-employed' },
          ].map(({ value, label }) => {
            const active = inputs.employmentStatus === value
            return (
              <button
                key={value}
                onClick={() => handleEmploymentChange(value)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
                style={{
                  background: active ? 'var(--gold)' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${active ? 'var(--gold)' : 'var(--navy-light)'}`,
                  color: active ? 'var(--navy)' : 'var(--cream-dim)',
                }}
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Pillar 2 sub-toggle — only shown when self-employed */}
        {isSelfEmployed && (
          <div className="mt-3">
            <p className="text-xs mb-2" style={{ color: 'var(--cream-dim)' }}>
              Do you contribute to a Pillar 2 pension fund?
            </p>
            <div className="flex gap-2">
              {[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ].map(({ value, label }) => {
                const active = inputs.hasPillarTwo === value
                return (
                  <button
                    key={label}
                    onClick={() => handlePillarTwoChange(value)}
                    className="flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-150"
                    style={{
                      background: active ? 'rgba(201,168,76,.15)' : 'rgba(255,255,255,.04)',
                      border: `1px solid ${active ? 'rgba(201,168,76,.4)' : 'var(--navy-light)'}`,
                      color: active ? 'var(--gold)' : 'var(--cream-dim)',
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
            {!inputs.hasPillarTwo && (
              <p className="mt-1.5 text-xs" style={{ color: 'var(--cream-dim)' }}>
                Based on 20% of your net income — max CHF 36,288 for 2025.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Marital status */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
          Civil status
        </label>
        <div className="flex gap-2">
          {['single', 'married'].map(status => {
            const active = inputs.maritalStatus === status
            return (
              <button
                key={status}
                onClick={() => set('maritalStatus', status)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-150"
                style={{
                  background: active ? 'var(--gold)' : 'rgba(255,255,255,.04)',
                  border: `1px solid ${active ? 'var(--gold)' : 'var(--navy-light)'}`,
                  color: active ? 'var(--navy)' : 'var(--cream-dim)',
                }}
              >
                {status === 'single' ? 'Single' : 'Married'}
              </button>
            )
          })}
        </div>
        {inputs.maritalStatus === 'married' && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--cream-dim)' }}>
            Assumes a single primary income — dual-income couples may have a higher rate.
          </p>
        )}
      </div>

      {/* Income */}
      <div>
        <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
          Taxable income
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
        <p className="mt-1 text-xs" style={{ color: 'var(--cream-dim)' }}>After deductions — typically 15–25% below gross salary</p>
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
        maxContribution={maxContribution}
        isSelfEmployed={isSelfEmployed}
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
