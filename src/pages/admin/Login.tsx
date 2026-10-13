import { motion } from 'motion/react'
import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { site } from '../../config'
import { useAuth } from '../../hooks/useAuth'
import { DEMO_ADMIN } from '../../lib/api'
import { isDemoMode } from '../../lib/supabase'

export default function Login() {
  const { admin, ready, signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const from = (location.state as { from?: string } | null)?.from ?? '/admin'

  if (ready && admin) return <Navigate to={from} replace />

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink lg:block">
        <motion.img
          src="/images/brand/season.webp"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60 grayscale"
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-x-12 bottom-12 text-paper">
          <p className="font-display text-7xl font-medium tracking-tight">{site.brand}</p>
          <p className="eyebrow mt-3 text-paper/70">Панель управления каталогом</p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-16 sm:px-16">
        <motion.form
          onSubmit={submit}
          className="mx-auto w-full max-w-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link to="/" className="eyebrow text-muted hover:text-ink">
            ← На сайт
          </Link>
          <h1 className="mt-8 font-display text-4xl font-medium">Вход для администратора</h1>
          <p className="mt-2 text-sm text-muted">Добавляйте и редактируйте товары каталога.</p>

          <div className="mt-10 space-y-5">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label className="label" htmlFor="password">
                Пароль
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
              />
            </div>
          </div>

          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-sm text-sale">
              {error}
            </motion.p>
          )}

          <button type="submit" disabled={busy} className="btn-dark mt-8 h-12 w-full disabled:opacity-50">
            {busy ? 'Входим…' : 'Войти'}
          </button>

          {isDemoMode && (
            <div className="mt-8 border border-dashed border-mist p-4 text-xs leading-relaxed text-muted">
              <b className="text-ink">Демо-режим.</b> База ещё не подключена. Вход: <code>{DEMO_ADMIN.email}</code> /{' '}
              <code>{DEMO_ADMIN.password}</code>
              <button
                type="button"
                onClick={() => {
                  setEmail(DEMO_ADMIN.email)
                  setPassword(DEMO_ADMIN.password)
                }}
                className="ml-2 underline"
              >
                подставить
              </button>
            </div>
          )}
        </motion.form>
      </div>
    </div>
  )
}
