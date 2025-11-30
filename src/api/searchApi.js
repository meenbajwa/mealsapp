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

export async function getTopSearches() {
  const response = await client.get('/api/search/top')
  return response.data
}
