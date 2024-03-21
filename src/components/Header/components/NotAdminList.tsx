import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import ToggleColorMode from '../../ToggleColorMode'

interface NotAdminListProps {
  setOpen: () => void
  setAnchorEl: () => void
}

export default function NotAdminList({
  setOpen,
  setAnchorEl,
}: NotAdminListProps) {
  return (
    <List sx={{ p: 0 }}>
      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        <ListItemText
          sx={{
            textTransform: 'uppercase',
            '& .MuiTypography-root': { fontSize: '0.75rem' },
          }}
        >
          Mode
        </ListItemText>
        <ToggleColorMode />
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={() => {
            setOpen()
            setAnchorEl()
          }}
        >
          <ListItemText primary="Login" />
        </ListItemButton>
      </ListItem>
    </List>
  )
}
