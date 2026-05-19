import { Routes, Route } from 'react-router-dom'
import { SearchPage } from './pages/SearchPage'
import { WatchlistPage } from './pages/WatchlistPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/watchlist" element={<WatchlistPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}
