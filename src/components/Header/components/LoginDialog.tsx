import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'

interface LoginDialogProps {
  setIsAdmin: (isAdmin: boolean) => void
  name: string
  setName: (name: string) => void
  open: boolean
  closeDialog: () => void
}

export default function LoginDialog({
  setIsAdmin,
  name,
  setName,
  closeDialog,
  open,
}: LoginDialogProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('tablet'))

  const loginMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_DB_URL}/login.json`,
      )

      return data
    },
    onError: (err) => {
      console.error(err)
      setError('Something went wrong, please try again later.')
    },
    onSuccess: (data) => {
      const found = data[name]
      if (found) {
        if (found === password) {
          document.cookie = `loggedIn=${name}; expires=Thu, 31 Dec 2099 23:59:59 GMT`
          setPassword('')
          closeDialog()
          setIsAdmin(true)
        } else {
          setError('Unauthorized')
        }
      } else {
        setError('User not found')
      }
    },
  })

  return (
    <Dialog open={open} onClose={closeDialog} fullScreen={matches}>
      <DialogTitle
        sx={{ textAlign: 'center', fontSize: { mobile: 30, tablet: 44 } }}
      >
        Login to edit
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
      {error && (
        <Alert severity="error" sx={{ mx: 3 }}>
          {error}
        </Alert>
      )}
      <DialogContent>
        <Stack
          sx={{ minWidth: { mobile: 1, tablet: 400 }, pt: 1 }}
          spacing={2}
          component="form"
          onSubmit={(e) => {
            e.preventDefault()
            loginMutation.mutate()
          }}
        >
          <TextField
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Name"
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />
          <DialogActions sx={{ p: 0 }}>
            <Button
              type="submit"
              sx={{ textTransform: 'none', width: 1 }}
              variant="contained"
            >
              Login
            </Button>
          </DialogActions>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
