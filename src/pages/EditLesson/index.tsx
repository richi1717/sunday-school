import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material'
import { useMemo } from 'react'
import booksOfTheBible from '../../constants/booksOfTheBible'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { getOrderedListOfBooksFromLessons } from '../../utils/helpers'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import editLesson from '../../api/lessons/editLesson'
import { useParams } from 'react-router-dom'
import addLesson from '../../api/lessons/addLesson'
import { yupResolver } from '@hookform/resolvers/yup'
import chaptersPerBook from '../../constants/chaptersPerBook'
import lessonsSchema from '../../schemas/lessonsSchema'
import MuiTextEditor from './MuiTextEditor'
import EditLessonSnackbar from './EditLessonSnackbar'
import { useState } from 'react'

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
    if (!lessonsData) return undefined
    const books = getOrderedListOfBooksFromLessons(lessonsData)
    const lastBook = books[books.length - 1]
    const chapterKeys = Object.keys(lessonsData[lastBook] ?? {})
      .map(Number)
      .sort((a, b) => a - b)
    return {
      lastBook,
      lastChapter: String(chapterKeys[chapterKeys.length - 1] ?? 1),
    }
  }, [lessonsData])

  const defaultLesson = useMemo(() => {
    if (!lessonsData) return ''
    if (bookNameParam && chapter) {
      return lessonsData[bookNameParam]?.[chapter] ?? ''
    }
    const { lastBook, lastChapter } = lastBookAndChapter ?? {}
    return (lastBook && lastChapter && lessonsData[lastBook]?.[lastChapter]) ?? ''
  }, [lessonsData, bookNameParam, chapter, lastBookAndChapter])

  const {
    handleSubmit,
    formState: { isDirty, isValid },
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
      lesson: defaultLesson,
    },
  })

  const bookName = watch('bookName') as (typeof booksOfTheBible)[number]
  const selectedChapter = watch('chapter')

  const chaptersList = useMemo(() => {
    if (!lessonsData) return []
    return Array.from({ length: chaptersPerBook[bookName] }, (_, k) => k + 1)
  }, [lessonsData, bookName])

  const lessonExists = useMemo(() => {
    if (!lessonsData || !bookName) return false
    return lessonsData[bookName]?.[selectedChapter] != null
  }, [lessonsData, bookName, selectedChapter])

  const editLessonMutation = useMutation({
    mutationFn: async (args: Inputs) => {
      await editLesson(args)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })

  const addLessonMutation = useMutation({
    mutationFn: async (args: Inputs) => {
      await addLesson(args)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
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
      sx={{
        py: { mobile: 1, tablet: 4 },
        px: { mobile: 3, tablet: 4 },
        width: 1,
        maxWidth: 'desktop',
      }}
      component="form"
      alignItems="center"
      spacing={2}
      onSubmit={handleSubmit(onSubmit)}
    >
      <EditLessonSnackbar
        open={open}
        setOpen={setOpen}
        bookName={bookName}
        chapter={getValues('chapter')}
        handleSubmit={handleSubmit(onSubmitAdd)}
        loading={addLessonMutation.isPending}
      />
      <Typography variant="h1" sx={{ fontSize: { mobile: 24, tablet: 30 } }}>
        {lessonExists ? 'Edit lesson' : 'Add lesson'}
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
                  const newBook = event.target.value as (typeof booksOfTheBible)[number]
                  setValue('chapter', '1')
                  setValue('lesson', lessonsData?.[newBook]?.['1'] ?? '')
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
                    lessonsData?.[bookName]?.[event.target.value] ?? '',
                  )
                  return field.onChange(event)
                }}
              >
                {chaptersList.map((chapterNum) => (
                  <MenuItem key={chapterNum} value={chapterNum}>
                    {chapterNum}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          control={control}
          name="chapter"
        />
        <Controller
          name="lesson"
          control={control}
          rules={{ required: 'Lesson is required' }}
          render={({ field }) => (
            <MuiTextEditor
              value={field.value ?? ''}
              onChange={field.onChange}
              onBlur={field.onBlur}
              disabled={!isDirty || !isValid}
              loading={editLessonMutation.isPending}
            />
          )}
        />
      </Stack>
    </Stack>
  )
}

export default EditLesson
