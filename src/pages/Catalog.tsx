import { AnimatePresence, LayoutGroup, motion } from 'motion/react'
import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CloseIcon } from '../components/Icons'
import { ProductCard, ProductGridSkeleton } from '../components/ProductCard'
import { MaskText } from '../components/Reveal'
import { categories, categoryBySlug } from '../config'
import { useProducts } from '../hooks/useProducts'

type Sort = 'default' | 'new' | 'price-asc' | 'price-desc'

const sortLabels: Record<Sort, string> = {
  default: 'По умолчанию',
  new: 'Сначала новые',
  'price-asc': 'Цена по возрастанию',
  'price-desc': 'Цена по убыванию',
}

export default function Catalog() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const { products, loading, error } = useProducts()
  const current = categoryBySlug(category)
  const q = params.get('q')?.trim() ?? ''
  const onlyNew = params.get('filter') === 'new'
  const onlySale = params.get('filter') === 'sale'
  const sort = (params.get('sort') as Sort) || 'default'

  const list = useMemo(() => {
    let items = products ?? []
    if (current) items = items.filter((p) => p.category === current.slug)
    if (onlyNew) items = items.filter((p) => p.is_new)
    if (onlySale) items = items.filter((p) => p.old_price && p.old_price > p.price)
    if (q) {
      const needle = q.toLowerCase()
      items = items.filter((p) => `${p.name} ${p.description}`.toLowerCase().includes(needle))
    }
    const sorted = [...items]
    if (sort === 'new') sorted.sort((a, b) => b.created_at.localeCompare(a.created_at))
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    return sorted
  }, [products, current, onlyNew, onlySale, q, sort])

  const title = current?.title ?? (onlyNew ? 'Новинки' : onlySale ? 'Скидки' : 'Каталог')
  const qs = params.toString()
  const keep = qs ? `?${qs}` : ''

  const setParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const tabs = [{ slug: '', title: 'Все' }, ...categories.map((c) => ({ slug: c.slug, title: c.short }))]

  return (
    <div className="container-x pt-10 pb-24 md:pt-16">
      <nav className="eyebrow mb-6 text-muted">
        <Link to="/" className="hover:text-ink">
          Главная
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{title}</span>
      </nav>

      <div className="flex flex-wrap items-end justify-between gap-6">
        <MaskText
          key={title}
          as="h1"
          text={title}
          className="font-display text-5xl leading-none font-medium uppercase md:text-8xl"
        />
        <p className="text-sm text-muted">
          {loading ? 'Загрузка…' : `${list.length} ${plural(list.length, ['товар', 'товара', 'товаров'])}`}
        </p>
      </div>

      <div className="mt-10 border-y border-mist">
        <div className="flex items-center justify-between gap-4">
          <LayoutGroup>
            <div className="flex gap-6 overflow-x-auto [scrollbar-width:none]">
              {tabs.map((t) => {
                const active = (current?.slug ?? '') === t.slug
                return (
                  <Link
                    key={t.slug}
                    to={`/catalog${t.slug ? `/${t.slug}` : ''}${keep}`}
                    className={`relative shrink-0 py-4 text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors ${
                      active ? 'text-ink' : 'text-muted hover:text-ink'
                    }`}
                  >
                    {t.title}
                    {active && (
                      <motion.span layoutId="cat-underline" className="absolute inset-x-0 bottom-0 h-0.5 bg-ink" />
                    )}
                  </Link>
                )
              })}
            </div>
          </LayoutGroup>
          <div className="flex shrink-0 items-center gap-3">
            <button
              onClick={() => setParam('filter', onlyNew ? null : 'new')}
              className={`hidden border px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors sm:block ${
                onlyNew ? 'border-ink bg-ink text-paper' : 'border-mist hover:border-ink'
              }`}
            >
              Новинки
            </button>
            <button
              onClick={() => setParam('filter', onlySale ? null : 'sale')}
              className={`hidden border px-3 py-1.5 text-[10px] font-semibold tracking-[0.16em] uppercase transition-colors sm:block ${
                onlySale ? 'border-ink bg-ink text-paper' : 'border-mist hover:border-ink'
              }`}
            >
              Скидки
            </button>
            <select
              value={sort}
              onChange={(e) => setParam('sort', e.target.value === 'default' ? null : e.target.value)}
              className="cursor-pointer bg-transparent py-4 text-[11px] font-semibold tracking-[0.12em] uppercase outline-none"
              aria-label="Сортировка"
            >
              {(Object.keys(sortLabels) as Sort[]).map((s) => (
                <option key={s} value={s}>
                  {sortLabels[s]}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {q && (
        <div className="mt-6 flex items-center gap-3 text-sm">
          <span className="text-muted">Поиск:</span>
          <button
            onClick={() => setParam('q', null)}
            className="inline-flex items-center gap-2 bg-stone px-3 py-1.5 font-medium"
          >
            «{q}» <CloseIcon size={14} />
          </button>
        </div>
      )}

      <div className="mt-10">
        {error && <p className="py-20 text-center text-sale">Не удалось загрузить каталог: {error}</p>}
        {loading ? (
          <ProductGridSkeleton />
        ) : list.length === 0 ? (
          <div className="py-24 text-center">
            <p className="font-display text-3xl">Ничего не найдено</p>
            <p className="mt-3 text-muted">Попробуйте другой фильтр или посмотрите весь каталог.</p>
            <Link to="/catalog" className="btn-dark mt-8">
              Весь каталог
            </Link>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {list.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function plural(n: number, forms: [string, string, string]) {
  const mod10 = n % 10
  const mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return forms[0]
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return forms[1]
  return forms[2]
}
