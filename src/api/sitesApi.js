import client from './client.js'

export async function getSites() {
  const response = await client.get('/api/sites')
  return response.data
}

export async function getMealsForSite(siteId) {
  const response = await client.get(`/api/sites/${siteId}/meals`)
  return response.data
}
