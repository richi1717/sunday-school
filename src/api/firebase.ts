import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAuth } from 'firebase/auth'

const config = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DB_URL,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

export const app = initializeApp(config)
export const db = getDatabase(app)
export const auth = getAuth(app)
