import { useSyncExternalStore } from 'react'

const KEY = 'zikrman:wishlist'
const listeners = new Set<() => void>()
let snapshot: string[] = read()

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as string[]
  } catch {
    return []
  }
}

function write(next: string[]) {
  snapshot = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    /* избранное просто не сохранится между визитами */
  }
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function toggleWishlist(slug: string) {
  write(snapshot.includes(slug) ? snapshot.filter((s) => s !== slug) : [...snapshot, slug])
}

export function useWishlist() {
  return useSyncExternalStore(subscribe, () => snapshot)
}
