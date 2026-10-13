import { catalogProducts } from '../data/catalog'
import { supabaseConfig } from '../config'
import { isDemoMode, PRODUCT_BUCKET, supabase } from './supabase'
import type { Product, ProductInput } from './types'

/* ------------------------------------------------------------------ */
/* Демо-хранилище (localStorage) — используется без Supabase           */
/* ------------------------------------------------------------------ */

const DEMO_KEY = 'zikrman:demo-products-v2'
const DEMO_SESSION_KEY = 'zikrman:demo-admin'
export const DEMO_ADMIN_PASSWORD = '007'

function readDemo(): Product[] {
  try {
    const raw = localStorage.getItem(DEMO_KEY)
    if (raw) return JSON.parse(raw) as Product[]
  } catch {
    /* хранилище недоступно — отдаём исходные данные */
  }
  return catalogProducts
}

function writeDemo(products: Product[]) {
  try {
    localStorage.setItem(DEMO_KEY, JSON.stringify(products))
  } catch {
    throw new Error('Не хватает места в браузере. В демо-режиме загружайте меньше фото.')
  }
}

export function resetDemo() {
  try {
    localStorage.removeItem(DEMO_KEY)
  } catch {
    /* ignore */
  }
}

function sortProducts(list: Product[]) {
  return [...list].sort(
    (a, b) => a.sort_order - b.sort_order || b.created_at.localeCompare(a.created_at),
  )
}

/* ------------------------------------------------------------------ */
/* Каталог                                                             */
/* ------------------------------------------------------------------ */

export async function listProducts(): Promise<Product[]> {
  if (isDemoMode) return sortProducts(readDemo())
  const { data, error } = await supabase!
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as Product[]
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isDemoMode) return readDemo().find((p) => p.slug === slug) ?? null
  const { data, error } = await supabase!.from('products').select('*').eq('slug', slug).maybeSingle()
  if (error) throw error
  return data as Product | null
}

export async function getProductById(id: string): Promise<Product | null> {
  if (isDemoMode) return readDemo().find((p) => p.id === id) ?? null
  const { data, error } = await supabase!.from('products').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return data as Product | null
}

export async function createProduct(input: ProductInput): Promise<Product> {
  if (isDemoMode) {
    const list = readDemo()
    if (list.some((p) => p.slug === input.slug)) throw new Error('Товар с таким адресом (slug) уже есть')
    const product: Product = { ...input, id: crypto.randomUUID(), created_at: new Date().toISOString() }
    writeDemo([product, ...list])
    return product
  }
  const { data, error } = await supabase!.from('products').insert(input).select().single()
  if (error) throw humanize(error)
  return data as Product
}

export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  if (isDemoMode) {
    const list = readDemo()
    if (list.some((p) => p.slug === input.slug && p.id !== id))
      throw new Error('Товар с таким адресом (slug) уже есть')
    const next = list.map((p) => (p.id === id ? { ...p, ...input } : p))
    writeDemo(next)
    return next.find((p) => p.id === id)!
  }
  const { data, error } = await supabase!.from('products').update(input).eq('id', id).select().single()
  if (error) throw humanize(error)
  return data as Product
}

export async function deleteProduct(id: string): Promise<void> {
  if (isDemoMode) {
    writeDemo(readDemo().filter((p) => p.id !== id))
    return
  }
  const { error } = await supabase!.from('products').delete().eq('id', id)
  if (error) throw humanize(error)
}

function humanize(error: { message: string; code?: string }) {
  if (error.code === '23505') return new Error('Товар с таким адресом (slug) уже есть')
  if (error.code === '42501') return new Error('Нет прав администратора')
  return new Error(error.message)
}

/* ------------------------------------------------------------------ */
/* Фото                                                                */
/* ------------------------------------------------------------------ */

/** Сжимает фото в браузере, чтобы каталог грузился быстро. */
async function compressImage(file: File, maxSide = 1600, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close()
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Не удалось обработать фото'))), 'image/webp', quality),
  )
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(blob)
  })
}

export async function uploadImage(file: File): Promise<string> {
  if (isDemoMode) {
    const blob = await compressImage(file, 900, 0.75)
    return blobToDataUrl(blob)
  }
  const blob = await compressImage(file)
  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.webp`
  const { error } = await supabase!.storage
    .from(PRODUCT_BUCKET)
    .upload(path, blob, { contentType: 'image/webp', cacheControl: '31536000' })
  if (error) throw new Error(`Не удалось загрузить фото: ${error.message}`)
  return supabase!.storage.from(PRODUCT_BUCKET).getPublicUrl(path).data.publicUrl
}

/* ------------------------------------------------------------------ */
/* Авторизация администратора                                          */
/* ------------------------------------------------------------------ */

export interface AdminUser {
  email: string
}

/**
 * Supabase требует пароль от 6 символов, а админу удобнее короткий («007»),
 * поэтому к введённому паролю всегда добавляется одна и та же приставка.
 * В supabase/setup.sql пароль задаётся так же: 'zikr:' || пароль.
 */
const toAuthPassword = (password: string) => `zikr:${password}`

export async function getAdmin(): Promise<AdminUser | null> {
  if (isDemoMode) {
    try {
      return sessionStorage.getItem(DEMO_SESSION_KEY) ? { email: supabaseConfig.adminEmail } : null
    } catch {
      return null
    }
  }
  const { data } = await supabase!.auth.getSession()
  const user = data.session?.user
  if (!user) return null
  const { data: isAdmin, error } = await supabase!.rpc('is_admin')
  if (error || !isAdmin) return null
  return { email: user.email ?? '' }
}

export async function signIn(password: string): Promise<AdminUser> {
  if (isDemoMode) {
    if (password !== DEMO_ADMIN_PASSWORD) throw new Error('Неверный пароль')
    sessionStorage.setItem(DEMO_SESSION_KEY, '1')
    return { email: supabaseConfig.adminEmail }
  }
  const { error } = await supabase!.auth.signInWithPassword({
    email: supabaseConfig.adminEmail,
    password: toAuthPassword(password),
  })
  if (error) throw new Error(error.status === 429 ? 'Слишком много попыток, подождите пару минут' : 'Неверный пароль')
  const admin = await getAdmin()
  if (!admin) {
    await supabase!.auth.signOut()
    throw new Error('У этого аккаунта нет прав администратора')
  }
  return admin
}

export async function changePassword(newPassword: string) {
  if (isDemoMode) throw new Error('В демо-режиме пароль не меняется')
  const { error } = await supabase!.auth.updateUser({ password: toAuthPassword(newPassword) })
  if (error) throw new Error(`Не удалось сменить пароль: ${error.message}`)
}

export async function signOut() {
  if (isDemoMode) {
    sessionStorage.removeItem(DEMO_SESSION_KEY)
    return
  }
  await supabase!.auth.signOut()
}
