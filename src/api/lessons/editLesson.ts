import { ref, update } from 'firebase/database'
import { db } from '../firebase'

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
