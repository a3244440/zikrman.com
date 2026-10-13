import { useCallback, useEffect, useState } from 'react'
import { listProducts } from '../lib/api'
import type { Product } from '../lib/types'

let cache: Product[] | null = null
const listeners = new Set<(p: Product[]) => void>()

/** Сбрасывает кэш каталога и перезагружает его (вызывается после правок в админке). */
export async function refreshProducts() {
  cache = await listProducts()
  listeners.forEach((l) => l(cache!))
  return cache
}

export function useProducts() {
  const [products, setProducts] = useState<Product[] | null>(cache)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listeners.add(setProducts)
    if (!cache) refreshProducts().catch((e: Error) => setError(e.message))
    return () => {
      listeners.delete(setProducts)
    }
  }, [])

  const reload = useCallback(() => refreshProducts().catch((e: Error) => setError(e.message)), [])

  return { products, loading: products === null && !error, error, reload }
}
