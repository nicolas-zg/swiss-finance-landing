import { useEffect } from 'react'
import SentimentBadge from './SentimentBadge'
import FeedbackItem from './FeedbackItem'

export default function DrillDownPanel({ theme, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'rgba(10,22,40,0.7)', zIndex: 40, backdropFilter: 'blur(2px)' }}
      />

      {/* Panel */}
      <div
        className="animate-slide-in"
        style={{ position: 'fixed', top: 0, right: 0, width: '100%', maxWidth: 560, height: '100vh', background: 'var(--navy)', zIndex: 50, display: 'flex', flexDirection: 'column', borderLeft: '1px solid var(--navy-light)' }}
      >
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--navy-light)', flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <h2 style={{ margin: 0, fontSize: 20, color: 'var(--cream)', fontWeight: 600, lineHeight: 1.3, maxWidth: 400 }}>{theme.name}</h2>
            <button
              onClick={onClose}
              style={{ background: 'transparent', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer', fontSize: 22, lineHeight: 1, padding: 4, flexShrink: 0 }}
              title="Close (Esc)"
            >×</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <SentimentBadge sentiment={theme.sentiment} breakdown={theme.sentimentBreakdown} />
            <span style={{ color: 'var(--cream-dim)', fontSize: 13 }}>{theme.items.length} items</span>
          </div>
          {theme.description && (
            <p style={{ margin: '10px 0 0', color: 'var(--cream-dim)', fontSize: 14, lineHeight: 1.5 }}>{theme.description}</p>
          )}
        </div>

        {/* Items list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {theme.items.map((item, i) => (
            <FeedbackItem key={i} text={item.text} source={item.source} />
          ))}
        </div>
      </div>
    </>
  )
}
