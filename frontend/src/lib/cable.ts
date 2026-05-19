import { createConsumer } from '@rails/actioncable'

const CABLE_URL = import.meta.env.VITE_CABLE_URL ?? 'ws://localhost:3000/cable'

export function createCableConsumer(token: string) {
  return createConsumer(`${CABLE_URL}?token=${encodeURIComponent(token)}`)
}
