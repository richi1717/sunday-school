import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Page from './pages'
import { CssBaseline, ThemeProvider, useMediaQuery } from '@mui/material'
import myTheme from './theme'
import { ColorModeContext } from './components/ToggleColorMode'

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
    <>
      <ColorModeContext.Provider value={colorMode}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <CssBaseline />
            <Page />
          </QueryClientProvider>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </>
  )
}

export default App
