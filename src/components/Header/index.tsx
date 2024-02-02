import { useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  TextField,
  capitalize,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import axios from 'axios'
import ToggleColorMode from '../ToggleColorMode'
import { useMutation } from '@tanstack/react-query'
import BookAndChapterDialog from './components/BookAndChapterDialog'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { getCookie } from '../../utils/helpers'

interface HeaderProps {
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

export default function Header({ isAdmin, setIsAdmin }: HeaderProps) {
  const navigate = useNavigate()
  const { bookName = '', chapter = '' } = useParams()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [bookSelectOpen, setBookSelectOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('tablet'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const isAdminOpen = Boolean(anchorEl)

  const adminName = useMemo(() => {
    const name = getCookie()

    return name ? capitalize(name) : 'Logout'
  }, [])

  const handleClose = () => {
    setAnchorEl(null)
  }

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

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isAdmin) {
      setAnchorEl(event.currentTarget)
      // setIsAdmin(false)
      // document.cookie = 'loggedIn=false'
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
      <Stack direction="row" justifyContent="space-between" width={1}>
        <Button
          sx={{ textTransform: 'none', p: 2 }}
          onClick={() => setBookSelectOpen(true)}
        >
          Book & Chapter
        </Button>

        <Stack direction="row">
          <ToggleColorMode />
          <Button sx={{ textTransform: 'none', p: 2 }} onClick={handleClick}>
            {isAdmin ? adminName : 'Login'}
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={isAdminOpen}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem
              onClick={() => {
                navigate('/edit-lesson')
                handleClose()
              }}
            >
              Edit lessons
            </MenuItem>
            {bookName && chapter && (
              <MenuItem
                onClick={() => {
                  navigate(`/edit-lesson/${bookName}/${chapter}`)
                  handleClose()
                }}
              >
                Edit {bookName} {chapter}
              </MenuItem>
            )}
            <MenuItem
              onClick={() => {
                navigate('/add-lesson')
                handleClose()
              }}
            >
              Add new lesson
            </MenuItem>
            <MenuItem
              onClick={() => {
                document.cookie = 'loggedIn=false'
                setIsAdmin(false)
                handleClose()
              }}
            >
              Logout
            </MenuItem>
          </Menu>
        </Stack>
      </Stack>
      <Link
        component={RouterLink}
        sx={{
          textAlign: 'center',
          p: 2,
          fontSize: { mobile: 40, tablet: 64 },
          textDecoration: 'none',
        }}
        to="/"
      >
        Sunday School Notes
      </Link>
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
      <BookAndChapterDialog
        open={bookSelectOpen}
        closeDialog={() => setBookSelectOpen(false)}
        fullScreen={matches}
      />
    </Stack>
  )
}
