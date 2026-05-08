import { useState, useCallback } from 'react'
import UploadPanel from './components/UploadPanel'
import AnalysisProgress from './components/AnalysisProgress'
import ThemeGrid from './components/ThemeGrid'
import DrillDownPanel from './components/DrillDownPanel'
import { chunkItems } from './utils/chunker'
import { mergeThemes } from './utils/mergeThemes'

export default function App() {
  const [phase, setPhase] = useState('input')
  const [themes, setThemes] = useState([])
  const [sourceLabels, setSourceLabels] = useState([])
  const [activeTheme, setActiveTheme] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState({ step: 0, total: 1 })

  const handleAnalyze = useCallback(async (allItems, labels) => {
    setSourceLabels(labels)
    setError(null)
    setPhase('loading')

    const chunks = chunkItems(allItems)
    setProgress({ step: 0, total: chunks.length })

    const results = []
    let existingThemes = []

    for (let i = 0; i < chunks.length; i++) {
      setProgress({ step: i + 1, total: chunks.length })
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: chunks[i], chunkIndex: i, totalChunks: chunks.length, existingThemes }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(body.error ?? 'Analysis failed. Please try again.')
        setPhase('input')
        return
      }
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setPhase('input')
        return
      }
      results.push(data)
      existingThemes = data.themes ?? []
    }

    const merged = mergeThemes(results)
    setThemes(merged)
    setPhase('results')
  }, [])

  function handleReset() {
    setPhase('input')
    setThemes([])
    setActiveTheme(null)
    setError(null)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--navy)' }}>
      {error && (
        <div style={{ position: 'fixed', top: 16, left: '50%', transform: 'translateX(-50%)', background: '#3a1a1a', border: '1px solid var(--danger)', color: 'var(--cream)', borderRadius: 8, padding: '10px 20px', fontSize: 14, zIndex: 100 }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 12, background: 'transparent', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer', fontSize: 16 }}>×</button>
        </div>
      )}

      {phase === 'input' && <UploadPanel onAnalyze={handleAnalyze} />}
      {phase === 'loading' && <AnalysisProgress step={progress.step} total={progress.total} />}
      {(phase === 'results' || phase === 'drilldown') && (
        <ThemeGrid
          themes={themes}
          sourceLabels={sourceLabels}
          onThemeClick={t => { setActiveTheme(t); setPhase('drilldown') }}
          onReset={handleReset}
        />
      )}
      {phase === 'drilldown' && activeTheme && (
        <DrillDownPanel theme={activeTheme} onClose={() => { setActiveTheme(null); setPhase('results') }} />
      )}
    </div>
  )
}
