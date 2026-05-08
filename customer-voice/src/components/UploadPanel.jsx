import { useState, useRef } from 'react'
import SourceTag from './SourceTag'
import { parseCSV, parsePlainText } from '../utils/csvParser'

let nextId = 1

function createSource(label, rawText, fileType = 'text') {
  return { id: nextId++, label, rawText, fileType }
}

export default function UploadPanel({ onAnalyze }) {
  const [sources, setSources] = useState([])
  const [dragging, setDragging] = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [pasteLabel, setPasteLabel] = useState('Pasted feedback')
  const fileRef = useRef()

  function addSource(src) {
    setSources(prev => [...prev, src])
  }

  function removeSource(id) {
    setSources(prev => prev.filter(s => s.id !== id))
  }

  function renameSource(id, newLabel) {
    setSources(prev => prev.map(s => s.id === id ? { ...s, label: newLabel } : s))
  }

  function handleFiles(files) {
    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = e => {
        const label = file.name.replace(/\.[^.]+$/, '')
        addSource(createSource(label, e.target.result, 'csv'))
      }
      reader.readAsText(file)
    })
  }

  function handleDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  function addPaste() {
    if (!pasteText.trim()) return
    addSource(createSource(pasteLabel, pasteText, 'text'))
    setPasteText('')
    setPasteLabel(`Pasted feedback ${sources.length + 2}`)
  }

  function handleAnalyze() {
    const allItems = sources.flatMap(src =>
      src.fileType === 'csv'
        ? parseCSV(src.rawText, src.label)
        : parsePlainText(src.rawText, src.label)
    )
    onAnalyze(allItems, sources.map(s => s.label))
  }

  const totalItems = sources.reduce((sum, src) => {
    const items = src.fileType === 'csv'
      ? parseCSV(src.rawText, src.label)
      : parsePlainText(src.rawText, src.label)
    return sum + items.length
  }, 0)

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '40px 24px' }}>
      <h1 className="font-serif" style={{ fontSize: 32, color: 'var(--cream)', marginBottom: 8 }}>Customer Voice</h1>
      <p style={{ color: 'var(--cream-dim)', marginBottom: 40, fontSize: 15 }}>Upload customer feedback from multiple sources. The AI will find common themes and sentiments.</p>

      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        style={{
          border: `2px dashed ${dragging ? 'var(--gold)' : 'var(--navy-light)'}`,
          borderRadius: 12,
          padding: '32px 24px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: 24,
          transition: 'border-color 0.2s, background 0.2s',
          background: dragging ? 'rgba(212,172,74,0.05)' : 'transparent',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--cream-dim)" strokeWidth="1.5" style={{ marginBottom: 12 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
        <p style={{ color: 'var(--cream)', margin: 0, fontWeight: 500 }}>Drop CSV files here or click to browse</p>
        <p style={{ color: 'var(--cream-dim)', margin: '4px 0 0', fontSize: 13 }}>Supports any CSV export from Typeform, Google Forms, Zendesk, etc.</p>
        <input ref={fileRef} type="file" accept=".csv,.txt" multiple style={{ display: 'none' }} onChange={e => handleFiles(e.target.files)} />
      </div>

      {/* Paste area */}
      <div style={{ background: 'var(--navy-mid)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
          <span style={{ color: 'var(--cream-dim)', fontSize: 13 }}>Source label:</span>
          <input
            value={pasteLabel}
            onChange={e => setPasteLabel(e.target.value)}
            style={{ background: 'var(--navy)', border: '1px solid var(--navy-light)', borderRadius: 6, padding: '4px 10px', color: 'var(--cream)', fontSize: 13, fontFamily: 'inherit', outline: 'none', flex: 1 }}
          />
        </div>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder="Paste raw feedback here — interview notes, survey responses, Slack messages, support tickets… Separate items with a blank line."
          style={{ width: '100%', minHeight: 120, background: 'var(--navy)', border: '1px solid var(--navy-light)', borderRadius: 8, padding: '10px 14px', color: 'var(--cream)', fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', lineHeight: 1.6 }}
        />
        <button
          onClick={addPaste}
          disabled={!pasteText.trim()}
          style={{ marginTop: 10, background: pasteText.trim() ? 'var(--navy-light)' : 'transparent', border: '1px solid var(--navy-light)', color: pasteText.trim() ? 'var(--cream)' : 'var(--cream-dim)', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: pasteText.trim() ? 'pointer' : 'default', transition: 'background 0.2s' }}
        >
          Add as source
        </button>
      </div>

      {/* Source list */}
      {sources.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <p style={{ color: 'var(--cream-dim)', fontSize: 13, marginBottom: 10 }}>Added sources — click a label to rename</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sources.map(src => {
              const count = src.fileType === 'csv'
                ? parseCSV(src.rawText, src.label).length
                : parsePlainText(src.rawText, src.label).length
              return (
                <div key={src.id} style={{ background: 'var(--navy-mid)', borderRadius: 8, padding: '10px 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <SourceTag label={src.label} onRename={newLabel => renameSource(src.id, newLabel)} />
                  <span style={{ color: 'var(--cream-dim)', fontSize: 13 }}>{count} items</span>
                  <button
                    onClick={() => removeSource(src.id)}
                    style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: 'var(--cream-dim)', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                    title="Remove source"
                  >×</button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={sources.length === 0 || totalItems === 0}
        style={{
          width: '100%',
          padding: '14px 24px',
          background: sources.length > 0 && totalItems > 0 ? 'var(--gold)' : 'var(--navy-light)',
          color: sources.length > 0 && totalItems > 0 ? 'var(--navy)' : 'var(--cream-dim)',
          border: 'none',
          borderRadius: 10,
          fontSize: 16,
          fontWeight: 600,
          cursor: sources.length > 0 && totalItems > 0 ? 'pointer' : 'default',
          transition: 'background 0.2s',
          fontFamily: 'inherit',
        }}
      >
        {totalItems > 0 ? `Analyze ${totalItems} items` : 'Add at least one source to continue'}
      </button>
    </div>
  )
}
