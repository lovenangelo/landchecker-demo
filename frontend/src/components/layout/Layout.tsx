import type { ReactNode } from 'react'
import { Navbar } from './Navbar'

interface Props {
  children: ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-screen-xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}
