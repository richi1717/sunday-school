import { CircularProgress, Stack } from '@mui/material'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { Outlet } from 'react-router-dom'
import Header from '../Header'
import { useAuth } from '../../context/AuthContext'

export default function Layout() {
  const { isAdmin, loading: authLoading } = useAuth()
  const { isLoading } = useLessonsQuery()

  if (isLoading || authLoading)
    return (
      <Stack alignItems="center" width={1} height={1} justifyContent="center">
        <CircularProgress />
      </Stack>
    )

  return (
    <Stack height={1} alignItems="center">
      <Header isAdmin={isAdmin} />
      <Outlet />
    </Stack>
  )
}
