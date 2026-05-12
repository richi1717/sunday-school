import { useState } from 'react'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { signInWithPopup, signOut, GoogleAuthProvider } from 'firebase/auth'
import { auth } from '../../../api/firebase'

const provider = new GoogleAuthProvider()

const allowedEmails = (import.meta.env.VITE_ALLOWED_EMAILS as string)
  ?.split(',')
  .map((email) => email.trim().toLowerCase()) ?? []

interface LoginDialogProps {
  open: boolean
  closeDialog: () => void
}

export default function LoginDialog({ closeDialog, open }: LoginDialogProps) {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      if (!allowedEmails.includes(result.user.email?.toLowerCase() ?? '')) {
        await signOut(auth)
        setError('This account doesn\'t have edit access.')
        return
      }
      closeDialog()
    } catch {
      setError('Sign-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onClose={closeDialog} PaperProps={{ sx: { width: 320 } }}>
      <IconButton
        aria-label="close"
        onClick={closeDialog}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent>
        <Stack spacing={3} alignItems="center" sx={{ pt: 2, pb: 1 }}>
          <Stack spacing={0.5} alignItems="center">
            <Typography variant="h2" sx={{ fontSize: 22, fontWeight: 600 }}>
              Admin sign-in
            </Typography>
            <Typography variant="body2" color="text.secondary">
              For lesson editing only
            </Typography>
          </Stack>
          {error && <Alert severity="error" sx={{ width: 1 }}>{error}</Alert>}
          <Button
            onClick={handleGoogleSignIn}
            disabled={loading}
            variant="outlined"
            fullWidth
            sx={{ textTransform: 'none', py: 1.5 }}
            startIcon={
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt=""
                width={18}
                height={18}
              />
            }
          >
            {loading ? 'Signing in…' : 'Sign in with Google'}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  )
}
