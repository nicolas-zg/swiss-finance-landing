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
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 })
      const url = canvas.toDataURL('image/png')
      if (navigator.share) {
        const blob = await (await fetch(url)).blob()
        await navigator.share({ files: [new File([blob], 'swissfinance-3a.png', { type: 'image/png' })] })
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = 'swissfinance-3a-projection.png'
        a.click()
      }
    } catch (e) {
      console.error(e)
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
    <div className="flex flex-col gap-6">

      {/* Headline stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl p-5" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)' }}>
          <div className="text-xs uppercase tracking-widest mb-3" style={{ color: 'var(--cream-dim)' }}>
            Tax saving this year
          </div>
          <div className="font-serif leading-none mb-2" style={{ fontSize: '48px', color: 'var(--gold)' }}>
            {formatCHF(results.annualTaxSaving)}
          </div>
          <div className="text-xs" style={{ color: 'var(--cream-dim)' }}>
            at your {formatPercent(results.marginalRate)} marginal rate in {cantonName}
          </div>
        </div>

        <div className="rounded-2xl p-5" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)' }}>
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--cream-dim)' }}>
              Your effective cost
            </span>
            <div className="relative group">
              <span className="text-xs cursor-help" style={{ color: 'var(--cream-dim)' }}>ⓘ</span>
              <div className="absolute bottom-full left-0 mb-2 w-56 text-xs rounded-xl p-3 z-10 hidden group-hover:block"
                style={{ background: '#1A2E45', border: '1px solid var(--navy-light)', color: 'var(--cream-dim)' }}>
                The Swiss government effectively subsidises {formatPercent(results.marginalRate)} of your 3a contribution via tax savings. This is what you actually pay out of pocket.
              </div>
            </div>
          </div>
          <div className="font-serif leading-none mb-2" style={{ fontSize: '48px', color: 'var(--cream)' }}>
            {formatCHF(results.effectiveCost)}
          </div>
          <div className="text-xs" style={{ color: 'var(--cream-dim)' }}>
            to contribute {formatCHF(inputs.contribution)} to your 3a
          </div>
        </div>
      </div>

      {/* Projection chart */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)' }}>
        <div className="text-xs uppercase tracking-widest mb-1" style={{ color: 'var(--cream-dim)' }}>
          Your 3a at retirement, age 65
        </div>
        <div className="flex gap-4 mb-4 text-xs" style={{ color: 'var(--cream-dim)' }}>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 20, height: 2, background: 'rgba(168,160,144,.4)', borderTop: '1.5px dashed rgba(168,160,144,.5)' }}></span>
            No 3a
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 20, height: 2, background: 'rgba(168,160,144,.7)' }}></span>
            Cash 3a
          </span>
          <span className="flex items-center gap-1.5">
            <span style={{ display: 'inline-block', width: 20, height: 2, background: 'var(--gold)' }}></span>
            Invested 3a
          </span>
        </div>
        <ProjectionChart data={chartData} />
        <p className="mt-4 text-sm" style={{ color: 'var(--cream-dim)' }}>
          By investing your 3a instead of leaving it in cash, you could have{' '}
          <span className="font-semibold font-serif" style={{ color: 'var(--gold)' }}>
            {formatCHF(results.investmentAdvantage)}
          </span>{' '}
          more at retirement.
        </p>
      </div>

      {/* Share */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)' }}>
        <button
          onClick={handleShare}
          disabled={sharing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
          style={{ background: 'rgba(201,168,76,.12)', border: '1px solid rgba(201,168,76,.3)', color: 'var(--gold)' }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {sharing ? 'Capturing…' : 'Share your results'}
        </button>
      </div>

      {/* Email capture */}
      <div className="rounded-2xl p-5" style={{ background: 'var(--navy-mid)', border: '1px solid var(--navy-light)' }}>
        <h3 className="font-semibold mb-1" style={{ color: 'var(--cream)' }}>
          Want calculations for mortgage, ETFs, and tax deductions too?
        </h3>
        <p className="text-sm mb-4" style={{ color: 'var(--cream-dim)' }}>
          Join the waitlist for early access.
        </p>

        {emailStatus === 'success' || emailStatus === 'already' ? (
          <p className="text-sm font-medium" style={{ color: 'var(--success)' }}>
            {emailStatus === 'already' ? "You're already on the list — we'll be in touch!" : "You're on the list. We'll be in touch."}
          </p>
        ) : (
          <form onSubmit={handleEmailSubmit} className="flex gap-2">
            <input
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: 'var(--navy)', border: '1px solid var(--navy-light)', color: 'var(--cream)' }}
            />
            <button
              type="submit"
              disabled={emailStatus === 'loading'}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
              style={{ background: 'var(--gold)', color: 'var(--navy)' }}
            >
              {emailStatus === 'loading' ? '…' : 'Join waitlist'}
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
