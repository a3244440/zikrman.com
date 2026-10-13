import { Link, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { site } from '../../config'
import { useAuth } from '../../hooks/useAuth'
import { isDemoMode } from '../../lib/supabase'

export function RequireAdmin() {
  const { admin, ready } = useAuth()
  const location = useLocation()
  if (!ready) return <div className="grid min-h-screen place-items-center text-sm text-muted">Проверяем доступ…</div>
  if (!admin) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  return <AdminShell />
}

function AdminShell() {
  const { admin, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-stone">
      <header className="sticky top-0 z-40 border-b border-mist bg-paper">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="font-display text-xl font-medium tracking-[0.08em]">
              {site.brand}
            </Link>
            <span className="bg-ink px-2 py-0.5 text-[9px] font-semibold tracking-[0.2em] text-paper uppercase">
              Админ
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" target="_blank" className="hidden text-muted hover:text-ink sm:inline">
              Открыть сайт ↗
            </Link>
            <span className="hidden text-muted md:inline">{admin?.email}</span>
            <button
              onClick={async () => {
                await signOut()
                navigate('/admin/login')
              }}
              className="border border-mist px-3 py-1.5 text-xs font-semibold tracking-[0.12em] uppercase hover:border-ink"
            >
              Выйти
            </button>
          </div>
        </div>
      </header>
      {isDemoMode && (
        <div className="bg-amber-100 text-amber-900">
          <div className="container-x py-2.5 text-xs leading-relaxed">
            <b>Демо-режим:</b> Supabase не подключён, изменения сохраняются только в этом браузере. Чтобы товары
            видели все посетители, подключите базу — инструкция в README.
          </div>
        </div>
      )}
      <main className="container-x py-8 md:py-12">
        <Outlet />
      </main>
    </div>
  )
}
