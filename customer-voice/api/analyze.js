const Anthropic = require('@anthropic-ai/sdk')

const SYSTEM_PROMPT = `You are a product analyst specializing in customer feedback synthesis. Your job is to read a list of customer feedback items and group them into meaningful themes. You must return ONLY valid JSON — no explanation, no markdown code fences, no prose before or after.`

function buildUserPrompt(items, chunkIndex, totalChunks, existingThemes) {
  const batchNote = totalChunks > 1
    ? ` This is batch ${chunkIndex + 1} of ${totalChunks}.`
    : ''
  const existingNote = existingThemes.length > 0
    ? ` Where possible, assign items to these existing themes: ${existingThemes.map(t => t.name).join(', ')}. You may create new themes if no existing one fits well.`
    : ''

  return `Analyze the following ${items.length} customer feedback items.${batchNote}${existingNote}

Return a JSON object with this exact structure:
{
  "themes": [
    {
      "name": "Short theme label (3-6 words)",
      "description": "One sentence describing what this theme covers",
      "sentiment": "positive or negative or mixed",
      "sentimentBreakdown": {
        "positive": <integer 0-100>,
        "negative": <integer 0-100>,
        "neutral": <integer 0-100>
      },
      "items": [
        { "text": "<exact original feedback text>", "source": "<exact original source label>" }
      ],
      "representativeQuotes": [
        "<verbatim quote from an item in this theme>",
        "<second quote>",
        "<optional third quote>"
      ]
    }
  ]
}

Rules:
- Every item must appear in exactly one theme.
- representativeQuotes must be verbatim substrings of the item texts in that theme.
- sentimentBreakdown values must sum to 100.
- Aim for 3-8 themes total. Prefer fewer, broader themes over many narrow ones.
- Do not create a theme with fewer than 2 items unless the dataset has fewer than 6 items total.
- Return all item texts and sources exactly as given — do not paraphrase or truncate.

Feedback items (JSON array):
${JSON.stringify(items, null, 2)}`
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { items, chunkIndex = 0, totalChunks = 1, existingThemes = [] } = req.body ?? {}

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'items array is required' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    console.error('Missing ANTHROPIC_API_KEY')
    return res.status(500).json({ error: 'Server configuration error' })
  }

  const client = new Anthropic({ apiKey })

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildUserPrompt(items, chunkIndex, totalChunks, existingThemes) }],
  })

  const raw = message.content[0]?.text ?? ''

  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch {
    console.error('Claude response parse failed:', raw.slice(0, 500))
    return res.status(500).json({ error: 'parse_failed', raw: raw.slice(0, 500) })
  }

  return res.status(200).json(parsed)
}
