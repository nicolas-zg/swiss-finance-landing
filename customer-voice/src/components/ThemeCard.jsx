import SentimentBadge from './SentimentBadge'

export default function ThemeCard({ theme, onClick }) {
  return (
    <div
      onClick={onClick}
      className="animate-fade-up"
      style={{
        background: 'var(--navy-mid)',
        borderRadius: 12,
        padding: 20,
        cursor: 'pointer',
        border: '1px solid transparent',
        transition: 'border-color 0.2s, transform 0.15s',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--navy-light)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--cream)', lineHeight: 1.3 }}>{theme.name}</h3>
        <span style={{ flexShrink: 0, background: 'var(--navy)', borderRadius: 20, padding: '2px 10px', fontSize: 12, color: 'var(--cream-dim)' }}>{theme.items.length}</span>
      </div>

      <SentimentBadge sentiment={theme.sentiment} breakdown={theme.sentimentBreakdown} />

      <p style={{ margin: 0, fontSize: 13, color: 'var(--cream-dim)', lineHeight: 1.5 }}>{theme.description}</p>

      {theme.representativeQuotes?.length > 0 && (
        <div style={{ borderTop: '1px solid var(--navy-light)', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {theme.representativeQuotes.slice(0, 2).map((q, i) => (
            <p key={i} style={{ margin: 0, fontSize: 13, color: 'var(--cream-dim)', fontStyle: 'italic', lineHeight: 1.5, paddingLeft: 8, borderLeft: '2px solid var(--navy-light)' }}>
              "{q}"
            </p>
          ))}
        </div>
      )}

      <p style={{ margin: 0, fontSize: 12, color: 'var(--gold)', marginTop: 'auto' }}>Click to explore all {theme.items.length} items →</p>
    </div>
  )
}
