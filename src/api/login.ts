import { initializeApp } from 'firebase/app'
import { child, get, getDatabase, ref } from 'firebase/database'

const config = {
  appName: 'Sunday Class Notes',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DB_URL,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

const app = initializeApp(config)
const db = ref(getDatabase(app))
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

export const useLoginQuery = (name: string, password: string) => {
  return useQuery({
    queryKey: ['login'],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DB_URL}/login.json`,
      )

      if (!data[name]) {
        return { loggedIn: false, message: 'User not found' }
      }

      if (data[name] === password) {
        return { loggedIn: true, message: 'Login validated' }
      } else {
        return { loggedIn: false, message: 'Unauthorized' }
      }

      return { loggedIn: false, message: 'Something went wrong' }
    },
    enabled: !!name && !!password,
  })
}
interface LoggedIn {
  loggedIn: boolean
  message: string
}

const login = async (name: string, password: string): Promise<LoggedIn> => {
  try {
    const snapshot = await get(child(db, `login/${name}`))

    if (snapshot.exists()) {
      const savedPassword = snapshot.val()
      if (savedPassword === password) {
        return { loggedIn: true, message: 'Login validated' }
      } else {
        return { loggedIn: false, message: 'Unauthorized' }
      }
    } else {
      return { loggedIn: false, message: 'User not found' }
    }
  } catch (error: unknown) {
    console.error(error)
    return { loggedIn: false, message: 'Something went wrong' }
  }
}

export default login
