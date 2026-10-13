// Основные настройки магазина. Меняйте здесь — всё остальное подтянется само.

export const site = {
  brand: 'ZIKRMAN',
  tagline: 'Одежда, которая движется вместе с тобой.',
  collection: 'Новая коллекция 2026',
  currency: 'сом',
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

export interface Category {
  slug: string
  title: string
  short: string
  description: string
  image: string
}

export const categories: Category[] = [
  {
    slug: 'outerwear',
    title: 'Верхняя одежда',
    short: 'Куртки',
    description: 'Куртки, бомберы и парки на каждый день.',
    image: '/images/demo/leather-jacket-look.jpg',
  },
  {
    slug: 'hoodies',
    title: 'Худи и свитшоты',
    short: 'Худи',
    description: 'Плотный хлопок и свободный крой.',
    image: '/images/demo/sweatshirt-look.jpg',
  },
  {
    slug: 'tshirts',
    title: 'Футболки',
    short: 'Футболки',
    description: 'База, которая сочетается со всем.',
    image: '/images/demo/tee-man.jpg',
  },
  {
    slug: 'pants',
    title: 'Брюки и джинсы',
    short: 'Брюки',
    description: 'Прямой и свободный силуэт.',
    image: '/images/demo/jeans-2.jpg',
  },
  {
    slug: 'shirts',
    title: 'Рубашки и костюмы',
    short: 'Костюмы',
    description: 'Для встреч, событий и офиса.',
    image: '/images/demo/suit.jpg',
  },
]

export const sizePresets = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '44', '46', '48', '50', '52', '54', 'ONE SIZE']

export function categoryBySlug(slug: string | undefined) {
  return categories.find((c) => c.slug === slug)
}
