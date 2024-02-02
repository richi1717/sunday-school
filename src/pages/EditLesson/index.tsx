import {
  Alert,
  AlertTitle,
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
import editLesson from '../../api/lessons/editLesson'
import { LoadingButton } from '@mui/lab'
import { useParams } from 'react-router-dom'
import addLesson from '../../api/lessons/addLesson'

interface Inputs {
  lesson: string
  chapter: string
  bookName: (typeof booksOfTheBible)[number]
}

const EditLesson = () => {
  const [open, setOpen] = useState(false)
  const { bookName = '', chapter = '' } = useParams()
  const { data: lessonsData } = useLessonsQuery()
  const queryClient = useQueryClient()

  const lastBook = useMemo(() => {
    if (lessonsData) {
      const books = getOrderedListOfBooksFromLessons(lessonsData)

      return books[books.length - 1]
    }
  }, [lessonsData])

  const lesson = useMemo(() => {
    if (lessonsData) {
      return lessonsData[bookName]?.[chapter]
    }

    return ''
  }, [lessonsData, bookName, chapter])

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    getValues,
  } = useForm<Inputs>({ mode: 'onTouched' })

  const editLessonMutation = useMutation({
    mutationFn: async (args: Inputs) => {
      await editLesson(args)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      return true
    },
  })

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
      await editLessonMutation.mutateAsync(data)
    } else {
      setOpen(true)
    }
  }

  const onSubmitAdd: SubmitHandler<Inputs> = async (data) => {
    await addLessonMutation.mutateAsync(data)
    setOpen(false)
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
          sx={{ width: 1, '& .MuiAlert-message': { width: 1 } }}
        >
          <AlertTitle>
            There are no notes for {getValues('bookName')}{' '}
            {getValues('chapter')}
          </AlertTitle>
          Would you like to add new notes for this chapter instead?
          <Stack
            direction="row"
            spacing={2}
            justifyContent="flex-end"
            sx={{ mt: 2 }}
          >
            <LoadingButton
              sx={{ textTransform: 'none' }}
              variant="contained"
              onClick={() => setOpen(false)}
            >
              No
            </LoadingButton>
            <LoadingButton
              sx={{ textTransform: 'none' }}
              variant="contained"
              onClick={handleSubmit(onSubmitAdd)}
              loading={addLessonMutation.isPending}
            >
              Yes
            </LoadingButton>
          </Stack>
        </Alert>
      </Snackbar>
      <Typography variant="h1" sx={{ fontSize: { mobile: 24, tablet: 30 } }}>
        Edit lesson
      </Typography>
      <Stack spacing={2} width={1}>
        <Controller
          render={({ field }) => (
            <Select {...field} defaultValue={bookName}>
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
          defaultValue={chapter}
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
          defaultValue={lesson}
          placeholder="https://www.markdownguide.org/cheat-sheet/ to learn how to use markdown"
          {...register('lesson', { required: 'Please enter your notes.' })}
        />
        <LoadingButton
          loading={editLessonMutation.isPending}
          type="submit"
          variant="contained"
          sx={{ textTransform: 'none' }}
        >
          Update
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

export default EditLesson
