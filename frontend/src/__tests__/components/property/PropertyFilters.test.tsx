import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@/test/utils'
import { PropertyFilters } from '@/components/property/PropertyFilters'
import { useFilterStore } from '@/store/useFilterStore'

// Mock complex base-ui components that use portals/positioning
vi.mock('@/components/ui/select', () => ({
  Select: ({ value, onValueChange, children }: { value?: string; onValueChange?: (v: string) => void; children: React.ReactNode }) => (
    <select data-testid="select" value={value ?? ''} onChange={(e) => onValueChange?.(e.target.value)}>
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  SelectItem: ({ value, children }: { value: string; children: React.ReactNode }) => (
    <option value={value}>{children}</option>
  ),
  SelectValue: ({ placeholder }: { placeholder?: string }) => <option value="">{placeholder}</option>,
}))

vi.mock('@/components/ui/slider', () => ({
  Slider: ({ onValueChange, value }: { onValueChange?: (v: number[]) => void; value?: number[] }) => (
    <div data-testid="slider">
      <input
        type="range"
        data-testid="price-min"
        onChange={(e) => onValueChange?.([Number(e.target.value), value?.[1] ?? 5_000_000])}
      />
    </div>
  ),
}))

beforeEach(() => {
  useFilterStore.getState().reset()
})

describe('PropertyFilters', () => {
  it('renders filter section headings', () => {
    render(<PropertyFilters />)
    expect(screen.getByText('Filters')).toBeInTheDocument()
    expect(screen.getByText('Price Range')).toBeInTheDocument()
    expect(screen.getByText('Bedrooms')).toBeInTheDocument()
    expect(screen.getByText('Property Type')).toBeInTheDocument()
    expect(screen.getByText('Listing Status')).toBeInTheDocument()
  })

  it('renders bedroom option buttons', () => {
    render(<PropertyFilters />)
    expect(screen.getByText('1+')).toBeInTheDocument()
    expect(screen.getByText('3+')).toBeInTheDocument()
    expect(screen.getByText('5+')).toBeInTheDocument()
  })

  it('clicking bedroom button updates store', () => {
    render(<PropertyFilters />)
    fireEvent.click(screen.getByText('3+'))
    expect(useFilterStore.getState().bedrooms).toBe(3)
  })

  it('clicking active bedroom button deselects it', () => {
    render(<PropertyFilters />)
    fireEvent.click(screen.getByText('3+'))
    fireEvent.click(screen.getByText('3+'))
    expect(useFilterStore.getState().bedrooms).toBeNull()
  })

  it('changing type select updates store', () => {
    render(<PropertyFilters />)
    const selects = screen.getAllByTestId('select')
    fireEvent.change(selects[0], { target: { value: 'apartment' } })
    expect(useFilterStore.getState().property_type).toBe('apartment')
  })

  it('changing status select updates store', () => {
    render(<PropertyFilters />)
    const selects = screen.getAllByTestId('select')
    fireEvent.change(selects[1], { target: { value: 'for_rent' } })
    expect(useFilterStore.getState().status).toBe('for_rent')
  })

  it('selecting empty value clears property_type', () => {
    render(<PropertyFilters />)
    useFilterStore.getState().setPropertyType('house')
    const selects = screen.getAllByTestId('select')
    fireEvent.change(selects[0], { target: { value: '' } })
    expect(useFilterStore.getState().property_type).toBeNull()
  })

  it('reset button clears all filters', () => {
    render(<PropertyFilters />)
    fireEvent.click(screen.getByText('3+'))
    expect(useFilterStore.getState().bedrooms).toBe(3)

    fireEvent.click(screen.getByText('Reset'))
    expect(useFilterStore.getState().bedrooms).toBeNull()
    expect(useFilterStore.getState().property_type).toBeNull()
  })

  it('renders slider', () => {
    render(<PropertyFilters />)
    expect(screen.getByTestId('slider')).toBeInTheDocument()
  })
})
