import { CANTON_NAMES } from '../engine/taxRates.js'
import { INVESTMENT_STRATEGIES } from '../engine/calculator.js'
import { formatCHF } from '../utils/formatting.js'

export default function ShareCard({ inputs, results, cardRef }) {
  const cantonName = CANTON_NAMES[inputs.canton] ?? inputs.canton
  const strategyName = INVESTMENT_STRATEGIES[inputs.strategy]?.label ?? inputs.strategy

  return (
    <div
      ref={cardRef}
      style={{
        position: 'fixed',
        left: '-9999px',
        top: 0,
        width: '600px',
        height: '340px',
        background: 'var(--navy)',
        border: '1px solid var(--navy-light)',
        borderRadius: '16px',
        padding: '32px',
        fontFamily: "'DM Sans', sans-serif",
        color: 'var(--cream)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Top */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.02em' }}>
            Swiss<span style={{ color: 'var(--gold)' }}>Finance</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cream-dim)', marginTop: '2px' }}>
            Pillar 3a Calculator
          </div>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--cream-dim)', textAlign: 'right' }}>
          {cantonName} · Age {inputs.age} · {strategyName} strategy
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cream-dim)', marginBottom: '6px' }}>
            Tax saving this year
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--gold)', lineHeight: 1 }}>
            {formatCHF(results?.annualTaxSaving)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cream-dim)', marginTop: '6px' }}>
            contributing {formatCHF(inputs.contribution)} to 3a
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cream-dim)', marginBottom: '6px' }}>
            At retirement (invested)
          </div>
          <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: '42px', color: 'var(--gold)', lineHeight: 1 }}>
            {formatCHF(results?.totalAtRetirement)}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--cream-dim)', marginTop: '6px' }}>
            vs {formatCHF(results?.totalCashScenario)} in cash 3a
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ fontSize: '12px', color: 'var(--cream-dim)', borderTop: '1px solid var(--navy-light)', paddingTop: '16px' }}>
        Calculate yours free at swiss-finance-beta.vercel.app
      </div>
    </div>
  )
}
