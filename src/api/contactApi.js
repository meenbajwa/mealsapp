import client from './client.js'

export async function submitContact(formData) {
  const response = await client.post('/api/contact', formData)
  return response.data
}

export async function fetchContacts() {
  const response = await client.get('/api/contact')
  return response.data
}
