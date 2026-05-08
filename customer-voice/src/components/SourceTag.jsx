import { useState } from 'react'

export default function SourceTag({ label, onRename, color }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(label)

  function commit() {
    setEditing(false)
    if (draft.trim() && draft !== label) onRename?.(draft.trim())
    else setDraft(label)
  }

  const bg = color ?? 'var(--navy-light)'

  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setDraft(label); setEditing(false) } }}
        style={{ background: bg, color: 'var(--cream)', border: '1px solid var(--gold)', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontFamily: 'inherit', outline: 'none', width: 120 }}
      />
    )
  }

  return (
    <span
      onClick={() => onRename && setEditing(true)}
      style={{ background: bg, color: 'var(--cream)', borderRadius: 4, padding: '2px 8px', fontSize: 12, fontWeight: 500, cursor: onRename ? 'text' : 'default', whiteSpace: 'nowrap', display: 'inline-block' }}
      title={onRename ? 'Click to rename' : undefined}
    >
      {label}
    </span>
  )
}
