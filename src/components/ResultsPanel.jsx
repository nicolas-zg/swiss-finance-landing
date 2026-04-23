import { useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { CANTON_NAMES } from '../engine/taxRates.js'
import { formatCHF, formatPercent } from '../utils/formatting.js'
import ProjectionChart from './ProjectionChart.jsx'
import ShareCard from './ShareCard.jsx'

export default function ResultsPanel({ results, chartData, inputs }) {
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState(null)
  const [sharing, setSharing] = useState(false)
  const cardRef = useRef(null)

  const cantonName = CANTON_NAMES[inputs.canton] ?? inputs.canton

  async function handleShare() {
    if (!cardRef.current) return
    setSharing(true)
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0F1C2E',
        scale: 2,
        useCORS: true,
        allowTaint: true,
      })
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `swissfinance-3a-${inputs.canton}-age${inputs.age}.png`
      a.click()
    } catch (e) {
      console.error('Share failed:', e)
    } finally {
      setSharing(false)
    }
  }

  async function handleEmailSubmit(e) {
    e.preventDefault()
    if (!email) return
    setEmailStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      setEmailStatus(res.ok ? (data.already ? 'already' : 'success') : 'error')
    } catch {
      setEmailStatus('error')
    }
  }

  return (
    <div className="flex flex-col gap-5">

      {/* Headline stats — 3-card breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl p-3 sm:p-4" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)', boxShadow: '0 2px 12px rgba(0,0,0,.35)' }}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
            What you pay
          </div>
          <div className="font-serif leading-none mb-1.5" style={{ fontSize: 'clamp(18px, 4vw, 36px)', color: 'var(--cream)' }}>
            {formatCHF(results.effectiveCost)}
          </div>
          <div className="text-xs leading-snug" style={{ color: 'var(--cream-dim)' }}>
            leaves your account
          </div>
        </div>

        <div className="rounded-2xl p-3 sm:p-4" style={{ background: 'var(--navy-mid)', border: '1px solid rgba(212,172,74,.3)', boxShadow: '0 2px 12px rgba(0,0,0,.35)' }}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
            Tax saving
          </div>
          <div className="font-serif leading-none mb-1.5" style={{ fontSize: 'clamp(18px, 4vw, 36px)', color: 'var(--gold)' }}>
            {formatCHF(results.annualTaxSaving)}
          </div>
          <div className="text-xs leading-snug" style={{ color: 'var(--cream-dim)' }}>
            at {formatPercent(results.marginalRate)} in {cantonName}
          </div>
        </div>

        <div className="rounded-2xl p-3 sm:p-4" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)', boxShadow: '0 2px 12px rgba(0,0,0,.35)' }}>
          <div className="text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--cream-dim)' }}>
            In your 3a
          </div>
          <div className="font-serif leading-none mb-1.5" style={{ fontSize: 'clamp(18px, 4vw, 36px)', color: 'var(--cream)' }}>
            {formatCHF(inputs.contribution)}
          </div>
          <div className="text-xs leading-snug" style={{ color: 'var(--cream-dim)' }}>
            grows in your account
          </div>
        </div>
      </div>

      {/* Equation line */}
      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: 'var(--cream-dim)' }}>
        <span>{formatCHF(results.effectiveCost)}</span>
        <span>+</span>
        <span style={{ color: 'var(--gold)' }}>{formatCHF(results.annualTaxSaving)} tax saving</span>
        <span>=</span>
        <span style={{ color: 'var(--cream)' }}>{formatCHF(inputs.contribution)} in your 3a</span>
      </div>

      {/* Projection chart */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)', boxShadow: '0 2px 12px rgba(0,0,0,.35)' }}>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--cream-dim)' }}>
          Your 3a at retirement, age 65
        </div>
        <div className="flex flex-wrap gap-4 mb-4 text-xs" style={{ color: 'var(--cream-dim)' }}>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 18, height: 0, borderTop: '2px dashed rgba(168,160,144,.5)' }}></span>
            No 3a
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 18, height: 0, borderTop: '2px solid rgba(168,160,144,.7)' }}></span>
            Cash 3a
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 18, height: 0, borderTop: '2.5px solid var(--gold)' }}></span>
            Invested 3a
          </span>
        </div>
        <ProjectionChart data={chartData} />
        <p className="mt-4 text-sm" style={{ color: 'var(--cream-dim)' }}>
          By investing instead of keeping cash in your 3a, you could have{' '}
          <span className="font-semibold font-serif" style={{ color: 'var(--gold)' }}>
            {formatCHF(results.investmentAdvantage)}
          </span>{' '}
          more at retirement.
        </p>

        {/* Share button — inside chart card, full width */}
        <button
          onClick={handleShare}
          disabled={sharing}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ background: 'rgba(201,168,76,.1)', border: '1px solid rgba(201,168,76,.25)', color: 'var(--gold)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {sharing ? 'Saving…' : 'Download results as image'}
        </button>
      </div>

      {/* Email capture — prominent */}
      <div className="rounded-2xl p-6" style={{
        background: 'var(--navy-mid)',
        border: '1px solid rgba(201,168,76,.35)',
        boxShadow: '0 0 0 1px rgba(201,168,76,.08), 0 4px 20px rgba(0,0,0,.4)',
      }}>
        <div className="flex items-start gap-3 mb-4">
          <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-base"
            style={{ background: 'rgba(201,168,76,.15)', border: '1px solid rgba(201,168,76,.3)' }}>
            🔔
          </div>
          <div>
            <h3 className="font-semibold text-base mb-1" style={{ color: 'var(--cream)' }}>
              Mortgage, ETFs, and cross-border tax calculators — coming soon
            </h3>
            <p className="text-sm" style={{ color: 'var(--cream-dim)' }}>
              Join the waitlist and be first to access them when they launch.
            </p>
          </div>
        </div>

        {emailStatus === 'success' || emailStatus === 'already' ? (
          <div className="flex items-center gap-2 py-3 px-4 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(76,175,130,.12)', border: '1px solid rgba(76,175,130,.3)', color: 'var(--success)' }}>
            <span>✓</span>
            <span>{emailStatus === 'already' ? "Already on the list — we'll be in touch!" : "You're on the list. We'll be in touch."}</span>
          </div>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
              style={{ background: 'var(--navy)', border: '1px solid var(--navy-light)', color: 'var(--cream)' }}
            />
            <button
              type="submit"
              disabled={emailStatus === 'loading'}
              className="px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition-opacity"
              style={{ background: 'var(--gold)', color: 'var(--navy)', opacity: emailStatus === 'loading' ? 0.7 : 1 }}
            >
              {emailStatus === 'loading' ? 'Joining…' : 'Join the waitlist'}
            </button>
          </form>
        )}
        {emailStatus === 'error' && (
          <p className="mt-2 text-xs" style={{ color: '#f87171' }}>Something went wrong — please try again.</p>
        )}
      </div>

      <ShareCard inputs={inputs} results={results} cardRef={cardRef} />
    </div>
  )
}
