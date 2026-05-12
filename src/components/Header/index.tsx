import { useMemo, useState } from 'react'
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
} from '@mui/material'
import { deepPurple } from '@mui/material/colors'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import SearchIcon from '@mui/icons-material/Search'
import Avatar from '@mui/material/Avatar'
import ChurchOutlinedIcon from '@mui/icons-material/ChurchOutlined'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import BookAndChapterDialog from './components/BookAndChapterDialog'
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import LoginDialog from './components/LoginDialog'
import Drawer from './components/Drawer'

interface HeaderProps {
  isAdmin: boolean
}

export default function Header({ isAdmin }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [bookSelectOpen, setBookSelectOpen] = useState(false)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('tablet'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { bookName: currentBook, chapter: currentChapter } = useParams()
  const { user } = useAuth()

  const adminName = useMemo(() => {
    const email = user?.email ?? ''
    return email.charAt(0).toUpperCase()
  }, [user])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  return (
    <Stack
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      mt={{ mobile: 8, tablet: 9 }}
    >
      <AppBar position="fixed">
        <Container>
          <Toolbar disableGutters>
            <Stack direction="row" alignItems="center" sx={{ flexGrow: 1 }}>
              <IconButton LinkComponent={RouterLink} href="/">
                <ChurchOutlinedIcon sx={{ color: 'common.white' }} />
              </IconButton>
              <Button
                sx={{
                  textTransform: 'none',
                  p: 2,
                  color: 'common.white',
                }}
                onClick={() => setBookSelectOpen(true)}
              >
                {currentBook && currentChapter
                  ? `${currentBook} ${currentChapter} ▾`
                  : 'Book & Chapter'}
              </Button>
              <IconButton
                sx={{ color: 'common.white' }}
                onClick={() => navigate('/search')}
              >
                <SearchIcon />
              </IconButton>
            </Stack>
            <Stack direction="row" flexGrow={0}>
              <IconButton
                sx={{
                  textTransform: 'none',
                  p: 2,
                  color: 'common.white',
                }}
                onClick={handleClick}
              >
                {isAdmin ? (
                  <Avatar
                    sx={{
                      bgcolor: deepPurple[500],
                      width: { mobile: 30, tablet: 40 },
                      height: { mobile: 30, tablet: 40 },
                    }}
                  >
                    {adminName}
                  </Avatar>
                ) : (
                  <AccountCircleIcon
                    sx={{
                      width: { mobile: 30, tablet: 40 },
                      height: { mobile: 30, tablet: 40 },
                    }}
                  />
                )}
              </IconButton>
              <Drawer
                anchorEl={anchorEl}
                setAnchorEl={() => setAnchorEl(null)}
                setOpen={() => setOpen(true)}
                isAdmin={isAdmin}
              />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <LoginDialog open={open} closeDialog={() => setOpen(false)} />
      {bookSelectOpen && (
        <BookAndChapterDialog
          open={bookSelectOpen}
          closeDialog={() => setBookSelectOpen(false)}
          fullScreen={matches}
        />
      )}
    </Stack>
  )
}
