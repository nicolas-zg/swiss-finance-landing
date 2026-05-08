import ThemeCard from './ThemeCard'
import ExportButton from './ExportButton'

export default function ThemeGrid({ themes, sourceLabels, onThemeClick, onReset }) {
  const totalItems = themes.reduce((sum, t) => sum + t.items.length, 0)

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="font-serif" style={{ fontSize: 28, color: 'var(--cream)', margin: '0 0 4px' }}>Analysis Results</h1>
          <p style={{ color: 'var(--cream-dim)', margin: 0, fontSize: 14 }}>
            {totalItems} items · {themes.length} themes · {sourceLabels.join(', ')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ExportButton themes={themes} sourceLabels={sourceLabels} />
          <button
            onClick={onReset}
            style={{ background: 'transparent', border: '1px solid var(--navy-light)', color: 'var(--cream-dim)', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}
          >
            New analysis
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {themes.map(theme => (
          <ThemeCard key={theme.name} theme={theme} onClick={() => onThemeClick(theme)} />
        ))}
      </div>
    </div>
  )
}
