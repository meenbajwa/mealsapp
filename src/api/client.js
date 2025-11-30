import axios from 'axios'

export const BASE_URL = 'http://localhost:8080'

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 8000,
})

export default client
