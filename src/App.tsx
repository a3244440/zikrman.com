import { MotionConfig } from 'motion/react'
import { useLayoutEffect } from 'react'
import { Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header, TopBar } from './components/Header'
import { Preloader, skipIntro } from './components/Preloader'
import Catalog from './pages/Catalog'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import Product from './pages/Product'
import Wishlist from './pages/Wishlist'
import { RequireAdmin } from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ChangePassword from './pages/admin/ChangePassword'
import Login from './pages/admin/Login'
import ProductForm from './pages/admin/ProductForm'

// Заставка показывается, только если посетитель зашёл сразу на главную.
if (window.location.pathname !== '/') skipIntro()

function ScrollToTop() {
  const { pathname } = useLocation()
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])
  return null
}

function SiteLayout() {
  return (
    <>
      <Preloader />
      <TopBar />
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ScrollToTop />
      <Routes>
        <Route element={<SiteLayout />}>
          <Route index element={<Home />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="catalog/:category" element={<Catalog />} />
          <Route path="product/:slug" element={<Product />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="admin/login" element={<Login />} />
        <Route path="admin" element={<RequireAdmin />}>
          <Route index element={<Dashboard />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id" element={<ProductForm />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>
      </Routes>
    </MotionConfig>
  )
}
