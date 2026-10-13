import { AnimatePresence, motion } from 'motion/react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { EditIcon, PlusIcon, SearchIcon, TrashIcon } from '../../components/Icons'
import { categories, categoryBySlug } from '../../config'
import { refreshProducts, useProducts } from '../../hooks/useProducts'
import { deleteProduct, resetDemo } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import { isDemoMode } from '../../lib/supabase'
import type { Product } from '../../lib/types'

export default function Dashboard() {
  const { products, loading, error } = useProducts()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const list = useMemo(() => {
    let items = products ?? []
    if (cat) items = items.filter((p) => p.category === cat)
    if (q.trim()) items = items.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase()))
    return items
  }, [products, q, cat])

  const stats = [
    { label: 'Всего товаров', value: products?.length ?? 0 },
    { label: 'Новинки', value: products?.filter((p) => p.is_new).length ?? 0 },
    { label: 'На главной', value: products?.filter((p) => p.is_featured).length ?? 0 },
    { label: 'Нет в наличии', value: products?.filter((p) => !p.in_stock).length ?? 0 },
  ]

  const remove = async (p: Product) => {
    if (!confirm(`Удалить «${p.name}»? Это действие нельзя отменить.`)) return
    setDeleting(p.id)
    try {
      await deleteProduct(p.id)
      await refreshProducts()
    } catch (e) {
      alert((e as Error).message)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-medium">Каталог</h1>
          <p className="mt-1 text-sm text-muted">Управляйте товарами, которые видят покупатели.</p>
        </div>
        <Link to="/admin/products/new" className="btn-dark">
          <PlusIcon size={16} /> Добавить товар
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-paper p-5">
            <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">{s.label}</p>
            <p className="mt-2 font-display text-3xl font-medium">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1">
          <SearchIcon size={16} className="absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск по названию" className="input pl-10" />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="input w-auto">
          <option value="">Все категории</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="mt-6 text-sm text-sale">{error}</p>}

      <div className="mt-4 overflow-hidden bg-paper">
        {loading ? (
          <p className="p-8 text-center text-sm text-muted">Загрузка…</p>
        ) : list.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted">Товаров не найдено.</p>
            <Link to="/admin/products/new" className="btn-outline mt-6">
              Добавить первый товар
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-mist">
            <AnimatePresence initial={false}>
              {list.map((p) => (
                <motion.li
                  key={p.id}
                  layout
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-4 p-3 sm:p-4"
                >
                  <div className="h-20 w-16 shrink-0 overflow-hidden bg-stone">
                    {p.images[0] && <img src={p.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link to={`/admin/products/${p.id}`} className="block truncate font-medium hover:underline">
                      {p.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-muted">{categoryBySlug(p.category)?.title ?? p.category}</p>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {p.is_new && <Tag>Новинка</Tag>}
                      {p.is_featured && <Tag>На главной</Tag>}
                      {!p.in_stock && <Tag muted>Нет в наличии</Tag>}
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="font-semibold">{formatPrice(p.price)}</p>
                    {p.old_price ? <p className="text-xs text-muted line-through">{formatPrice(p.old_price)}</p> : null}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Link
                      to={`/product/${p.slug}`}
                      target="_blank"
                      className="hidden p-2 text-xs text-muted hover:text-ink md:block"
                      title="Открыть на сайте"
                    >
                      ↗
                    </Link>
                    <Link to={`/admin/products/${p.id}`} className="p-2 hover:bg-stone" title="Редактировать">
                      <EditIcon size={18} />
                    </Link>
                    <button
                      onClick={() => remove(p)}
                      disabled={deleting === p.id}
                      className="p-2 text-sale hover:bg-red-50 disabled:opacity-40"
                      title="Удалить"
                    >
                      <TrashIcon size={18} />
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {isDemoMode && (
        <button
          onClick={async () => {
            if (!confirm('Вернуть демо-каталог к исходному состоянию?')) return
            resetDemo()
            await refreshProducts()
          }}
          className="mt-6 text-xs text-muted underline hover:text-ink"
        >
          Сбросить демо-данные
        </button>
      )}
    </div>
  )
}

function Tag({ children, muted }: { children: string; muted?: boolean }) {
  return (
    <span
      className={`px-1.5 py-0.5 text-[9px] font-semibold tracking-[0.14em] uppercase ${
        muted ? 'bg-stone text-muted' : 'bg-ink text-paper'
      }`}
    >
      {children}
    </span>
  )
}
