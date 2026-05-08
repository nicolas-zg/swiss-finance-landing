import { exportMarkdown } from '../utils/markdownExport'

export default function ExportButton({ themes, sourceLabels }) {
  return (
    <button
      onClick={() => exportMarkdown(themes, sourceLabels)}
      style={{ background: 'transparent', border: '1px solid var(--navy-light)', color: 'var(--cream-dim)', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'border-color 0.2s, color 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--navy-light)'; e.currentTarget.style.color = 'var(--cream-dim)' }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download report (.md)
    </button>
  )
}
