import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Link, useParams } from 'react-router-dom'
import { useLessonsQuery } from '../../../api/lessons/getLessons'
import { useMemo } from 'react'
import {
  getChaptersList,
  getOrderedListOfBooksFromLessons,
} from '../../../utils/helpers'
import Grid from '@mui/material/Unstable_Grid2'

interface BookAndChapterDialogProps {
  open: boolean
  closeDialog: () => void
  fullScreen?: boolean
}

export default function BookAndChapterDialog({
  open,
  closeDialog,
  fullScreen = false,
}: BookAndChapterDialogProps) {
  const { data: lessonsData } = useLessonsQuery()
  const { bookName = '', chapter: currentChapter = '' } = useParams()

  const orderedLessons = useMemo(
    () => getOrderedListOfBooksFromLessons(lessonsData),
    [lessonsData],
  )

  return (
    <Dialog open={open} onClose={closeDialog} fullScreen={fullScreen}>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <IconButton
          aria-label="close"
          onClick={closeDialog}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Stack sx={{ width: { mobile: 1, tablet: 500 } }} spacing={3}>
          {orderedLessons.map((book) => (
            <Box key={book}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 'bold',
                  mb: 1,
                  color: book === bookName ? 'primary.main' : 'text.primary',
                }}
              >
                {book}
              </Typography>
              <Grid container justifyContent="start" spacing={1}>
                {getChaptersList(lessonsData, book).map((chapter) => (
                  <Grid key={chapter}>
                    <Button
                      component={Link}
                      to={`/${book}/${chapter}`}
                      sx={{
                        height: 44,
                        width: 44,
                        minWidth: 0,
                        backgroundColor: (theme) =>
                          book === bookName &&
                          String(chapter) === currentChapter
                            ? theme.palette.primary.main
                            : theme.palette.mode === 'dark'
                              ? '#1A2027'
                              : '#fff',
                        fontWeight:
                          book === bookName && String(chapter) === currentChapter
                            ? 'bold'
                            : 'normal',
                        color:
                          book === bookName && String(chapter) === currentChapter
                            ? 'primary.contrastText'
                            : undefined,
                      }}
                      onClick={closeDialog}
                    >
                      {chapter}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
