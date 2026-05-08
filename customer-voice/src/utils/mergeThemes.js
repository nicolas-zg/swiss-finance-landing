export function mergeThemes(chunkedResults) {
  const map = new Map()

  for (const { themes } of chunkedResults) {
    for (const theme of themes) {
      const key = theme.name.toLowerCase().trim()
      if (map.has(key)) {
        const existing = map.get(key)
        existing.items = [...existing.items, ...theme.items]
        existing.representativeQuotes = dedupeQuotes([
          ...existing.representativeQuotes,
          ...theme.representativeQuotes,
        ])
        existing._sentimentTotals = addSentimentTotals(
          existing._sentimentTotals,
          theme.sentimentBreakdown,
          theme.items.length
        )
      } else {
        map.set(key, {
          ...theme,
          _sentimentTotals: { ...theme.sentimentBreakdown, weight: theme.items.length },
        })
      }
    }
  }

  return Array.from(map.values()).map(theme => {
    const { _sentimentTotals, ...rest } = theme
    const totalWeight = _sentimentTotals.weight || 1
    return {
      ...rest,
      sentimentBreakdown: {
        positive: Math.round(_sentimentTotals.positive / totalWeight),
        negative: Math.round(_sentimentTotals.negative / totalWeight),
        neutral: Math.round(_sentimentTotals.neutral / totalWeight),
      },
      sentiment: deriveSentiment(theme.sentimentBreakdown),
    }
  }).sort((a, b) => b.items.length - a.items.length)
}

function addSentimentTotals(existing, incoming, weight) {
  return {
    positive: existing.positive + incoming.positive * weight,
    negative: existing.negative + incoming.negative * weight,
    neutral: existing.neutral + incoming.neutral * weight,
    weight: existing.weight + weight,
  }
}

function dedupeQuotes(quotes) {
  const seen = new Set()
  return quotes.filter(q => {
    const k = q.trim().toLowerCase()
    if (seen.has(k)) return false
    seen.add(k)
    return true
  }).slice(0, 3)
}

function deriveSentiment(breakdown) {
  if (!breakdown) return 'mixed'
  const { positive = 0, negative = 0 } = breakdown
  if (positive >= 60) return 'positive'
  if (negative >= 60) return 'negative'
  return 'mixed'
}
