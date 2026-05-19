import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

// Mock IntersectionObserver (used in PropertyGrid infinite scroll)
// vitest 4+ requires function keyword (not arrow fn) for constructor mocks
const mockIntersectionObserver = vi.fn().mockImplementation(function() {
  return { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() }
})
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: mockIntersectionObserver,
})

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock ResizeObserver
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: vi.fn().mockReturnValue({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }),
})
