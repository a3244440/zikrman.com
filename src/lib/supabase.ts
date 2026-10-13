import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

/** true — нет ключей Supabase, сайт работает на демо-данных в браузере. */
export const isDemoMode = !supabase

export const PRODUCT_BUCKET = 'products'
