import { site } from '../config'

const priceFormatter = new Intl.NumberFormat(site.locale, { maximumFractionDigits: 0 })

export function formatPrice(value: number) {
  const amount = priceFormatter.format(value)
  return site.currencyBefore ? `${site.currency}${amount}` : `${amount} ${site.currency}`
}

export function discountPercent(price: number, oldPrice: number | null) {
  if (!oldPrice || oldPrice <= price) return 0
  return Math.round((1 - price / oldPrice) * 100)
}

const translit: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'h', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
  ә: 'a', ғ: 'g', қ: 'k', ң: 'n', ө: 'o', ұ: 'u', ү: 'u', һ: 'h', і: 'i',
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .split('')
    .map((ch) => translit[ch] ?? ch)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export function orderLink(text: string) {
  const { whatsapp, instagram, telegram } = site.contacts
  if (whatsapp) return `https://wa.me/${whatsapp}?text=${encodeURIComponent(text)}`
  if (telegram) return telegram
  return instagram
}
