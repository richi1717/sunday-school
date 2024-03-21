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
import Avatar from '@mui/material/Avatar'
import ChurchOutlinedIcon from '@mui/icons-material/ChurchOutlined'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import BookAndChapterDialog from './components/BookAndChapterDialog'
import { Link as RouterLink } from 'react-router-dom'
import { getCookie } from '../../utils/helpers'
import LoginDialog from './components/LoginDialog'
import Drawer from './components/Drawer'

interface HeaderProps {
  isAdmin: boolean
  setIsAdmin: (isAdmin: boolean) => void
}

export default function Header({ isAdmin, setIsAdmin }: HeaderProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [bookSelectOpen, setBookSelectOpen] = useState(false)
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('tablet'))
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const adminName = useMemo(() => {
    const cookieName = getCookie()

    return cookieName && cookieName !== 'false'
      ? cookieName.substring(0, 1).toUpperCase()
      : name.substring(0, 1).toUpperCase()
  }, [name])

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
                Book & Chapter
              </Button>
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
                setIsAdmin={() => setIsAdmin(false)}
                isAdmin={isAdmin}
              />
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      <LoginDialog
        setIsAdmin={setIsAdmin}
        name={name}
        setName={setName}
        open={open}
        closeDialog={() => setOpen(false)}
      />
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
