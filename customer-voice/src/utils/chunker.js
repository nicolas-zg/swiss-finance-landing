const CHUNK_SIZE = 60

export function chunkItems(items) {
  const chunks = []
  for (let i = 0; i < items.length; i += CHUNK_SIZE) {
    chunks.push(items.slice(i, i + CHUNK_SIZE))
  }
  return chunks
}
