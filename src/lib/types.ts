export interface ProductColor {
  name: string
  hex: string
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  price: number
  old_price: number | null
  description: string
  details: string[]
  /** Таблица размеров обычным текстом, по строке на параметр */
  size_chart: string
  sizes: string[]
  colors: ProductColor[]
  images: string[]
  is_new: boolean
  is_featured: boolean
  in_stock: boolean
  sort_order: number
  created_at: string
}

export type ProductInput = Omit<Product, 'id' | 'created_at'>
