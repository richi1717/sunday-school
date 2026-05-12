import { ref, update } from 'firebase/database'
import { db } from '../firebase'
import booksOfTheBible from '../../constants/booksOfTheBible'

interface UpdateLessonsProps {
  bookName: (typeof booksOfTheBible)[number]
  chapter: string
  lesson: string
}

const addLesson = async ({ bookName, chapter, lesson }: UpdateLessonsProps) => {
  await Promise.all([
    update(ref(db, `studies/${bookName}`), { [chapter]: lesson }),
    update(ref(db, `studiesMeta/${bookName}`), {
      [chapter]: new Date().toISOString(),
    }),
  ])
}

export default addLesson
