import { useEffect, useState } from 'react'
import { Stack } from '@mui/material'
import Header from '../components/Header'
import Lessons from './Lessons'
import { useLessonsQuery } from '../api/lessons/getLessons'

export default function Home() {
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

  if (isLoading) return <div>loading</div>

  return (
    <Stack>
      <Header isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
      <Lessons isAdmin={isAdmin} />
    </Stack>
  )
}
