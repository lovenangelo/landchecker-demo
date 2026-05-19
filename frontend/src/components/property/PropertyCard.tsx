import { memo } from 'react'
import { BedDouble, MapPin } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { WatchlistButton } from '@/components/watchlist/WatchlistButton'
import { cn } from '@/lib/utils'
import type { Property } from '@/types/property'

interface Props {
  property: Property
}

const STATUS_LABELS: Record<Property['status'], string> = {
  for_sale: 'For Sale',
  for_rent: 'For Rent',
  sold: 'Sold',
  leased: 'Leased',
}

const STATUS_COLORS: Record<Property['status'], string> = {
  for_sale: 'bg-emerald-100 text-emerald-700',
  for_rent: 'bg-blue-100 text-blue-700',
  sold: 'bg-gray-100 text-gray-600',
  leased: 'bg-amber-100 text-amber-700',
}

const TYPE_LABELS: Record<Property['property_type'], string> = {
  house: 'House',
  apartment: 'Apartment',
  townhouse: 'Townhouse',
  unit: 'Unit',
  land: 'Land',
  rural: 'Rural',
}

function formatPrice(price: number, status: Property['status']) {
  if (status === 'for_rent' || status === 'leased') {
    return `$${price.toLocaleString()}/wk`
  }
  if (price >= 1_000_000) {
    return `$${(price / 1_000_000).toFixed(price % 1_000_000 === 0 ? 0 : 1)}m`
  }
  return `$${price.toLocaleString()}`
}

export const PropertyCard = memo(function PropertyCard({ property }: Props) {
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-shadow duration-200 cursor-pointer p-0">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={property.image_url}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2">
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', STATUS_COLORS[property.status])}>
            {STATUS_LABELS[property.status]}
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <WatchlistButton propertyId={property.id} />
        </div>
      </div>

      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <p className="font-semibold text-base text-foreground leading-tight line-clamp-2">
            {property.title}
          </p>
          <p className="text-base font-bold text-foreground shrink-0">
            {formatPrice(property.price, property.status)}
          </p>
        </div>

        <div className="flex items-center gap-1 mt-1 text-muted-foreground text-sm">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{property.address}</span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {TYPE_LABELS[property.property_type]}
          </Badge>
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <BedDouble className="h-3 w-3" />
              {property.bedrooms} bed{property.bedrooms !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
})
