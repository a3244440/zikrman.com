// Основные настройки магазина. Меняйте здесь — всё остальное подтянется само.

export const site = {
  brand: 'ZIKR',
  tagline: 'Одежда для тех, кто помнит о главном.',
  collection: 'Новая коллекция 2026',
  // Цены в каталоге Tilda указаны в долларах
  currency: '$',
  currencyBefore: true,
  locale: 'ru-RU',
  topBarNote: 'Шоурум в Бишкеке · ул. Шабдан Баатыра, 97 · ежедневно 09:00–20:00',
  contacts: {
    // Номер в международном формате без «+» и пробелов, например 996995571313.
    // Если пусто — кнопка «Заказать» ведёт в Instagram.
    whatsapp: '996702555599',
    phone: '+996 995 571 313',
    instagram: 'https://instagram.com/zikr.man.official',
    telegram: '',
    email: 'hello@zikrman.com',
  },
}

/**
 * Подключение к Supabase (Project Settings → API). Оба значения публичные — их видит любой браузер,
 * а права на изменение каталога проверяет сама база. Пусто — сайт работает в демо-режиме.
 */
export const supabaseConfig = {
  url: '',
  publishableKey: '',
  // Вход в админку — только по паролю. Этот служебный email вводить не нужно: сайт подставляет его сам.
  adminEmail: 'admin@zikrman.com',
}

export interface Category {
  slug: string
  title: string
  short: string
  description: string
  image: string
}

export const categories: Category[] = [
  {
    slug: 'sport',
    title: 'Спортивные костюмы',
    short: 'Sport',
    description: 'Костюмы на молнии для города и дороги.',
    image: '/images/products/premium-sport/01.webp',
  },
  {
    slug: 'casual',
    title: 'Костюмы Casual',
    short: 'Casual',
    description: 'Сдержанные костюмы на каждый день.',
    image: '/images/brand/look-brown.webp',
  },
  {
    slug: 'tshirts',
    title: 'Футболки',
    short: 'Футболки',
    description: 'Каллиграфия, логотип ZIKR и база.',
    image: '/images/products/futbolka-s-kalligrafiey-temnyy-purpurno-siniy/01.webp',
  },
  {
    slug: 'pants',
    title: 'Штаны',
    short: 'Штаны',
    description: 'Лёгкие летние штаны из ткани «холодок».',
    image: '/images/products/shtany-holodok-chernyy/01.webp',
  },
  {
    slug: 'umrah',
    title: 'Умра и Хадж',
    short: 'Умра и Хадж',
    description: 'Камис и ихрам для поездки к святыням.',
    image: '/images/products/muslinovyy-ihram-zikr/01.webp',
  },
]

export const sizePresets = ['S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '48', '50', '52', '54', '56', '58', 'ONE SIZE']

export function categoryBySlug(slug: string | undefined) {
  return categories.find((c) => c.slug === slug)
}
