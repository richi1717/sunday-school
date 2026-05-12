import { Alert, AlertTitle, Snackbar, Stack } from '@mui/material'
import booksOfTheBible from '../../constants/booksOfTheBible'
import { LoadingButton } from '@mui/lab'

interface EditLessonSnackbarProps {
  bookName: (typeof booksOfTheBible)[number]
  chapter: string
  handleSubmit: () => void
  loading: boolean
  open: boolean
  setOpen: (open: boolean) => void
}

const EditLessonSnackbar = ({
  bookName,
  chapter,
  handleSubmit,
  loading = false,
  open = false,
  setOpen,
}: EditLessonSnackbarProps) => (
  <Snackbar
    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    open={open}
  >
    <Alert
      onClose={() => setOpen(false)}
      severity="info"
      sx={{ width: 1, '& .MuiAlert-message': { width: 1 } }}
    >
      <AlertTitle>
        There are no notes for {bookName} {chapter}
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
          onClick={handleSubmit}
          loading={loading}
        >
          Yes
        </LoadingButton>
      </Stack>
    </Alert>
  </Snackbar>
)

export default EditLessonSnackbar
