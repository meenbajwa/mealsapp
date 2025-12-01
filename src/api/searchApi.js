import client from './client.js'

export async function getSuggestions(query) {
  if (!query || !query.trim()) {
    return null
  }

  const response = await client.get('/api/search/suggest', {
    params: { query },
  })
  return response.data
}

export async function getSearchResults(query) {
  if (!query || !query.trim()) {
    return []
  }
  const response = await client.get('/api/search/results', {
    params: { query },
  })
  return response.data
}

export async function getTopSearches() {
  const response = await client.get('/api/search/top')
  return response.data
}

export async function recordSearchHit(query) {
  const trimmed = query?.trim()
  if (!trimmed) return null
  const response = await client.get('/api/search/hit', {
    params: { query: trimmed },
    headers: { Accept: 'application/json' },
  })
  return response.data
}
