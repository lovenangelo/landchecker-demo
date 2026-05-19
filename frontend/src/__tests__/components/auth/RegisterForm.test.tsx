import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { useAuthStore } from '@/store/useAuthStore'

vi.mock('@/api/auth')

const { register } = await import('@/api/auth')

const mockUser = { id: 2, email: 'new@example.com' }

beforeEach(() => {
  // Merge mode — preserve store actions
  useAuthStore.setState({ user: null, token: null })
  vi.mocked(register).mockResolvedValue({ user: mockUser, token: 'new-tok' })
})

describe('RegisterForm', () => {
  it('renders all three fields', () => {
    render(<RegisterForm />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
  })

  it('renders link to login page', () => {
    render(<RegisterForm />)
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows error when passwords do not match', async () => {
    render(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'user@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'password1')
    await userEvent.type(screen.getByLabelText('Confirm password'), 'password2')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(vi.mocked(register)).not.toHaveBeenCalled()
  })

  it('calls register API on valid submit', async () => {
    render(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secure123')
    await userEvent.type(screen.getByLabelText('Confirm password'), 'secure123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(vi.mocked(register)).toHaveBeenCalledWith('new@example.com', 'secure123')
    })
  })

  it('saves user to auth store on success', async () => {
    render(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'secure123')
    await userEvent.type(screen.getByLabelText('Confirm password'), 'secure123')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(useAuthStore.getState().user).toEqual(mockUser)
      expect(useAuthStore.getState().token).toBe('new-tok')
    })
  })

  it('shows error on registration failure', async () => {
    vi.mocked(register).mockRejectedValueOnce(new Error('Email taken'))
    render(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'taken@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'pass1234')
    await userEvent.type(screen.getByLabelText('Confirm password'), 'pass1234')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument()
    })
  })

  it('disables button while submitting', async () => {
    vi.mocked(register).mockImplementation(() => new Promise((r) => setTimeout(r, 100)))
    render(<RegisterForm />)

    await userEvent.type(screen.getByLabelText('Email'), 'new@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'pass1234')
    await userEvent.type(screen.getByLabelText('Confirm password'), 'pass1234')
    await userEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(screen.getByRole('button', { name: /creating account/i })).toBeDisabled()
  })
})
