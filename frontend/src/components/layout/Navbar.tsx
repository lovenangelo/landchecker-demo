import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { PropertySearchBar } from '@/components/property/PropertySearchBar'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { useAuthStore } from '@/store/useAuthStore'
import { useWatchlistIds } from '@/hooks/useWatchlist'

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()
  const watchedIds = useWatchlistIds()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1.5 shrink-0 mr-2">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">L</span>
          </div>
          <span className="font-semibold text-sm hidden sm:block">LandChecker</span>
        </Link>

        {/* Search */}
        <div className="flex-1">
          <PropertySearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <Link to="/watchlist">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Watchlist</span>
                  {watchedIds.size > 0 && (
                    <span className="ml-0.5 text-xs bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                      {watchedIds.size}
                    </span>
                  )}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden sm:flex">
                Sign out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">Sign in</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </>
          )}

          {/* Mobile filter sheet */}
          <Sheet>
            <SheetTrigger
              render={<Button variant="outline" size="icon" className="lg:hidden h-8 w-8" />}
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="left" className="w-72 pt-8 overflow-y-auto">
              <PropertyFilters />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
