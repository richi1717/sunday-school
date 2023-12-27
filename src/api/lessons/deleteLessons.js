import { initializeApp } from 'firebase/app'
import { getDatabase, ref, remove } from 'firebase/database'
import NextCors from 'nextjs-cors'

const config = {
  appName: 'Sunday Class Notes',
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_DB_URL,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
}

const app = initializeApp(config)
const db = getDatabase(app)

const deleteLessons = async (req, res) => {
  const body = JSON.parse(req.body)
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  })

  remove(ref(db, `studies/${body.id}`))

  res.json({ message: 'Delete complete' })
}

export default deleteLessons
