import { useCallback, useMemo, useState } from 'react'
import { capitalize } from '@mui/material'
import {
  Alert,
  Button,
  Modal,
  DialogActions,
  DialogContent,
  DialogTitle,
  Link,
  Dropdown,
  MenuItem,
  Stack,
  Input,
  Menu,
  ModalDialog,
  ModalClose,
  MenuButton,
  FormControl,
  FormLabel,
} from '@mui/joy'
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
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [bookSelectOpen, setBookSelectOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('tablet'))

  const adminName = useMemo(() => {
    const cookieName = getCookie()

    return cookieName && cookieName !== 'false'
      ? capitalize(cookieName)
      : capitalize(name)
  }, [name])

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

  const handleClick = useCallback(
    (_: React.SyntheticEvent | null, isOpen: boolean) => {
      if (isAdmin) {
        setIsAdminOpen(isOpen)
      } else {
        setOpen(isOpen)
      }
    },
    [isAdmin],
  )

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="center"
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        width={1}
        sx={{ background: (theme) => theme.palette.primary[400] }}
      >
        <Button
          sx={{ textTransform: 'none', p: 2 }}
          onClick={() => setBookSelectOpen(true)}
          variant="plain"
        >
          Book & Chapter
        </Button>
        <Stack direction="row" p={2}>
          <ToggleColorMode />
          <Dropdown open={isAdminOpen} onOpenChange={handleClick}>
            <MenuButton variant="plain">
              {isAdmin ? adminName : 'Login'}
            </MenuButton>
            <Menu variant="soft">
              <MenuItem
                onClick={() => {
                  navigate('/edit-lesson')
                  setIsAdminOpen(false)
                }}
              >
                Edit lessons
              </MenuItem>
              {bookName && chapter && (
                <MenuItem
                  onClick={() => {
                    navigate(`/edit-lesson/${bookName}/${chapter}`)
                    setIsAdminOpen(false)
                  }}
                >
                  Edit {bookName} {chapter}
                </MenuItem>
              )}
              <MenuItem
                onClick={() => {
                  navigate('/add-lesson')
                  setIsAdminOpen(false)
                }}
              >
                Add new lesson
              </MenuItem>
              <MenuItem
                onClick={() => {
                  document.cookie = 'loggedIn=false'
                  setIsAdmin(false)
                  setIsAdminOpen(false)
                  navigate('/')
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Dropdown>
        </Stack>
      </Stack>
      <Link
        component={RouterLink}
        level="h1"
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
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog layout="center">
          <DialogTitle
            sx={{ textAlign: 'center', fontSize: { mobile: 30, tablet: 44 } }}
          >
            Login to edit
            <ModalClose />
          </DialogTitle>
          {error && (
            <Alert color="danger" sx={{ mx: 3 }}>
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
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                  variant="soft"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Password</FormLabel>
                <Input
                  variant="soft"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <DialogActions sx={{ p: 0 }}>
                <Button
                  type="submit"
                  sx={{ textTransform: 'none', width: 1 }}
                  variant="soft"
                >
                  Login
                </Button>
              </DialogActions>
            </Stack>
          </DialogContent>
        </ModalDialog>
      </Modal>
      <BookAndChapterDialog
        open={bookSelectOpen}
        closeDialog={() => setBookSelectOpen(false)}
        fullScreen={matches}
      />
    </Stack>
  )
}
