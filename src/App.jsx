import { useState, useMemo } from 'react'
import { calculateResults, buildChartData } from './engine/calculator.js'
import InputPanel from './components/InputPanel.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'

const DEFAULT_INPUTS = {
  canton: 'ZH',
  age: 32,
  income: 120000,
  contribution: 7258,
  currentBalance: 0,
  strategy: 'growth',
  maritalStatus: 'single',
  showCurrentBalance: false,
  employmentStatus: 'employed',
  hasPillarTwo: false,
}

export default function App() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)

  const results  = useMemo(() => calculateResults(inputs), [inputs])
  const chartData = useMemo(() => buildChartData(inputs), [inputs])

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>

      {/* Nav */}
      <nav className="sticky top-0 z-50 px-6 py-4 flex items-center justify-between"
        style={{ background: 'rgba(10,22,40,.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid var(--navy-light)' }}>
        <span className="font-bold text-base tracking-tight" style={{ color: 'var(--cream)' }}>
          Swiss<span style={{ color: 'var(--gold)' }}>Finance</span>
        </span>
        <span className="text-xs font-medium px-3 py-1 rounded-full"
          style={{ background: 'rgba(201,168,76,.12)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,.25)' }}>
          Private Beta
        </span>
      </nav>

      {/* Page header */}
      <div className="px-6 pt-10 pb-8 max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--cream-dim)' }}>
          Swiss Financial Calculators
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-normal leading-tight mb-2" style={{ color: 'var(--cream)' }}>
          Pillar 3a Tax Savings Calculator
        </h1>
        <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
          See exactly how much your 3a contribution saves in taxes — and how it grows by retirement.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="px-6 pb-16 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* Left: inputs */}
          <div className="w-full lg:w-[400px] lg:flex-shrink-0">
            <InputPanel inputs={inputs} onChange={setInputs} />
          </div>

          {/* Right: results */}
          <div className="w-full lg:flex-1 min-w-0">
            <ResultsPanel results={results} chartData={chartData} inputs={inputs} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-8 text-center" style={{ borderTop: '1px solid var(--navy-light)' }}>
        <p className="text-xs max-w-xl mx-auto" style={{ color: 'var(--cream-dim)', lineHeight: 1.7 }}>
          This calculator provides estimates for planning purposes only. Tax rates are approximations and vary by commune.
          Married rates assume a single primary income — dual-income households may have higher effective rates.
          Results do not constitute financial advice.
        </p>
      </footer>
    </div>
  )
}
