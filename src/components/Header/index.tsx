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
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import axios from 'axios'
import ToggleColorMode from '../ToggleColorMode'
import { useMutation } from '@tanstack/react-query'

interface HeaderProps {
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

export default function Header({ isAdmin, setIsAdmin }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
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
          document.cookie =
            'loggedIn=true; expires=Thu, 31 Dec 2099 23:59:59 GMT'
          setPassword('')
          setOpen(false)
          setIsAdmin(true)
        } else {
          setError('Unauthorized')
        }
      } else {
        setError('User not found')
      }
    },
  })

  const handleClick = () => {
    if (isAdmin) {
      setIsAdmin(false)
      document.cookie = 'loggedIn=false'
    } else {
      setOpen(true)
    }
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      p={2}
    >
      <Stack direction="row" alignSelf="flex-end">
        <ToggleColorMode />
        <Button sx={{ textTransform: 'none', p: 2 }} onClick={handleClick}>
          {isAdmin ? 'Logout' : 'Login'}
        </Button>
      </Stack>
      <Typography
        variant="h1"
        sx={{
          textAlign: 'center',
          p: 2,
          fontSize: { mobile: 40, tablet: 64 },
        }}
      >
        Sunday School Notes
      </Typography>
      <Dialog open={open} onClose={() => setOpen(false)} fullScreen={matches}>
        <DialogTitle
          sx={{ textAlign: 'center', fontSize: { mobile: 30, tablet: 44 } }}
        >
          Login to edit
          <IconButton
            aria-label="close"
            onClick={() => setOpen(false)}
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
    </Stack>
  )
}
