import { apiClient } from '../lib/api-client'
import { mockProperties } from '../mocks/properties'
import type { Property, PropertyFilters, PaginatedResponse } from '../types/property'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

export async function getProperties(
  filters: Partial<PropertyFilters>,
  page = 1,
): Promise<PaginatedResponse<Property>> {
  if (USE_MOCK) {
    let results = [...mockProperties]
    if (filters.query) {
      const q = filters.query.toLowerCase()
      results = results.filter(
        (p) => p.title.toLowerCase().includes(q) || p.address.toLowerCase().includes(q),
      )
    }
    if (filters.min_price != null) results = results.filter((p) => p.price >= filters.min_price!)
    if (filters.max_price != null) results = results.filter((p) => p.price <= filters.max_price!)
    if (filters.bedrooms != null) results = results.filter((p) => p.bedrooms === filters.bedrooms)
    if (filters.property_type) results = results.filter((p) => p.property_type === filters.property_type)
    if (filters.status) results = results.filter((p) => p.status === filters.status)

    const perPage = 9
    const start = (page - 1) * perPage
    const paged = results.slice(start, start + perPage)
    return {
      data: paged,
      meta: {
        current_page: page,
        next_page: start + perPage < results.length ? page + 1 : null,
        total_pages: Math.ceil(results.length / perPage),
        total_count: results.length,
      },
    }
  }

  const params = { ...filters, page }
  const res = await apiClient.get<PaginatedResponse<Property>>('/api/v1/properties', { params })
  return res.data
}

export async function getProperty(id: number): Promise<Property> {
  if (USE_MOCK) {
    const p = mockProperties.find((p) => p.id === id)
    if (!p) throw new Error('Property not found')
    return p
  }
  const res = await apiClient.get<{ data: Property }>(`/api/v1/properties/${id}`)
  return res.data.data
}
