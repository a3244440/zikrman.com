import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../config'

// Переменные окружения (VITE_SUPABASE_*) важнее значений из config.ts
const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || supabaseConfig.url
const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || supabaseConfig.publishableKey

export const supabase: SupabaseClient | null = url && key ? createClient(url, key) : null

/** true — нет ключей Supabase, сайт работает на демо-данных в браузере. */
export const isDemoMode = !supabase

export const PRODUCT_BUCKET = 'products'
