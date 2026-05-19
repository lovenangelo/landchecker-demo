import { Card, CardContent } from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-brand-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-sm border-navy-100 shadow-md">
        <div className="flex flex-col items-center gap-2 pt-6 pb-2">
          <img src="/logo.png" alt="LandChecker" className="h-16 w-16 object-contain" />
          <h1 className="text-base font-semibold text-navy-800">Create account</h1>
        </div>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
