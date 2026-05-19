import { apiClient } from '../lib/api-client'
import type { User } from '../types/property'

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await apiClient.post<{ user: User; token: string }>('/api/v1/users/sign_in', {
    user: { email, password },
  })
  return res.data
}

export async function register(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await apiClient.post<{ user: User; token: string }>('/api/v1/users/sign_up', {
    user: { email, password, password_confirmation: password },
  })
  return res.data
}

export async function logout(): Promise<void> {
  await apiClient.delete('/api/v1/users/sign_out')
}
