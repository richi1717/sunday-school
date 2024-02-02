import * as yup from 'yup'
import booksOfTheBible from '../constants/booksOfTheBible'

const lessonsSchema = yup
  .object({
    lesson: yup.string().required('Please enter your notes.'),
    chapter: yup.string().required(),
    bookName: yup
      .mixed<(typeof booksOfTheBible)[number]>()
      .oneOf(booksOfTheBible)
      .required(),
  })
  .required()

export default lessonsSchema
