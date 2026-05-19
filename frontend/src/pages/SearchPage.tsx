import { Layout } from '@/components/layout/Layout'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { useProperties } from '@/hooks/useProperties'
import { useFilterStore } from '@/store/useFilterStore'

function ResultsHeader() {
  const { data, isLoading } = useProperties()
  const total = data?.pages[0]?.meta.total_count
  const hasFilters = useFilterStore(
    (s) => !!(s.query || s.min_price || s.max_price || s.bedrooms || s.property_type || s.status),
  )

  return (
    <div className="flex items-baseline justify-between mb-4">
      <h1 className="text-lg font-semibold">
        {isLoading ? 'Loading…' : total != null ? `${total} properties` : 'Properties'}
      </h1>
      {hasFilters && (
        <span className="text-xs text-muted-foreground">Filters active</span>
      )}
    </div>
  )
}

export function SearchPage() {
  return (
    <Layout>
      <div className="flex gap-8">
        {/* Sidebar filters — desktop only */}
        <div className="hidden lg:block w-56 shrink-0 pt-1">
          <PropertyFilters />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <ResultsHeader />
          <PropertyGrid />
        </div>
      </div>
    </Layout>
  )
}
