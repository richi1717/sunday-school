import { initializeApp } from 'firebase/app'
import { getDatabase, ref, update } from 'firebase/database'
import booksOfTheBible from '../../constants/booksOfTheBible'

const config = {
  appName: 'Sunday Class Notes',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DB_URL,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

const app = initializeApp(config)
const db = getDatabase(app)

interface UpdateLessonsProps {
  bookName: (typeof booksOfTheBible)[number]
  chapter: string
  lesson: string
}
const addLesson = async ({ bookName, chapter, lesson }: UpdateLessonsProps) => {
  return await update(ref(db, `studies/${bookName}`), {
    [chapter]: lesson,
  })
}

export default addLesson
