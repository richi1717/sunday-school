import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useEffect } from 'react'

const ProtectedRoute = () => {
  const { isAdmin, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate('/')
    }
  }, [isAdmin, loading, navigate])

  if (loading) return null

  return <Outlet />
}

export default ProtectedRoute
