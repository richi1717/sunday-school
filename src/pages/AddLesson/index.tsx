import {
  Alert,
  AlertTitle,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
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
import { yupResolver } from '@hookform/resolvers/yup'
import chaptersPerBook from '../../constants/chaptersPerBook'
import lessonsSchema from '../../schemas/lessonsSchema'

type Inputs = {
  lesson: string
  chapter: string
  bookName: (typeof booksOfTheBible)[number]
}

const AddLesson = () => {
  const [open, setOpen] = useState(false)
  const { data: lessonsData } = useLessonsQuery()
  const queryClient = useQueryClient()

  const lastBookAndChapter = useMemo(() => {
    if (lessonsData) {
      const books = getOrderedListOfBooksFromLessons(lessonsData)
      const lastBook = books[books.length - 1]
      const chapters = lessonsData[lastBook]

      return {
        lastBook,
        lastChapter: chapters.length,
      }
    }
  }, [lessonsData])

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    control,
    getValues,
    watch,
    setValue,
  } = useForm<Inputs>({
    mode: 'onTouched',
    resolver: yupResolver(lessonsSchema),
    defaultValues: {
      bookName: lastBookAndChapter?.lastBook,
      chapter: lastBookAndChapter?.lastChapter ?? 1,
    },
  })

  const bookName = watch('bookName') as (typeof booksOfTheBible)[number]

  const chaptersList = useMemo(() => {
    if (lessonsData) {
      return Array.from(
        {
          length: chaptersPerBook[bookName],
        },
        (_, k) => k + 1,
      )
    }
  }, [lessonsData, bookName])

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
            There are already notes for {bookName} {getValues('chapter')}
          </AlertTitle>
          Please update the book and/or chapter or go{' '}
          <Link
            component={RouterLink}
            to={`/edit-lesson/${bookName}/${getValues('chapter')}`}
            onClick={() =>
              queryClient.invalidateQueries({ queryKey: ['lessons'] })
            }
          >
            Edit {bookName} {getValues('chapter')}
          </Link>
        </Alert>
      </Snackbar>
      <Typography variant="h1" sx={{ fontSize: { mobile: 24, tablet: 30 } }}>
        Add lesson
      </Typography>
      <Stack spacing={2} width={1}>
        <Controller
          render={({ field }) => (
            <Select
              {...field}
              onChange={(event: SelectChangeEvent) => {
                setValue('chapter', '1')
                return field.onChange(event)
              }}
            >
              {booksOfTheBible.map((book) => (
                <MenuItem key={book} value={book}>
                  {book}
                </MenuItem>
              ))}
            </Select>
          )}
          control={control}
          name="bookName"
        />
        <Controller
          render={({ field }) => (
            <Select {...field}>
              {chaptersList?.map((book) => (
                <MenuItem key={book} value={book}>
                  {book}
                </MenuItem>
              ))}
            </Select>
          )}
          control={control}
          name="chapter"
        />
        <TextField
          error={!!errors.lesson}
          multiline
          minRows={4}
          label="Your notes"
          helperText={(errors.lesson?.message as string) ?? ''}
          placeholder="https://www.markdownguide.org/cheat-sheet/ to learn how to use markdown"
          {...register('lesson')}
        />
        <LoadingButton
          loading={addLessonMutation.isPending}
          type="submit"
          variant="contained"
          sx={{ textTransform: 'none', cursor: 'pointer' }}
          disabled={!isDirty || !isValid}
        >
          Add
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

export default AddLesson
