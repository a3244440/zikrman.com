import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { getAdmin, signIn as apiSignIn, signOut as apiSignOut, type AdminUser } from '../lib/api'
import { supabase } from '../lib/supabase'

interface AuthState {
  admin: AdminUser | null
  ready: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let alive = true
    getAdmin().then((a) => {
      if (!alive) return
      setAdmin(a)
      setReady(true)
    })
    const sub = supabase?.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') setAdmin(null)
    })
    return () => {
      alive = false
      sub?.data.subscription.unsubscribe()
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setAdmin(await apiSignIn(email, password))
  }, [])

  const signOut = useCallback(async () => {
    await apiSignOut()
    setAdmin(null)
  }, [])

  const value = useMemo(() => ({ admin, ready, signIn, signOut }), [admin, ready, signIn, signOut])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
