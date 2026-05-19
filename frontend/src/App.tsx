import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { SearchPage } from './pages/SearchPage'
import { WatchlistPage } from './pages/WatchlistPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { useAuthStore } from './store/useAuthStore'
import { useWatchlistChannel } from './hooks/useWatchlistChannel'

function GuestOnly({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  return user ? <Navigate to="/" replace /> : <>{children}</>
}

function RealtimeSync() {
  useWatchlistChannel()
  return null
}

export default function App() {
  return (
    <>
      <RealtimeSync />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/login" element={<GuestOnly><LoginPage /></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><RegisterPage /></GuestOnly>} />
      </Routes>
      <Toaster position="bottom-right" richColors />
    </>
  )
}
