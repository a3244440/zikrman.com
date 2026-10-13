import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { toggleWishlist, useWishlist } from '../hooks/useWishlist'
import { discountPercent, formatPrice } from '../lib/format'
import type { Product } from '../lib/types'
import { HeartIcon } from './Icons'

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const wishlist = useWishlist()
  const liked = wishlist.includes(product.slug)
  const discount = discountPercent(product.price, product.old_price)
  const [first, second] = product.images

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5% 0px' }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-stone">
          {first ? (
            <img
              src={first}
              alt={product.name}
              loading="lazy"
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out-expo group-hover:scale-105 ${
                second ? 'group-hover:opacity-0' : ''
              }`}
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center font-display text-4xl text-mist">Z</div>
          )}
          {second && (
            <img
              src={second}
              alt=""
              loading="lazy"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-[1200ms] ease-out-expo group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {product.is_new && (
              <span className="bg-paper px-2 py-1 text-[9px] font-semibold tracking-[0.18em] uppercase">Новинка</span>
            )}
            {discount > 0 && (
              <span className="bg-ink px-2 py-1 text-[9px] font-semibold tracking-[0.18em] text-paper uppercase">
                −{discount}%
              </span>
            )}
            {!product.in_stock && (
              <span className="bg-paper/80 px-2 py-1 text-[9px] font-semibold tracking-[0.18em] text-muted uppercase">
                Нет в наличии
              </span>
            )}
          </div>
          <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="block bg-paper/90 py-2.5 text-center text-[10px] font-semibold tracking-[0.2em] uppercase backdrop-blur">
              Смотреть
            </span>
          </div>
        </div>
      </Link>

      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => toggleWishlist(product.slug)}
        className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-paper/90 backdrop-blur transition-colors hover:bg-white"
        aria-label={liked ? 'Убрать из избранного' : 'В избранное'}
        aria-pressed={liked}
      >
        <HeartIcon size={16} filled={liked} />
      </motion.button>

      <Link to={`/product/${product.slug}`} className="mt-3 block">
        <h3 className="truncate text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm">
          <span className="font-semibold">{formatPrice(product.price)}</span>
          {discount > 0 && <span className="text-xs text-muted line-through">{formatPrice(product.old_price!)}</span>}
        </div>
      </Link>
      {product.colors.length > 1 && (
        <div className="mt-2 flex gap-1.5">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ background: c.hex }}
            />
          ))}
        </div>
      )}
    </motion.article>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[4/5] bg-stone" />
          <div className="mt-3 h-3 w-2/3 bg-stone" />
          <div className="mt-2 h-3 w-1/3 bg-stone" />
        </div>
      ))}
    </div>
  )
}
