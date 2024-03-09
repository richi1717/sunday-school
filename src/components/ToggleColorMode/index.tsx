import * as React from 'react'
import IconButton from '@mui/joy/IconButton'
import Box from '@mui/joy/Box'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { Tooltip } from '@mui/joy'
import { useColorScheme } from '@mui/joy/styles'

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
})

function ToggleColorMode() {
  const { mode, setMode } = useColorScheme()

  return (
    <Box
      sx={{
        display: 'flex',
        width: 1,
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.primary',
        borderRadius: 1,
      }}
    >
      <Tooltip title={mode === 'dark' ? 'use light mode' : 'use dark mode'}>
        <IconButton
          sx={{ ml: 1 }}
          onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
        >
          {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Tooltip>
    </Box>
  )
}

export default ToggleColorMode
