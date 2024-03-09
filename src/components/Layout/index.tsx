import { useEffect, useState } from 'react'
import { CircularProgress, Stack } from '@mui/joy'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { Outlet } from 'react-router-dom'
import Header from '../Header'
import { getCookie } from '../../utils/helpers'

export default function Layout() {
  const [isAdmin, setIsAdmin] = useState(false)
  const { isLoading } = useLessonsQuery()

  useEffect(() => {
    const cookie = getCookie()

    setIsAdmin(!!cookie && cookie !== 'false')
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
