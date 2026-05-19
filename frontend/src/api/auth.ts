import { apiClient } from '../lib/api-client'
import type { User } from '../types/property'

export async function login(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await apiClient.post<{ data: { user: User; token: string } }>('/users/sign_in', {
    user: { email, password },
  })
  return res.data.data
}

export async function register(email: string, password: string): Promise<{ user: User; token: string }> {
  const res = await apiClient.post<{ data: { user: User; token: string } }>('/users', {
    user: { email, password },
  })
  return res.data.data
}

export async function logout(): Promise<void> {
  await apiClient.delete('/users/sign_out')
}
