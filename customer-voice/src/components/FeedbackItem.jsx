import SourceTag from './SourceTag'

const SOURCE_COLORS = [
  '#1e3a5a', '#1e4a3a', '#3a1e4a', '#3a3a1e', '#1e3a4a',
]

const sourceColorCache = new Map()
let colorIndex = 0

function getSourceColor(source) {
  if (!sourceColorCache.has(source)) {
    sourceColorCache.set(source, SOURCE_COLORS[colorIndex % SOURCE_COLORS.length])
    colorIndex++
  }
  return sourceColorCache.get(source)
}

export default function FeedbackItem({ text, source }) {
  return (
    <div style={{ background: 'var(--navy-mid)', borderRadius: 8, padding: '12px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <SourceTag label={source} color={getSourceColor(source)} />
      </div>
      <p style={{ margin: 0, color: 'var(--cream)', fontSize: 14, lineHeight: 1.6 }}>{text}</p>
    </div>
  )
}
