const FEEDBACK_COLUMN_HINTS = ['text', 'comment', 'feedback', 'response', 'answer', 'message', 'note', 'review', 'body']

function parseCSVLine(line) {
  const fields = []
  let current = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++ }
      else inQuotes = !inQuotes
    } else if (ch === ',' && !inQuotes) {
      fields.push(current.trim())
      current = ''
    } else {
      current += ch
    }
  }
  fields.push(current.trim())
  return fields
}

function pickFeedbackColumn(headers) {
  const lower = headers.map(h => h.toLowerCase().replace(/[^a-z]/g, ''))
  const hintMatch = lower.findIndex(h => FEEDBACK_COLUMN_HINTS.some(hint => h.includes(hint)))
  if (hintMatch !== -1) return hintMatch
  return 0
}

export function parseCSV(csvText, sourceLabel) {
  const lines = csvText.split(/\r?\n/).filter(l => l.trim())
  if (lines.length < 2) return []

  const headers = parseCSVLine(lines[0])
  const colIndex = pickFeedbackColumn(headers)

  return lines
    .slice(1)
    .map(line => parseCSVLine(line)[colIndex] ?? '')
    .filter(text => text.length > 5)
    .map(text => ({ text: text.replace(/^"|"$/g, ''), source: sourceLabel }))
}

export function parsePlainText(rawText, sourceLabel) {
  return rawText
    .split(/\n{2,}|\r\n{2,}/)
    .map(block => block.replace(/\n/g, ' ').trim())
    .filter(text => text.length > 5)
    .map(text => ({ text, source: sourceLabel }))
}
