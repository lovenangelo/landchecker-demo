import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/api/auth')

const { login } = await import('@/api/auth')

const mockUser = { id: 1, email: 'test@example.com' }

beforeEach(() => {
  // Merge mode — preserve store actions
  useAuthStore.setState({ user: null, token: null })
  vi.mocked(login).mockResolvedValue({ user: mockUser, token: 'tok-123' })
})

describe('LoginForm', () => {
  it('renders email and password fields', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<LoginForm />)
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('renders link to register page', () => {
    render(<LoginForm />)
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument()
  })

  it('calls login API with form values on submit', async () => {
    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secret123')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(vi.mocked(login)).toHaveBeenCalledWith('user@example.com', 'secret123')
    })
  })

  it('saves user to auth store on success', async () => {
    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'pass')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().token).toBe('tok-123')
    })
  })

  it('shows error message on login failure', async () => {
    vi.mocked(login).mockRejectedValueOnce(new Error('Unauthorized'))
    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'bad@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'wrong')
    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument()
    })
  })

  it('disables button while submitting', async () => {
    vi.mocked(login).mockImplementation(() => new Promise((r) => setTimeout(r, 100)))
    render(<LoginForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'pass')

    await userEvent.click(screen.getByRole('button', { name: /sign in/i }))

    expect(screen.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })
})
