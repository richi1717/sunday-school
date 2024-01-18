import {
  // Accordion,
  // AccordionDetails,
  // AccordionSummary,
  Box,
  Button,
  // CircularProgress,
  // IconButton,
  Stack,
  Typography,
} from '@mui/material'
import EngineeringIcon from '@mui/icons-material/Engineering'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useCallback, useMemo } from 'react'
import MuiMarkdown from 'markdown-to-jsx'
// import EditIcon from '@mui/icons-material/Edit'
// import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import {
  filterByBook,
  // getLastBook,
  getNextAndPreviousBooks,
  getNextAndPreviousChapter,
  lastChapterOfPreviousBook,
} from '../../utils/helpers'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useSwipe from '../../utils/useSwipe'

export default function Chapter() {
  const navigate = useNavigate()
  const { bookName = '', chapter = '' } = useParams()
  // console.log({ bookName, chapter })
  // const inputEl = useRef<HTMLInputElement>(null)
  // const [lesson, setLesson] = useState('')
  // const [updateId, setUpdateId] = useState('')
  const { data: lessonsData } = useLessonsQuery()
  // console.log({ lessonsData })
  const filteredByBook = useMemo(
    () => filterByBook(lessonsData, bookName),
    [lessonsData, bookName],
  )
  console.log({ filteredByBook })

  const filteredByChapter = useMemo(
    () => filteredByBook[Number(chapter)],
    [filteredByBook, chapter],
  )

  console.log({ filteredByChapter })
  const previousAndNextButtonsForChapters = useMemo(
    () => getNextAndPreviousChapter(filteredByBook, chapter),
    [filteredByBook, chapter],
  )

  const previousAndNextButtonsForBooks = useMemo(
    () => getNextAndPreviousBooks(bookName),
    [bookName],
  )

  const onSwipedLeft = useCallback(() => {
    if (previousAndNextButtonsForChapters.next) {
      return navigate(`/${bookName}/${previousAndNextButtonsForChapters.next}`)
    }
    if (previousAndNextButtonsForBooks.next) {
      return navigate(`/${previousAndNextButtonsForBooks.next}/1`)
    }
  }, [
    previousAndNextButtonsForBooks.next,
    previousAndNextButtonsForChapters.next,
    bookName,
    navigate,
  ])

  const onSwipedRight = useCallback(() => {
    if (previousAndNextButtonsForChapters.previous) {
      return navigate(
        `/${bookName}/${previousAndNextButtonsForChapters.previous}`,
      )
    }
    if (previousAndNextButtonsForBooks.previous) {
      const number = lastChapterOfPreviousBook(
        filterByBook(lessonsData, previousAndNextButtonsForBooks.previous),
      )

      return navigate(`/${previousAndNextButtonsForBooks.previous}/${number}`)
    }
  }, [
    previousAndNextButtonsForBooks.previous,
    previousAndNextButtonsForChapters.previous,
    bookName,
    navigate,
    lessonsData,
  ])

  const swiperNoSwiping = useSwipe({
    onSwipedLeft,
    onSwipedRight,
  })
  // console.log({
  //   previousAndNextButtonsForChapters,
  //   previousAndNextButtonsForBooks,
  // })
  // const lastIndex = useMemo(() => filteredByBook?.length - 1, [filteredByBook])

  // const lastSubIndex = useMemo(() => filterByBook(currentLessons, bookName)?.length - 1, [currentLessons])
  // console.log(lastIndex, filteredByBook)
  // const expandedDefault = filteredByBook?.[lastIndex]?.book
  // const [expanded, setExpanded] = useState<boolean | string>(expandedDefault)
  // const [subExpanded, setSubExpanded] = useState<boolean | string>(
  //   expandedDefault,
  // )
  // console.log({ expandedDefault, lesson, updateId, lastOne: getLastBook() })

  // const deleteLessons = async (book: string, chapter: string) => {
  //   console.log(book, chapter)
  //   try {
  //     // await fetch('/api/deleteLessons', {
  //     //   method: 'POST',
  //     //   body: JSON.stringify({
  //     //     id,
  //     //   }),
  //     // })
  //     // const temp = await (
  //     //   await fetch(`${import.meta.env.VITE_DB_URL}/studies.json`)
  //     // ).json()
  //     // setCurrentLessons(temp)
  //     setCurrentLessons({})
  //   } catch (err) {
  //     console.error(err)
  //   }
  //   setUpdateId('')
  // }

  const renderPreviousAndNextButton = (next: boolean) => {
    if (previousAndNextButtonsForChapters[next ? 'next' : 'previous']) {
      return (
        <Button
          component={Link}
          to={`/${bookName}/${
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
            filterByBook(lessonsData, previousAndNextButtonsForBooks.previous),
          )
        : '1'

      return (
        <Button
          component={Link}
          to={`/${
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
    <Stack
      sx={{ p: { mobile: 3, tablet: 5 }, height: 1 }}
      spacing={2}
      {...swiperNoSwiping}
    >
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
