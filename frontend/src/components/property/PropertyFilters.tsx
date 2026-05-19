import { useFilterStore } from '@/store/useFilterStore'
import { Slider } from '@/components/ui/slider'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { PropertyType, PropertyStatus } from '@/types/property'

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'unit', label: 'Unit' },
  { value: 'land', label: 'Land' },
  { value: 'rural', label: 'Rural' },
]

const STATUSES: { value: PropertyStatus; label: string }[] = [
  { value: 'for_sale', label: 'For Sale' },
  { value: 'for_rent', label: 'For Rent' },
  { value: 'sold', label: 'Sold' },
  { value: 'leased', label: 'Leased' },
]

const BEDROOM_OPTIONS = [1, 2, 3, 4, 5]

const MAX_PRICE = 5_000_000

function formatPriceLabel(val: number) {
  if (val >= 1_000_000) return `$${(val / 1_000_000).toFixed(1)}m`
  if (val >= 1_000) return `$${(val / 1_000).toFixed(0)}k`
  return `$${val}`
}

export function PropertyFilters() {
  const {
    min_price,
    max_price,
    bedrooms,
    property_type,
    status,
    setPriceRange,
    setBedrooms,
    setPropertyType,
    setStatus,
    reset,
  } = useFilterStore()

  const priceRange: [number, number] = [min_price ?? 0, max_price ?? MAX_PRICE]

  function handlePriceChange(val: number | readonly number[]) {
    const vals = Array.isArray(val) ? (val as readonly number[]) : [val as number, val as number]
    setPriceRange(vals[0] === 0 ? null : vals[0], vals[1] === MAX_PRICE ? null : vals[1])
  }

  return (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm text-foreground">Filters</h2>
        <Button variant="ghost" size="sm" className="text-xs h-7 px-2" onClick={reset}>
          Reset
        </Button>
      </div>

      {/* Price range */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Price Range</p>
        <Slider
          min={0}
          max={MAX_PRICE}
          step={50_000}
          value={priceRange}
          onValueChange={handlePriceChange}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatPriceLabel(priceRange[0])}</span>
          <span>{priceRange[1] === MAX_PRICE ? 'Any' : formatPriceLabel(priceRange[1])}</span>
        </div>
      </div>

      {/* Bedrooms */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Bedrooms</p>
        <div className="flex gap-1.5 flex-wrap">
          {BEDROOM_OPTIONS.map((n) => (
            <button
              key={n}
              onClick={() => setBedrooms(bedrooms === n ? null : n)}
              className={`h-8 w-8 rounded-full text-sm border transition-colors ${
                bedrooms === n
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary'
              }`}
            >
              {n}+
            </button>
          ))}
        </div>
      </div>

      {/* Property type */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Property Type</p>
        <Select
          value={property_type ?? ''}
          onValueChange={(v) => setPropertyType(v === '' ? null : (v as PropertyType))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any type</SelectItem>
            {PROPERTY_TYPES.map((t) => (
              <SelectItem key={t.value} value={t.value}>
                {t.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Listing Status</p>
        <Select
          value={status ?? ''}
          onValueChange={(v) => setStatus(v === '' ? null : (v as PropertyStatus))}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Any status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Any status</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  )
}
