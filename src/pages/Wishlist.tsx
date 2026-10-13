import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { HeartIcon } from '../components/Icons'
import { ProductCard, ProductGridSkeleton } from '../components/ProductCard'
import { MaskText } from '../components/Reveal'
import { useProducts } from '../hooks/useProducts'
import { useWishlist } from '../hooks/useWishlist'

export default function Wishlist() {
  const slugs = useWishlist()
  const { products, loading } = useProducts()
  const items = (products ?? []).filter((p) => slugs.includes(p.slug))

  return (
    <div className="container-x min-h-[60vh] pt-10 pb-24 md:pt-16">
      <MaskText as="h1" text="Избранное" className="font-display text-5xl leading-none font-medium uppercase md:text-8xl" />
      <div className="mt-12">
        {loading ? (
          <ProductGridSkeleton count={4} />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center py-20 text-center">
            <HeartIcon size={40} strokeWidth={1} />
            <p className="mt-6 font-display text-2xl">Здесь пока пусто</p>
            <p className="mt-2 text-muted">Нажмите на сердечко у товара, чтобы сохранить его.</p>
            <Link to="/catalog" className="btn-dark mt-8">
              В каталог
            </Link>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 lg:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {items.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  )
}
