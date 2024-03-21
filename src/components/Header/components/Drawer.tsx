import {
  Box,
  Divider,
  Drawer as MuiDrawer,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import AdminList from './AdminList'
import NotAdminList from './NotAdminList'

interface DrawerProps {
  isAdmin: boolean
  setIsAdmin: () => void
  setOpen: () => void
  anchorEl: null | HTMLElement
  setAnchorEl: () => void
}

export default function Drawer({
  isAdmin,
  setIsAdmin,
  setOpen,
  anchorEl,
  setAnchorEl,
}: DrawerProps) {
  const isAdminOpen = Boolean(anchorEl)

  const handleClose = () => {
    setAnchorEl()
  }

  return (
    <MuiDrawer anchor="right" open={isAdminOpen} onClose={handleClose}>
      <Box
        sx={{
          width: { mobile: 1, tablet: 350 },
        }}
        role="presentation"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ p: 2 }}
        >
          <Typography sx={{ fontWeight: 500 }}>Settings</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        <Divider />
        {isAdmin ? (
          <AdminList handleClose={handleClose} setIsAdmin={setIsAdmin} />
        ) : (
          <NotAdminList setAnchorEl={setAnchorEl} setOpen={setOpen} />
        )}
      </Box>
    </MuiDrawer>
  )
}
