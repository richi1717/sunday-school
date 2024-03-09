import { Box, Button, Card, Stack, Typography } from '@mui/material'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { useCallback, useMemo } from 'react'
import MuiMarkdown from 'markdown-to-jsx'
import {
  filterByBook,
  getNextAndPreviousBooks,
  getNextAndPreviousChapter,
  lastChapterOfPreviousBook,
} from '../../utils/helpers'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useSwipe from '../../utils/useSwipe'

function Chapter() {
  const navigate = useNavigate()
  const { bookName = '', chapter = '' } = useParams()
  const { data: lessonsData } = useLessonsQuery()
  const filteredByBook = useMemo(
    () => filterByBook(lessonsData, bookName),
    [lessonsData, bookName],
  )

  const filteredByChapter = useMemo(
    () => filteredByBook[Number(chapter)],
    [filteredByBook, chapter],
  )

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
      sx={{
        p: { mobile: 0, tablet: 4 },
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <Stack
        sx={{
          overflow: 'hidden',
        }}
      >
        <Card
          sx={{
            p: { mobile: 0, tablet: 4 },
            overflowY: 'scroll',
            maxHeight: 'calc(70vh)',
            maxWidth: 'desktop',
          }}
        >
          <Stack
            sx={{ p: { mobile: 3, tablet: 5 }, height: 1 }}
            spacing={2}
            data-testid="chapterPage"
            {...swiperNoSwiping}
          >
            <Stack
              direction="column"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
            >
              <Typography
                variant="h1"
                sx={{ fontSize: { mobile: 16, tablet: 24 } }}
              >
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
              <Typography component={MuiMarkdown} sx={{ pb: 5 }}>
                {filteredByChapter}
              </Typography>
            )}
          </Stack>
        </Card>
      </Stack>
    </Stack>
  )
}

export default Chapter
