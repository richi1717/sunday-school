import { createContext, useContext, useEffect, useState } from 'react'
import { type User, onAuthStateChanged, signOut } from 'firebase/auth'
import { auth } from '../api/firebase'

const allowedEmails = (import.meta.env.VITE_ALLOWED_EMAILS as string)
  ?.split(',')
  .map((email) => email.trim().toLowerCase()) ?? []

interface AuthContextValue {
  user: User | null
  isAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  isAdmin: false,
  loading: true,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser && !allowedEmails.includes(firebaseUser.email?.toLowerCase() ?? '')) {
        signOut(auth)
        setUser(null)
      } else {
        setUser(firebaseUser)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider
      value={{ user, isAdmin: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
