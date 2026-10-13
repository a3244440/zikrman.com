import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft } from '../../components/Icons'
import { changePassword } from '../../lib/api'
import { isDemoMode } from '../../lib/supabase'

export default function ChangePassword() {
  const [password, setPassword] = useState('')
  const [repeat, setRepeat] = useState('')
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== repeat) return setStatus({ ok: false, text: 'Пароли не совпадают' })
    setBusy(true)
    setStatus(null)
    try {
      await changePassword(password)
      setPassword('')
      setRepeat('')
      setStatus({ ok: true, text: 'Пароль изменён. В следующий раз входите с новым паролем.' })
    } catch (err) {
      setStatus({ ok: false, text: (err as Error).message })
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="mx-auto max-w-md">
      <Link to="/admin" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
        <ArrowLeft size={16} /> Все товары
      </Link>
      <h1 className="mt-4 font-display text-4xl font-medium">Смена пароля</h1>
      <p className="mt-2 text-sm text-muted">
        Чем длиннее пароль, тем сложнее его подобрать. Короткий пароль вроде «007» легко угадать.
      </p>

      <div className="mt-8 space-y-5 bg-paper p-6">
        <div>
          <label className="label" htmlFor="new-password">
            Новый пароль
          </label>
          <input
            id="new-password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor="repeat-password">
            Повторите пароль
          </label>
          <input
            id="repeat-password"
            type="password"
            autoComplete="new-password"
            required
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
            className="input"
          />
        </div>
        {status && <p className={`text-sm ${status.ok ? 'text-green-700' : 'text-sale'}`}>{status.text}</p>}
        <button type="submit" disabled={busy || isDemoMode} className="btn-dark h-12 w-full disabled:opacity-50">
          {busy ? 'Сохраняем…' : 'Сменить пароль'}
        </button>
        {isDemoMode && <p className="text-xs text-muted">В демо-режиме пароль не меняется.</p>}
      </div>
    </form>
  )
}
