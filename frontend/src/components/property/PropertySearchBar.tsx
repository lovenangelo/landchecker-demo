import { useEffect, useState, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useFilterStore } from '@/store/useFilterStore'

export function PropertySearchBar() {
  const query = useFilterStore((s) => s.query)
  const setQuery = useFilterStore((s) => s.setQuery)
  const [local, setLocal] = useState(query)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLocal(query)
  }, [query])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    setLocal(val)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setQuery(val), 350)
  }

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
        onChange={handleChange}
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
