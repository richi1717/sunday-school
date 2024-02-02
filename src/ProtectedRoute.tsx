import { Outlet, useNavigate } from 'react-router-dom'
import { getCookie } from './utils/helpers'
import { useEffect } from 'react'

const ProtectedRoute = () => {
  const navigate = useNavigate()
  const isAuthenticated = getCookie() !== 'false'

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  return <Outlet />
}

export default ProtectedRoute
