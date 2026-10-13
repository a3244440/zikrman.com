import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, BagIcon, HeartIcon, LockIcon, ReturnIcon, TruckIcon, ZoomIcon } from '../components/Icons'
import { ProductCard } from '../components/ProductCard'
import { MaskText } from '../components/Reveal'
import { categoryBySlug, site } from '../config'
import { useProducts } from '../hooks/useProducts'
import { toggleWishlist, useWishlist } from '../hooks/useWishlist'
import { discountPercent, formatPrice, orderLink } from '../lib/format'
import type { Product as ProductT } from '../lib/types'
import NotFound from './NotFound'

const ease = [0.16, 1, 0.3, 1] as const

export default function Product() {
  const { slug } = useParams()
  const { products, loading } = useProducts()
  const product = products?.find((p) => p.slug === slug)

  useEffect(() => {
    if (product) document.title = `${product.name} — ${site.brand}`
    return () => {
      document.title = `${site.brand} — каталог одежды`
    }
  }, [product])

  if (loading) return <div className="container-x min-h-[70vh] py-20" />
  if (!product) return <NotFound />

  const related = (products ?? []).filter((p) => p.category === product.category && p.id !== product.id)
  const more = related.length >= 4 ? related : [...related, ...(products ?? []).filter((p) => p.category !== product.category)]

  return (
    <div key={product.id}>
      <ProductMain product={product} />
      <ProductTabs product={product} />
      {more.length > 0 && (
        <section className="container-x py-20">
          <div className="mb-10 flex items-end justify-between">
            <MaskText as="h2" text="Вам может понравиться" className="font-display text-2xl font-medium uppercase md:text-4xl" />
            <Link to={`/catalog/${product.category}`} className="link-underline shrink-0">
              Смотреть все <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {more.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ProductMain({ product }: { product: ProductT }) {
  const [active, setActive] = useState(0)
  const [color, setColor] = useState(product.colors[0]?.name ?? '')
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '')
  const [sizeError, setSizeError] = useState(false)
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null)
  const wishlist = useWishlist()
  const liked = wishlist.includes(product.slug)
  const discount = discountPercent(product.price, product.old_price)
  const category = categoryBySlug(product.category)
  const images = product.images.length ? product.images : ['']

  const onZoomMove = (e: MouseEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 })
  }

  const message = [
    `Здравствуйте! Хочу заказать: ${product.name}`,
    color && `Цвет: ${color}`,
    size && `Размер: ${size}`,
    `Цена: ${formatPrice(product.price)}`,
    window.location.href,
  ]
    .filter(Boolean)
    .join('\n')

  const onOrder = (e: MouseEvent<HTMLAnchorElement>) => {
    if (product.sizes.length > 0 && !size) {
      e.preventDefault()
      setSizeError(true)
    }
  }

  return (
    <section className="container-x pt-6 pb-16 md:pt-10">
      <nav className="eyebrow mb-6 text-muted">
        <Link to="/" className="hover:text-ink">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <Link to="/catalog" className="hover:text-ink">
          Каталог
        </Link>
        {category && (
          <>
            <span className="mx-2">/</span>
            <Link to={`/catalog/${category.slug}`} className="hover:text-ink">
              {category.title}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        {/* Галерея */}
        <div className={`relative flex min-w-0 flex-col-reverse gap-3 ${images.length > 1 ? 'md:pl-27' : ''}`}>
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto [scrollbar-width:none] md:absolute md:inset-y-0 md:left-0 md:w-24 md:flex-col md:overflow-x-visible md:overflow-y-auto">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative aspect-[4/5] w-20 shrink-0 overflow-hidden bg-stone transition-opacity md:w-full ${
                    active === i ? '' : 'opacity-50 hover:opacity-100'
                  }`}
                  aria-label={`Фото ${i + 1}`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  {active === i && (
                    <motion.span layoutId="thumb-frame" className="absolute inset-0 border-2 border-ink" />
                  )}
                </button>
              ))}
            </div>
          )}
          <div
            className="relative aspect-[4/5] w-full cursor-zoom-in overflow-hidden bg-stone"
            onMouseMove={onZoomMove}
            onMouseLeave={() => setZoom(null)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={active}
                src={images[active]}
                alt={product.name}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: zoom ? 1.9 : 1 }}
                exit={{ opacity: 0 }}
                style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                transition={{ duration: zoom ? 0.4 : 0.9, ease }}
              />
            </AnimatePresence>
            <span className="absolute right-4 bottom-4 grid h-10 w-10 place-items-center rounded-full bg-paper/90">
              <ZoomIcon size={18} />
            </span>
          </div>
        </div>

        {/* Информация */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <div className="flex gap-2">
            {product.is_new && (
              <span className="bg-stone px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] uppercase">Новинка</span>
            )}
            {!product.in_stock && (
              <span className="bg-stone px-2.5 py-1 text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
                Нет в наличии
              </span>
            )}
          </div>
          <h1 className="mt-4 font-display text-4xl leading-tight font-medium md:text-5xl">{product.name}</h1>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-2xl font-semibold">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.old_price!)}</span>
                <span className="bg-ink px-2 py-1 text-[11px] font-semibold text-paper">−{discount}%</span>
              </>
            )}
          </div>

          <p className="mt-5 max-w-md leading-relaxed text-ink/75">{product.description}</p>

          <div className="mt-8 border-t border-mist pt-8">
            {product.colors.length > 0 && (
              <div>
                <p className="text-sm">
                  <span className="font-semibold">Цвет:</span> <span className="text-muted">{color}</span>
                </p>
                <div className="mt-3 flex gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      title={c.name}
                      aria-label={c.name}
                      aria-pressed={color === c.name}
                      className={`grid h-10 w-10 place-items-center rounded-full border transition-colors ${
                        color === c.name ? 'border-ink' : 'border-transparent hover:border-mist'
                      }`}
                    >
                      <span className="h-8 w-8 rounded-full border border-black/10" style={{ background: c.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes.length > 0 && (
              <div className="mt-7">
                <p className="text-sm">
                  <span className="font-semibold">Размер:</span>{' '}
                  <span className={sizeError && !size ? 'text-sale' : 'text-muted'}>
                    {size || (sizeError ? 'выберите размер' : '—')}
                  </span>
                </p>
                <LayoutGroup id="sizes">
                  <motion.div
                    className="mt-3 flex flex-wrap gap-2"
                    animate={sizeError && !size ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSize(s)
                          setSizeError(false)
                        }}
                        className={`relative h-11 min-w-14 border px-3 text-sm font-medium transition-colors ${
                          size === s ? 'border-ink text-paper' : 'border-mist hover:border-ink'
                        }`}
                      >
                        {size === s && <motion.span layoutId="size-bg" className="absolute inset-0 bg-ink" />}
                        <span className="relative">{s}</span>
                      </button>
                    ))}
                  </motion.div>
                </LayoutGroup>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-3">
            <a
              href={orderLink(message)}
              target="_blank"
              rel="noreferrer"
              onClick={onOrder}
              className={`btn-dark h-14 flex-1 text-sm ${product.in_stock ? '' : 'pointer-events-none opacity-40'}`}
            >
              <BagIcon size={18} /> {product.in_stock ? 'Заказать' : 'Нет в наличии'}
            </a>
            <motion.button
              whileTap={{ scale: 0.85 }}
              onClick={() => toggleWishlist(product.slug)}
              className="grid h-14 w-14 place-items-center border border-mist transition-colors hover:border-ink"
              aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
              aria-pressed={liked}
            >
              <HeartIcon size={20} filled={liked} />
            </motion.button>
          </div>
          <p className="mt-3 text-xs text-muted">
            Заказ оформляется через {site.contacts.whatsapp ? 'WhatsApp' : 'Instagram'} — менеджер ответит и уточнит
            детали.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-mist pt-6">
            {[
              { icon: TruckIcon, t: 'Шоурум', d: 'Бишкек, Шабдан Баатыра, 97' },
              { icon: ReturnIcon, t: 'Ежедневно', d: 'С 09:00 до 20:00' },
              { icon: LockIcon, t: 'Заказ', d: 'Через WhatsApp' },
            ].map((f) => (
              <div key={f.t} className="flex items-start gap-2">
                <f.icon size={20} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-[11px] font-semibold">{f.t}</p>
                  <p className="text-[11px] text-muted">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ProductTabs({ product }: { product: ProductT }) {
  const tabs = [
    { id: 'details', label: 'Описание' },
    { id: 'fit', label: 'Размер и посадка' },
    { id: 'delivery', label: 'Как купить' },
  ]
  const [tab, setTab] = useState(tabs[0].id)
  const sideImage = product.images[1] ?? product.images[0]

  return (
    <section className="container-x grid gap-10 border-t border-mist py-16 lg:grid-cols-2 lg:gap-16">
      <div>
        <div className="flex gap-8 border-b border-mist">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative pb-3 text-sm transition-colors ${tab === t.id ? 'font-semibold' : 'text-muted hover:text-ink'}`}
            >
              {t.label}
              {tab === t.id && <motion.span layoutId="tab-line" className="absolute inset-x-0 -bottom-px h-0.5 bg-ink" />}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="pt-6 text-sm leading-relaxed text-ink/80"
          >
            {tab === 'details' && (
              <>
                <p className="max-w-lg">{product.description}</p>
                {product.details.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {product.details.map((d) => (
                      <li key={d} className="flex items-center gap-3">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink" />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {tab === 'fit' && (
              <div className="max-w-2xl space-y-4">
                <p>Доступные размеры: {product.sizes.length ? product.sizes.join(', ') : 'уточняйте у менеджера'}.</p>
                {product.size_chart?.trim() && <SizeChart text={product.size_chart} />}
                <p>
                  Не уверены в размере? Напишите нам свои параметры (рост, вес, обхват груди) — подскажем, какой подойдёт.
                </p>
              </div>
            )}
            {tab === 'delivery' && (
              <div className="max-w-lg space-y-3">
                <p>Вещь можно посмотреть и примерить в шоуруме: {site.topBarNote.replace('Шоурум в Бишкеке · ', '')}.</p>
                <p>Условия доставки, оплаты и обмена уточняйте у менеджера в WhatsApp — ответим и всё подскажем.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      {sideImage && (
        <motion.div
          className="aspect-[16/11] overflow-hidden bg-stone"
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          whileInView={{ clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <img src={sideImage} alt="" loading="lazy" className="h-full w-full object-cover" />
        </motion.div>
      )}
    </section>
  )
}

/** Таблица размеров: блоки через пустую строку, первая строка блока — заголовок. */
function SizeChart({ text }: { text: string }) {
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.split('\n').map((l) => l.trim()).filter(Boolean))
    .filter((b) => b.length > 0)
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {blocks.map(([title, ...rows], i) => (
        <div key={i} className="border border-mist p-4">
          <p className="mb-2 text-xs font-semibold tracking-[0.12em] uppercase">{title}</p>
          <dl className="space-y-1 text-xs">
            {rows.map((row, j) => {
              const m = row.match(/^(.+?)\s*[:–-]\s*(.+)$/)
              return m ? (
                <div key={j} className="flex justify-between gap-4 border-b border-dashed border-mist/80 pb-1">
                  <dt className="text-muted">{m[1]}</dt>
                  <dd className="shrink-0 font-medium">{m[2]}</dd>
                </div>
              ) : (
                <p key={j}>{row}</p>
              )
            })}
          </dl>
        </div>
      ))}
    </div>
  )
}
