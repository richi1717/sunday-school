import { initializeApp } from 'firebase/app'
import { getDatabase, ref, update } from 'firebase/database'

const config = {
  appName: 'Sunday Class Notes',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DB_URL,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

const app = initializeApp(config)
const db = getDatabase(app)

interface EditLessonProps {
  bookName: string
  chapter: string
  lesson: string
}
const editLesson = async ({ bookName, chapter, lesson }: EditLessonProps) => {
  await Promise.all([
    update(ref(db, `studies/${bookName}`), { [chapter]: lesson }),
    update(ref(db, `studiesMeta/${bookName}`), {
      [chapter]: new Date().toISOString(),
    }),
  ])
}

export default editLesson
