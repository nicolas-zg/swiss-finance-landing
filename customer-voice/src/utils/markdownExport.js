export function exportMarkdown(themes, sourceLabels = []) {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const totalItems = themes.reduce((sum, t) => sum + t.items.length, 0)
  const sourcesLine = sourceLabels.length ? `\nSources: ${sourceLabels.join(', ')}` : ''

  const lines = [
    `# Customer Voice Report — ${date}`,
    ``,
    `Analyzed **${totalItems} feedback items** across **${themes.length} themes**.${sourcesLine}`,
    ``,
    `---`,
    ``,
  ]

  themes.forEach((theme, i) => {
    const { positive = 0, negative = 0, neutral = 0 } = theme.sentimentBreakdown ?? {}
    lines.push(`## ${i + 1}. ${theme.name} (${theme.items.length} items)`)
    lines.push(``)
    lines.push(`**Sentiment:** ${sentimentLabel(theme.sentiment)} — ${positive}% positive · ${negative}% negative · ${neutral}% neutral`)
    lines.push(``)
    lines.push(theme.description)
    lines.push(``)
    if (theme.representativeQuotes?.length) {
      lines.push(`**Representative quotes:**`)
      theme.representativeQuotes.forEach(q => lines.push(`> "${q}"`))
      lines.push(``)
    }
    lines.push(`---`)
    lines.push(``)
  })

  const md = lines.join('\n')
  const blob = new Blob([md], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `customer-voice-report-${Date.now()}.md`
  a.click()
  URL.revokeObjectURL(url)
}

function sentimentLabel(s) {
  if (s === 'positive') return '🟢 Positive'
  if (s === 'negative') return '🔴 Negative'
  return '🟡 Mixed'
}
