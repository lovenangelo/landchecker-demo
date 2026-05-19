import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const raw = localStorage.getItem('auth-storage')
  if (raw) {
    try {
      const { state } = JSON.parse(raw) as { state: { token: string | null } }
      if (state.token) config.headers.Authorization = `Bearer ${state.token}`
    } catch {
      // malformed storage — skip
    }
  }
  return config
})
