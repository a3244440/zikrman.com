import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { categories, site } from '../config'
import { InstagramIcon, WhatsappIcon } from './Icons'

export function Footer() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const y = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])

  return (
    <footer ref={ref} className="overflow-hidden bg-ink text-paper">
      <div className="container-x grid gap-12 pt-20 pb-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="max-w-sm font-display text-3xl leading-tight font-light md:text-4xl">{site.tagline}</p>
          <div className="mt-8 flex gap-3">
            <a
              href={site.contacts.instagram}
              target="_blank"
              rel="noreferrer"
              className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 transition-colors hover:bg-paper hover:text-ink"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            {site.contacts.whatsapp && (
              <a
                href={`https://wa.me/${site.contacts.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="grid h-11 w-11 place-items-center rounded-full border border-paper/30 transition-colors hover:bg-paper hover:text-ink"
                aria-label="WhatsApp"
              >
                <WhatsappIcon size={18} />
              </a>
            )}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-5 text-paper/50">Каталог</p>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/catalog/${c.slug}`} className="text-paper/80 transition-colors hover:text-paper">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow mb-5 text-paper/50">Покупателям</p>
          <ul className="space-y-2.5 text-sm text-paper/80">
            <li>
              <Link to="/catalog?filter=new" className="hover:text-paper">
                Новинки
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-paper">
                Избранное
              </Link>
            </li>
            <li>
              <a href={`mailto:${site.contacts.email}`} className="hover:text-paper">
                {site.contacts.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-x">
        <motion.div
          style={{ y }}
          className="font-display text-[21vw] leading-[0.8] font-medium tracking-tight select-none lg:text-[19.5vw] 2xl:text-[280px]"
          aria-hidden
        >
          {site.brand}
        </motion.div>
      </div>

      <div className="container-x flex flex-col justify-between gap-2 border-t border-paper/15 py-6 text-[11px] tracking-[0.12em] text-paper/50 uppercase sm:flex-row">
        <span>
          © {new Date().getFullYear()} {site.brand}. Все права защищены
        </span>
        <Link to="/admin" className="hover:text-paper">
          Вход для администратора
        </Link>
      </div>
    </footer>
  )
}
