export function formatCHF(amount, decimals = 0) {
  if (amount === null || amount === undefined || isNaN(amount)) return '—'
  return 'CHF ' + Math.round(amount).toLocaleString('de-CH', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatCHFCompact(amount) {
  if (!amount && amount !== 0) return '—'
  const n = Math.round(amount)
  if (n >= 1_000_000) return `CHF ${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `CHF ${(n / 1_000).toFixed(0)}k`
  return `CHF ${n}`
}

export function formatPercent(rate) {
  return (rate * 100).toFixed(1) + '%'
}
