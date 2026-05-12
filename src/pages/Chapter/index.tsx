import {
  Box,
  Button,
  Card,
  IconButton,
  Snackbar,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import EngineeringIcon from '@mui/icons-material/Engineering'
import { useCallback, useMemo, useState } from 'react'
import MuiMarkdown from 'markdown-to-jsx'
import {
  filterByBook,
  getNextAndPreviousBooks,
  getNextAndPreviousChapter,
  lastChapterOfPreviousBook,
} from '../../utils/helpers'
import { useLessonsQuery } from '../../api/lessons/getLessons'
import { useStudiesMetaQuery } from '../../api/lessons/getStudiesMeta'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useSwipe from '../../utils/useSwipe'

function Chapter() {
  const navigate = useNavigate()
  const { bookName = '', chapter = '' } = useParams()
  const { data: lessonsData } = useLessonsQuery()
  const { data: metaData } = useStudiesMetaQuery()
  const [copied, setCopied] = useState(false)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.up('tablet'))

  const updatedAt = metaData?.[bookName]?.[chapter]
  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
  }

  const filteredByBook = useMemo(
    () => filterByBook(lessonsData, bookName),
    [lessonsData, bookName],
  )

  const filteredByChapter = useMemo(
    () => filteredByBook[chapter],
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
        filterByBook(lessonsData, previousAndNextButtonsForBooks.previous ?? ''),
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
      const text = previousAndNextButtonsForChapters[next ? 'next' : 'previous']
      const arrows = next ? (
        <ArrowCircleRightOutlinedIcon />
      ) : (
        <ArrowCircleLeftOutlinedIcon />
      )

      return (
        <Button
          component={Link}
          to={`/${bookName}/${
            previousAndNextButtonsForChapters[next ? 'next' : 'previous']
          }`}
          variant={matches ? 'contained' : 'text'}
          sx={{
            textTransform: 'none',
            width: { mobile: 100, tablet: 160 },
            borderRadius: {
              mobile: next ? '4px 0px 0px 4px' : '0px 4px 4px 0px',
              tablet: 1,
            },
          }}
        >
          {matches ? text : arrows}
        </Button>
      )
    }

    if (previousAndNextButtonsForBooks[next ? 'next' : 'previous']) {
      const number = !next
        ? lastChapterOfPreviousBook(
            filterByBook(lessonsData, previousAndNextButtonsForBooks.previous ?? ''),
          )
        : '1'

      const text = `${
        previousAndNextButtonsForBooks[next ? 'next' : 'previous']
      } ${number}`

      return (
        <Button
          component={Link}
          to={`/${
            previousAndNextButtonsForBooks[next ? 'next' : 'previous']
          }/${number}`}
          variant={matches ? 'contained' : 'text'}
          sx={{
            textTransform: 'none',
            width: { mobile: 100, tablet: 160 },
          }}
        >
          {text}
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
        width: 1,
      }}
    >
      <Stack
        sx={{
          overflow: 'hidden',
          maxWidth: 'desktop',
          width: 1,
        }}
      >
        <Stack
          sx={{ height: 1, width: 1 }}
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
            <Stack
              direction="row"
              justifyContent="space-between"
              width={1}
              alignItems="center"
            >
              {renderPreviousAndNextButton(false)}
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography
                  variant="h1"
                  sx={{ fontSize: { mobile: 16, tablet: 24 } }}
                >
                  {bookName} {chapter}
                </Typography>
                <Tooltip title="Copy link">
                  <IconButton
                    size="small"
                    onClick={handleCopyLink}
                    sx={{ color: 'text.secondary' }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
              {renderPreviousAndNextButton(true)}
            </Stack>
          </Stack>
          <Card
            sx={{
              p: { mobile: 3, tablet: 5 },
              overflowY: 'scroll',
              maxHeight: 'calc(90vh)',
              maxWidth: 'desktop',
              width: 1,
              borderRadius: { mobile: 0, tablet: 1 },
            }}
          >
            {Object.keys(filteredByBook).length === 0 && (
              <Stack alignItems="center" direction="column" spacing={4}>
                <Typography fontSize={32}>Coming soon</Typography>
                <EngineeringIcon sx={{ height: 100, width: 100 }} />
              </Stack>
            )}
            {formattedDate && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'right', mb: 1 }}
              >
                Last edited: {formattedDate}
              </Typography>
            )}
            {filteredByChapter && (
              filteredByChapter.trimStart().startsWith('<') ? (
                <Box
                  sx={{
                    pb: 5,
                    maxWidth: 1,
                    fontFamily: 'Lora, serif',
                    fontSize: { mobile: '1.05rem', tablet: '1.1rem' },
                    lineHeight: 1.8,
                    '& a': { wordBreak: 'break-all' },
                    '& h3, & h4, & h5': {
                      fontFamily: 'Inter, sans-serif',
                      borderLeft: '3px solid',
                      borderColor: 'primary.main',
                      pl: 1.5,
                      mt: 4,
                      mb: 1,
                    },
                    '& p': { mt: 0, mb: 1.5 },
                    '& table': { borderCollapse: 'collapse', width: 1, mb: 2 },
                    '& th, & td': {
                      border: '1px solid',
                      borderColor: 'divider',
                      p: 1,
                      textAlign: 'left',
                    },
                    '& th': { fontWeight: 'bold', bgcolor: 'action.hover' },
                  }}
                  dangerouslySetInnerHTML={{ __html: filteredByChapter }}
                />
              ) : (
                <Typography
                  component={MuiMarkdown}
                  sx={{ pb: 5, maxWidth: 1, '& a': { wordBreak: 'break-all' } }}
                >
                  {filteredByChapter}
                </Typography>
              )
            )}
          </Card>
        </Stack>
      </Stack>
      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => setCopied(false)}
        message="Link copied!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Stack>
  )
}

export default Chapter
