import { List, ListItem, ListItemButton, ListItemText } from '@mui/material'
import ToggleColorMode from '../../ToggleColorMode'
import { useNavigate, useParams } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { auth } from '../../../api/firebase'

interface AdminListProps {
  handleClose: () => void
}

export default function AdminList({ handleClose }: AdminListProps) {
  const navigate = useNavigate()
  const { bookName = '', chapter = '' } = useParams()

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
            navigate('/edit-lesson')
            handleClose()
          }}
        >
          <ListItemText primary="Edit lessons" />
        </ListItemButton>
      </ListItem>
      {bookName && chapter && (
        <ListItem>
          <ListItemButton
            onClick={() => {
              navigate(`/edit-lesson/${bookName}/${chapter}`)
              handleClose()
            }}
          >
            <ListItemText primary={`Edit ${bookName} ${chapter}`} />
          </ListItemButton>
        </ListItem>
      )}
      <ListItem>
        <ListItemButton
          onClick={() => {
            navigate('/add-lesson')
            handleClose()
          }}
        >
          <ListItemText primary="Add new lesson" />
        </ListItemButton>
      </ListItem>
      <ListItem>
        <ListItemButton
          onClick={async () => {
            await signOut(auth)
            handleClose()
            navigate('/')
          }}
        >
          <ListItemText primary="Logout" />
        </ListItemButton>
      </ListItem>
    </List>
  )
}
