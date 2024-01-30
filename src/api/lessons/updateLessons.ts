import { initializeApp } from 'firebase/app'
import { getDatabase, ref, update } from 'firebase/database'
// import NextCors from 'nextjs-cors'

const config = {
  appName: 'Sunday Class Notes',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DB_URL,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

const app = initializeApp(config)
const db = getDatabase(app)

interface UpdateLessonsProps {
  bookName: string
  chapter: string
  lesson: string
}
const updateLessons = async ({
  bookName,
  chapter,
  lesson,
}: UpdateLessonsProps) => {
  // await NextCors(req, res, {
  //   methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  //   origin: '*',
  //   optionsSuccessStatus: 200,
  // })

  await update(ref(db, `studies/${bookName}`), {
    [chapter]: lesson,
  })

  console.log('looks like we made it!')
}

export default updateLessons
