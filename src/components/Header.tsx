import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { categories, site } from '../config'
import { useWishlist } from '../hooks/useWishlist'
import { Logo } from './Logo'
import { CloseIcon, HeartIcon, InstagramIcon, MenuIcon, SearchIcon, UserIcon } from './Icons'

const ease = [0.76, 0, 0.24, 1] as const

const mainNav = [
  { to: '/catalog', label: 'Каталог' },
  { to: '/catalog?filter=new', label: 'Новинки' },
  { to: '/catalog/sport', label: 'Sport' },
  { to: '/catalog/casual', label: 'Casual' },
  { to: '/catalog/tshirts', label: 'Футболки' },
]

export function TopBar() {
  return (
    <div className="bg-ink text-paper">
      <div className="container-x flex h-9 items-center justify-between text-[10px] font-medium tracking-[0.18em] uppercase">
        <span className="truncate">{site.topBarNote}</span>
        <div className="hidden items-center gap-3 sm:flex">
          <a href={site.contacts.instagram} target="_blank" rel="noreferrer" className="hover:opacity-70">
            Instagram
          </a>
          <span className="opacity-40">|</span>
          <Link to="/catalog" className="hover:opacity-70">
            Каталог
          </Link>
          <span className="opacity-40">|</span>
          <a href={`mailto:${site.contacts.email}`} className="hover:opacity-70">
            Помощь
          </a>
        </div>
      </div>
    </div>
  )
}

export function Header() {
  const wishlist = useWishlist()
  const { scrollY } = useScroll()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden(y > prev && y > 240)
    setScrolled(y > 40)
  })

  useEffect(() => {
    setMenuOpen(false)
    setSearchOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 transition-colors duration-500 ${
          scrolled || menuOpen ? 'bg-paper/85 backdrop-blur-md' : 'bg-transparent'
        }`}
        animate={{ y: hidden && !menuOpen ? '-100%' : '0%' }}
        transition={{ duration: 0.45, ease }}
      >
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-20">
          <nav className="flex items-center gap-6">
            <button
              className="-ml-2 p-2 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
            {mainNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="group relative hidden text-[11px] font-medium tracking-[0.16em] uppercase lg:block"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </NavLink>
            ))}
          </nav>

          <Link to="/" aria-label="На главную">
            <Logo className="h-6 w-auto md:h-7" />
          </Link>

          <div className="flex items-center justify-end gap-1 sm:gap-4">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 p-2 text-[11px] font-medium tracking-[0.16em] uppercase"
              aria-label="Поиск"
            >
              <SearchIcon size={19} />
              <span className="hidden xl:inline">Поиск</span>
            </button>
            <Link
              to="/wishlist"
              className="relative flex items-center gap-2 p-2 text-[11px] font-medium tracking-[0.16em] uppercase"
              aria-label="Избранное"
            >
              <HeartIcon size={19} />
              <span className="hidden xl:inline">Избранное</span>
              <AnimatePresence>
                {wishlist.length > 0 && (
                  <motion.span
                    key={wishlist.length}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0.5 left-6 grid h-4 min-w-4 place-items-center rounded-full bg-ink px-1 text-[9px] text-paper"
                  >
                    {wishlist.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <Link to="/admin" className="hidden p-2 sm:block" aria-label="Вход для администратора">
              <UserIcon size={19} />
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>{menuOpen && <MobileMenu />}</AnimatePresence>
      <AnimatePresence>{searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}</AnimatePresence>
    </>
  )
}

function MobileMenu() {
  const links = [
    { to: '/catalog', label: 'Весь каталог' },
    { to: '/catalog?filter=new', label: 'Новинки' },
    ...categories.map((c) => ({ to: `/catalog/${c.slug}`, label: c.title })),
    { to: '/wishlist', label: 'Избранное' },
  ]
  return (
    <motion.div
      className="fixed inset-0 z-40 flex flex-col bg-paper pt-28 lg:hidden"
      initial={{ clipPath: 'inset(0 0 100% 0)' }}
      animate={{ clipPath: 'inset(0 0 0% 0)' }}
      exit={{ clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.7, ease }}
    >
      <nav className="container-x flex flex-1 flex-col gap-1 overflow-y-auto">
        {links.map((l, i) => (
          <div key={l.to} className="overflow-hidden">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 + i * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={l.to} className="block py-2 font-display text-3xl font-medium uppercase">
                {l.label}
              </Link>
            </motion.div>
          </div>
        ))}
      </nav>
      <div className="container-x flex items-center justify-between border-t border-mist py-6">
        <a href={site.contacts.instagram} target="_blank" rel="noreferrer" className="flex items-center gap-2 eyebrow">
          <InstagramIcon size={18} /> Instagram
        </a>
        <Link to="/admin" className="eyebrow text-muted">
          Админ
        </Link>
      </div>
    </motion.div>
  )
}

function SearchOverlay({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const [q, setQ] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/catalog?q=${encodeURIComponent(q.trim())}`)
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="bg-paper"
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ duration: 0.6, ease }}
      >
        <div className="container-x flex items-center gap-4 py-8 md:py-12">
          <SearchIcon size={28} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Что ищем? Например, худи"
            className="min-w-0 flex-1 bg-transparent font-display text-2xl outline-none placeholder:text-neutral-400 md:text-4xl"
          />
          <button type="button" onClick={onClose} aria-label="Закрыть поиск" className="p-2">
            <CloseIcon size={24} />
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}
