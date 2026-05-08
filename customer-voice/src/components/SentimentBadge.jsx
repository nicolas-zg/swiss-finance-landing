const COLORS = {
  positive: { bg: '#1a3a2a', text: 'var(--success)', bar: 'var(--success)' },
  negative: { bg: '#3a1a1a', text: 'var(--danger)',  bar: 'var(--danger)'  },
  mixed:    { bg: '#2e2a1a', text: 'var(--warning)', bar: 'var(--warning)' },
}

const LABELS = { positive: 'Positive', negative: 'Negative', mixed: 'Mixed' }

export default function SentimentBadge({ sentiment, breakdown }) {
  const c = COLORS[sentiment] ?? COLORS.mixed
  const dominant = sentiment === 'positive' ? breakdown?.positive : sentiment === 'negative' ? breakdown?.negative : Math.max(breakdown?.positive ?? 0, breakdown?.negative ?? 0)

  return (
    <span style={{ background: c.bg, borderRadius: 6, padding: '3px 8px', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <span style={{ color: c.text, fontSize: 12, fontWeight: 600 }}>{LABELS[sentiment] ?? 'Mixed'}</span>
      <span style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
        <span style={{ display: 'block', height: '100%', width: `${dominant ?? 0}%`, background: c.bar, borderRadius: 2, transition: 'width 0.4s ease' }} />
      </span>
      <span style={{ color: c.text, fontSize: 11 }}>{dominant ?? 0}%</span>
    </span>
  )
}
