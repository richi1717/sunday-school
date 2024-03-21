import React, { useCallback } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import { Stack, useMediaQuery } from '@mui/material'
import myTheme from './theme'
import { ColorModeContext, Mode } from './components/ToggleColorMode'
import { RouterProvider } from 'react-router-dom'
import Router from './Router'
import '@fontsource/inter'

const queryClient = new QueryClient()

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = React.useState<Mode>(
    prefersDarkMode ? 'dark' : 'light',
  )

  const setColorMode = useCallback((mode: Mode) => setMode(mode), [setMode])

  const contextValue = React.useMemo(
    () => ({ mode, setColorMode }),
    [mode, setColorMode],
  )
  const theme = React.useMemo(() => {
    if (mode === 'system') {
      return myTheme(prefersDarkMode ? 'dark' : 'light')
    }

    return myTheme(mode)
  }, [mode, prefersDarkMode])

  return (
    <ColorModeContext.Provider value={contextValue}>
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <CssBaseline />
          <Stack sx={{ width: 1, height: '100vh' }}>
            <RouterProvider router={Router} />
          </Stack>
        </QueryClientProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
