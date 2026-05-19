import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '@/store/useAuthStore'

const mockUser = { id: 1, email: 'test@example.com' }

beforeEach(() => {
  // Merge mode (no second arg) preserves actions defined in the store
  useAuthStore.setState({ user: null, token: null })
})

describe('useAuthStore', () => {
  it('starts with no user and no token', () => {
    const { user, token } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(token).toBeNull()
  })

  it('login sets user and token', () => {
    useAuthStore.getState().login(mockUser, 'tok-abc')
    const { user, token } = useAuthStore.getState()
    expect(user).toEqual(mockUser)
    expect(token).toBe('tok-abc')
  })

  it('logout clears user and token', () => {
    useAuthStore.getState().login(mockUser, 'tok-abc')
    useAuthStore.getState().logout()
    const { user, token } = useAuthStore.getState()
    expect(user).toBeNull()
    expect(token).toBeNull()
  })

  it('login overwrites existing session', () => {
    const other = { id: 2, email: 'other@example.com' }
    useAuthStore.getState().login(mockUser, 'first-token')
    useAuthStore.getState().login(other, 'second-token')
    const { user, token } = useAuthStore.getState()
    expect(user).toEqual(other)
    expect(token).toBe('second-token')
  })
})
