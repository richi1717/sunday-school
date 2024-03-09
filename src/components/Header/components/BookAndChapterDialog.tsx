import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { Link, useParams } from 'react-router-dom'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
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
  const { bookName = '' } = useParams()

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
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ mt: 3 }}>
        <Stack sx={{ width: { mobile: 1, tablet: 500 } }} spacing={2}>
          {orderedLessons.map((book, idx) => (
            <Accordion
              key={book}
              TransitionProps={{ unmountOnExit: true }}
              defaultExpanded={
                bookName === book ||
                (!bookName && idx + 1 === orderedLessons.length)
              }
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {book}
              </AccordionSummary>
              <AccordionDetails>
                <Grid container justifyContent="start" spacing={2}>
                  {getChaptersList(lessonsData, book).map((chapter) => (
                    <Grid key={chapter}>
                      <Button
                        component={Link}
                        to={`/${book}/${chapter}`}
                        sx={{
                          height: 50,
                          width: 50,
                          backgroundColor: (theme) =>
                            theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                        }}
                        onClick={closeDialog}
                      >
                        {chapter}
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
