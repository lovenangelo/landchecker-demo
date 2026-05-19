export type PropertyType = 'house' | 'apartment' | 'townhouse' | 'unit' | 'land' | 'rural'
export type PropertyStatus = 'for_sale' | 'for_rent' | 'sold' | 'leased'

export interface Property {
  id: number
  title: string
  description: string
  price: number
  bedrooms: number
  property_type: PropertyType
  status: PropertyStatus
  address: string
  latitude: number
  longitude: number
  image_url: string
  created_at: string
  updated_at: string
}

export interface User {
  id: number
  email: string
}

export interface WatchlistItem {
  id: number
  user_id: number
  property_id: number
  property: Property
  created_at: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    current_page: number
    next_page: number | null
    total_pages: number
    total_count: number
  }
}

export interface PropertyFilters {
  query: string
  min_price: number | null
  max_price: number | null
  bedrooms: number | null
  property_type: PropertyType | null
  status: PropertyStatus | null
}
