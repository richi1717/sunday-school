import {
  Alert,
  AlertTitle,
  Link,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { useMemo, useState } from 'react'
import booksOfTheBible from '../../constants/booksOfTheBible'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { getOrderedListOfBooksFromLessons } from '../../utils/helpers'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import addLesson from '../../api/lessons/addLesson'
import { LoadingButton } from '@mui/lab'
import { Link as RouterLink } from 'react-router-dom'

interface Inputs {
  lesson: string
  chapter: string
  bookName: (typeof booksOfTheBible)[number]
}

const AddLesson = () => {
  const [open, setOpen] = useState(false)
  const { data: lessonsData } = useLessonsQuery()
  const queryClient = useQueryClient()
  const lastBook = useMemo(() => {
    if (lessonsData) {
      const books = getOrderedListOfBooksFromLessons(lessonsData)

      return books[books.length - 1]
    }
  }, [lessonsData])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<Inputs>({ mode: 'onTouched' })

  const addLessonMutation = useMutation({
    mutationFn: async (args: Inputs) => {
      await addLesson(args)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      return true
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const lessonExists = lessonsData[data.bookName]?.[data.chapter]

    if (lessonExists) {
      setOpen(true)
    } else {
      await addLessonMutation.mutateAsync(data)
    }
  }

  return (
    <Stack
      sx={{ p: 5 }}
      component="form"
      alignItems="center"
      width={1}
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Snackbar
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
      >
        <Alert
          onClose={() => setOpen(false)}
          severity="error"
          sx={{ width: 1 }}
        >
          <AlertTitle>
            There are already notes for {getValues('bookName')}{' '}
            {getValues('chapter')}
          </AlertTitle>
          Please update the book and/or chapter or go to{' '}
          <Link component={RouterLink} to="/edit-lesson">
            Edit
          </Link>
        </Alert>
      </Snackbar>
      <Typography variant="h1" sx={{ fontSize: { mobile: 24, tablet: 30 } }}>
        Add lesson
      </Typography>
      <Stack spacing={2} width={1}>
        <Controller
          render={({ field }) => (
            <Select {...field}>
              {booksOfTheBible.map((book) => (
                <MenuItem key={book} value={book}>
                  {book}
                </MenuItem>
              ))}
            </Select>
          )}
          control={control}
          name="bookName"
          defaultValue={lastBook}
        />
        <TextField
          error={!!errors.chapter}
          label="Chapter"
          placeholder="Chapter"
          helperText={(errors.chapter?.message as string) ?? ''}
          {...register('chapter', {
            required: 'Please add a chapter number',
          })}
        />
        <TextField
          error={!!errors.lesson}
          multiline
          minRows={4}
          label="Your notes"
          helperText={(errors.lesson?.message as string) ?? ''}
          placeholder="https://www.markdownguide.org/cheat-sheet/ to learn how to use markdown"
          {...register('lesson', { required: 'Please enter your notes.' })}
        />
        <LoadingButton
          loading={addLessonMutation.isPending}
          type="submit"
          variant="contained"
          sx={{ textTransform: 'none', cursor: 'pointer' }}
        >
          Add
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

export default AddLesson
