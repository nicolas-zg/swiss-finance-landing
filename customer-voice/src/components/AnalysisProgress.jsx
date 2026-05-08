const MESSAGES = [
  'Parsing feedback...',
  'Sending to AI...',
  'Identifying themes...',
  'Grouping responses...',
  'Analyzing sentiment...',
  'Almost done...',
]

export default function AnalysisProgress({ step, total }) {
  const msg = total > 1
    ? `Analyzing batch ${step} of ${total}...`
    : MESSAGES[Math.min(step, MESSAGES.length - 1)]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20 }}>
      <div className="animate-spin" style={{ width: 40, height: 40, border: '3px solid var(--navy-light)', borderTopColor: 'var(--gold)', borderRadius: '50%' }} />
      <p style={{ color: 'var(--cream)', fontSize: 16, margin: 0 }}>{msg}</p>
      {total > 1 && (
        <div style={{ width: 200, height: 4, background: 'var(--navy-light)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(step / total) * 100}%`, background: 'var(--gold)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
      )}
      <p style={{ color: 'var(--cream-dim)', fontSize: 13, margin: 0 }}>This may take 10–30 seconds</p>
    </div>
  )
}
