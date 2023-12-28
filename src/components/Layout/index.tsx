import { useEffect, useState } from 'react'
import { CircularProgress, Stack } from '@mui/material'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

export default function Layout() {
  const [isAdmin, setIsAdmin] = useState(false)
  const { isLoading } = useLessonsQuery()

  useEffect(() => {
    const getCookie = () => {
      const cookieArr = document.cookie.split(';')
      const found = cookieArr.find((cookie) => cookie.includes('loggedIn'))

      return found?.split('=')[1]
    }

    const cookie = getCookie()

    setIsAdmin(cookie === 'true')
  }, [isAdmin])

  if (isLoading)
    return (
      <Stack alignItems="center" width={1} height={1} justifyContent="center">
        <CircularProgress />
      </Stack>
    )

  return (
    <Stack height={1}>
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <Outlet />
    </Stack>
  )
}
