import { Link } from 'react-router-dom'
import { useLessonsQuery } from '../../../api/lessons/getLessons'
import { useMemo } from 'react'
import {
  getChaptersList,
  getOrderedListOfBooksFromLessons,
} from '../../../utils/helpers'
import {
  Grid,
  Modal,
  ModalClose,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  DialogContent,
  Stack,
  ModalDialog,
  AccordionGroup,
} from '@mui/joy'

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

  const orderedLessons = useMemo(
    () => getOrderedListOfBooksFromLessons(lessonsData),
    [lessonsData],
  )

  return (
    <Modal keepMounted open={open} onClose={closeDialog}>
      <ModalDialog layout={fullScreen ? 'fullscreen' : 'center'}>
        <ModalClose />
        <DialogContent sx={{ mt: 3 }}>
          <Stack sx={{ width: { mobile: 1, tablet: 500 } }} spacing={2}>
            {orderedLessons.map((book) => (
              <AccordionGroup key={book}>
                <Accordion>
                  <AccordionSummary>{book}</AccordionSummary>
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
              </AccordionGroup>
            ))}
          </Stack>
        </DialogContent>
      </ModalDialog>
    </Modal>
  )
}
