import {
  Alert,
  AlertTitle,
  FormControl,
  InputLabel,
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
import editLesson from '../../api/lessons/editLesson'
import { LoadingButton } from '@mui/lab'
import { useParams } from 'react-router-dom'
import addLesson from '../../api/lessons/addLesson'
import { yupResolver } from '@hookform/resolvers/yup'
import chaptersPerBook from '../../constants/chaptersPerBook'
import lessonsSchema from '../../schemas/lessonsSchema'

type Inputs = {
  lesson: string
  chapter: string
  bookName: (typeof booksOfTheBible)[number]
}

const EditLesson = () => {
  const [open, setOpen] = useState(false)
  const {
    bookName: bookNameParam = '' as (typeof booksOfTheBible)[number],
    chapter = '',
  } = useParams()
  const { data: lessonsData } = useLessonsQuery()
  const queryClient = useQueryClient()

  const lastBookAndChapter = useMemo(() => {
    if (lessonsData) {
      const books = getOrderedListOfBooksFromLessons(lessonsData)
      const lastBook = books[books.length - 1]
      const chapters = lessonsData[lastBook]

      return {
        lastBook,
        lastChapter: String(chapters.length - 1),
      }
    }
  }, [lessonsData])

  const lesson = useMemo(() => {
    if (lessonsData) {
      if (bookNameParam && chapter) return lessonsData[bookNameParam]?.[chapter]

      const lastBook = lastBookAndChapter?.lastBook
      const lastChapter = lastBookAndChapter?.lastChapter

      return (
        (lastBook && lastChapter && lessonsData[lastBook]?.[lastChapter]) ?? ''
      )
    }

    return ''
  }, [lessonsData, bookNameParam, chapter, lastBookAndChapter])

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
      bookName:
        (bookNameParam as (typeof booksOfTheBible)[number]) ||
        lastBookAndChapter?.lastBook,
      chapter: chapter || lastBookAndChapter?.lastChapter || '1',
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
      sx={{ p: 5, height: 1, width: 1, overflow: 'auto' }}
      component="form"
      alignItems="center"
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
            There are no notes for {bookName} {getValues('chapter')}
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
            <FormControl fullWidth>
              <InputLabel id="book">Book of the Bible</InputLabel>
              <Select
                {...field}
                labelId="book"
                label="Book of the Bible"
                onChange={(event: SelectChangeEvent) => {
                  setValue('chapter', '1')
                  setValue(
                    'lesson',
                    lessonsData[bookName]?.[getValues('chapter')],
                  )

                  return field.onChange(event)
                }}
              >
                {booksOfTheBible.map((book) => (
                  <MenuItem key={book} value={book}>
                    {book}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          control={control}
          name="bookName"
        />
        <Controller
          render={({ field }) => (
            <FormControl fullWidth>
              <InputLabel id="chapter">Chapter</InputLabel>
              <Select
                {...field}
                label="Chapter"
                labelId="chapter"
                onChange={(event: SelectChangeEvent) => {
                  setValue(
                    'lesson',
                    lessonsData[bookName]?.[event.target.value],
                  )

                  return field.onChange(event)
                }}
              >
                {chaptersList?.map((book) => (
                  <MenuItem key={book} value={book}>
                    {book}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          control={control}
          name="chapter"
        />
        <TextField
          error={!!errors.lesson}
          multiline
          minRows={4}
          defaultValue={lesson}
          label="Your notes"
          helperText={(errors.lesson?.message as string) ?? ''}
          placeholder="https://www.markdownguide.org/cheat-sheet/ to learn how to use markdown"
          {...register('lesson')}
        />
        <LoadingButton
          loading={editLessonMutation.isPending}
          type="submit"
          variant="contained"
          sx={{ textTransform: 'none' }}
          disabled={!isDirty || !isValid}
        >
          Update
        </LoadingButton>
      </Stack>
    </Stack>
  )
}

export default EditLesson
