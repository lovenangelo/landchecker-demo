import { useEffect, useState } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useFilterStore } from '@/store/useFilterStore'
import { useDebounce } from '@/hooks/useDebounce'

export function PropertySearchBar() {
  const query = useFilterStore((s) => s.query)
  const setQuery = useFilterStore((s) => s.setQuery)
  const [local, setLocal] = useState(query)
  const debouncedLocal = useDebounce(local, 350)

  useEffect(() => {
    setLocal(query)
  }, [query])

  useEffect(() => {
    setQuery(debouncedLocal)
  }, [debouncedLocal, setQuery])

  function clear() {
    setLocal('')
    setQuery('')
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        className="pl-9 pr-9"
        placeholder="Search by address or title…"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      {local && (
        <button
          onClick={clear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
