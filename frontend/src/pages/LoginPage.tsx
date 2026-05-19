import { Card, CardContent } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/LoginForm'

export function LoginPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-navy-100 shadow-md">
        <div className="flex flex-col items-center gap-2 pt-6 pb-2">
          <img src="/logo.png" alt="LandChecker" className="h-16 w-16 object-contain" />
          <h1 className="text-base font-semibold text-navy-800">Sign in</h1>
        </div>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
