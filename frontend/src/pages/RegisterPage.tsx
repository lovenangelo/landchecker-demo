import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterForm } from '@/components/auth/RegisterForm'

export function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center">Create account</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  )
}
