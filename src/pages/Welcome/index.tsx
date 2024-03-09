import { Link, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { useMemo } from 'react'
import { getOrderedListOfBooksFromLessons } from '../../utils/helpers'

export default function Welcome() {
  const { data: lessonsData } = useLessonsQuery()

  const bookAndChapterURL = useMemo(() => {
    if (lessonsData) {
      const books = getOrderedListOfBooksFromLessons(lessonsData)
      const lastBook = books[books.length - 1]
      const firstBook = books[0]
      const chapters = lessonsData[lastBook]
      const firstChapters = lessonsData[firstBook]
      const firstChapter = firstChapters.findIndex((chapter: string) => chapter)

      return {
        last: `${lastBook}/${chapters.length - 1}`,
        lastBook,
        lastChapter: chapters.length - 1,
        first: `${firstBook}/${firstChapter}`,
        firstBook,
        firstChapter,
      }
    }
  }, [lessonsData])

  return (
    <Stack
      alignItems="center"
      sx={{ p: 5, maxWidth: 'desktop' }}
      spacing={2}
      data-testid="welcomePage"
    >
      <Typography variant="h1" sx={{ fontSize: { mobile: 24, tablet: 32 } }}>
        Welcome to Family Life Church of Dora's Sunday school class.
      </Typography>
      <Typography sx={{ fontSize: { mobile: 16, tablet: 20 } }}>
        We are studying the Bible from the beginning and researching the
        original text and meaning of the words. This is an indepth study led by
        James Sweeney. You can click on the "Book and Chapter" text on the top
        left to go to a specific book and chapter that we've already gone over,
        visit the latest one (
        <Link
          component={RouterLink}
          to={`/${bookAndChapterURL?.last}`}
          sx={{ textDecoration: 'none' }}
        >
          {bookAndChapterURL?.lastBook} {bookAndChapterURL?.lastChapter}
        </Link>
        ), or visit the first chapter that we saved our notes on (
        <Link
          component={RouterLink}
          to={`/${bookAndChapterURL?.first}`}
          sx={{ textDecoration: 'none' }}
        >
          {bookAndChapterURL?.firstBook} {bookAndChapterURL?.firstChapter}
        </Link>
        ).
      </Typography>
    </Stack>
  )
}
