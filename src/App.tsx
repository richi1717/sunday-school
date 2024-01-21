import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, Stack, useMediaQuery } from '@mui/material'
import ThemeProvider from '@mui/material/styles/ThemeProvider'
import myTheme from './theme'
import { ColorModeContext } from './components/ToggleColorMode'
import { RouterProvider } from 'react-router-dom'
import Router from './Router'

const queryClient = new QueryClient()

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const [mode, setMode] = React.useState<'light' | 'dark'>(
    prefersDarkMode ? 'dark' : 'light',
  )

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
      },
    }),
    [],
  )
  const theme = React.useMemo(() => myTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
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
