import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CircularProgress,
  // IconButton,
  Stack,
  Typography,
} from '@mui/material'
import EngineeringIcon from '@mui/icons-material/Engineering'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useMemo, useRef, useState } from 'react'
import MuiMarkdown from 'markdown-to-jsx'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  filterByBook,
  getLastBook,
  getNextAndPreviousBooks,
  getNextAndPreviousChapter,
  lastChapterOfPreviousBook,
} from '../../utils/helpers'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { Link, useParams } from 'react-router-dom'

export default function Chapter() {
  const { bookName = '', chapter = '' } = useParams()
  console.log({ bookName, chapter })
  // const inputEl = useRef<HTMLInputElement>(null)
  const [lesson, setLesson] = useState('')
  const [updateId, setUpdateId] = useState('')
  const [currentLessons, setCurrentLessons] = useState({})
  const { data } = useLessonsQuery()
  console.log({ data })
  const filteredByBook = useMemo(
    () => filterByBook(currentLessons, bookName),
    [currentLessons, bookName],
  )

  const filteredByChapter = useMemo(
    () =>
      filterByBook(currentLessons, bookName).find((book) => book[chapter])?.[
        chapter
      ],
    [currentLessons, bookName, chapter],
  )

  const previousAndNextButtonsForChapters = useMemo(
    () => getNextAndPreviousChapter(filteredByBook, chapter),
    [filteredByBook, chapter],
  )

  const previousAndNextButtonsForBooks = useMemo(
    () => getNextAndPreviousBooks(bookName),
    [bookName],
  )

  console.log({
    previousAndNextButtonsForChapters,
    previousAndNextButtonsForBooks,
  })
  const lastIndex = useMemo(() => filteredByBook?.length - 1, [filteredByBook])

  // const lastSubIndex = useMemo(() => filterByBook(currentLessons, bookName)?.length - 1, [currentLessons])
  console.log(lastIndex, filteredByBook, currentLessons)
  const expandedDefault = filteredByBook?.[lastIndex]?.book
  const [expanded, setExpanded] = useState<boolean | string>(expandedDefault)
  const [subExpanded, setSubExpanded] = useState<boolean | string>(
    expandedDefault,
  )
  console.log({ expandedDefault, lesson, updateId, lastOne: getLastBook() })

  const deleteLessons = async (book: string, chapter: string) => {
    console.log(book, chapter)
    try {
      // await fetch('/api/deleteLessons', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     id,
      //   }),
      // })
      // const temp = await (
      //   await fetch(`${import.meta.env.VITE_DB_URL}/studies.json`)
      // ).json()
      // setCurrentLessons(temp)
      setCurrentLessons({})
    } catch (err) {
      console.error(err)
    }
    setUpdateId('')
  }

  const renderPreviousAndNextButton = (next: boolean) => {
    if (previousAndNextButtonsForChapters[next ? 'next' : 'previous']) {
      return (
        <Button
          component={Link}
          to={`/books/${bookName}/${
            previousAndNextButtonsForChapters[next ? 'next' : 'previous']
          }`}
          variant="contained"
          sx={{
            textTransform: 'none',
            width: 146,
          }}
        >
          {previousAndNextButtonsForChapters[next ? 'next' : 'previous']}
        </Button>
      )
    }

    if (previousAndNextButtonsForBooks[next ? 'next' : 'previous']) {
      const number = !next
        ? lastChapterOfPreviousBook(
            filterByBook(data, previousAndNextButtonsForBooks.previous),
          )
        : '1'

      return (
        <Button
          component={Link}
          to={`/books/${
            previousAndNextButtonsForBooks[next ? 'next' : 'previous']
          }/${number}`}
          variant="contained"
          sx={{
            textTransform: 'none',
            width: 160,
          }}
        >
          {previousAndNextButtonsForBooks[next ? 'next' : 'previous']} {number}
        </Button>
      )
    }
    return <Box sx={{ width: 160 }} />
  }

  return (
    <Stack spacing={2} padding={{ mobile: 3, tablet: 5 }}>
      <Stack
        direction="column"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography variant="h1" sx={{ fontSize: { mobile: 16, tablet: 24 } }}>
          {bookName} {chapter}
        </Typography>
        <Stack direction="row" justifyContent="space-between" width={1}>
          {renderPreviousAndNextButton(false)}
          {renderPreviousAndNextButton(true)}
        </Stack>
      </Stack>
      {filteredByBook.length === 0 && (
        <Stack alignItems="center" direction="column" spacing={4}>
          <Typography fontSize={32}>Coming soon</Typography>
          <EngineeringIcon sx={{ height: 100, width: 100 }} />
        </Stack>
      )}
      {filteredByChapter && (
        <Typography component={MuiMarkdown}>{filteredByChapter}</Typography>
      )}
    </Stack>
  )
}
