import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'

export function LoginForm() {
  const [email, setEmail] = useState(import.meta.env.VITE_DEMO_EMAIL ?? '')
  const [password, setPassword] = useState(import.meta.env.VITE_DEMO_PASSWORD ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const setAuth = useAuthStore((s) => s.login)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { user, token } = await login(email, password)
      setAuth(user, token)
      toast.success('Signed in successfully')
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="email">Email</label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium" htmlFor="password">Password</label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Signing in…' : 'Sign in'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        No account?{' '}
        <Link to="/register" className="underline underline-offset-2 text-foreground">
          Register
        </Link>
      </p>
    </form>
  )
}
