import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, Stack } from '@mui/joy'
// import ThemeProvider from '@mui/material/styles/ThemeProvider'
import { CssVarsProvider } from '@mui/joy/styles'
import theme from './theme'
import { RouterProvider } from 'react-router-dom'
import Router from './Router'
import '@fontsource/inter'

const queryClient = new QueryClient()

function App() {
  return (
    <CssVarsProvider
      theme={theme}
      defaultMode="system"
      modeStorageKey="demo_identify-system-mode"
      disableNestedContext
    >
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <Stack sx={{ width: 1, height: '100vh' }}>
          <RouterProvider router={Router} />
        </Stack>
      </QueryClientProvider>
    </CssVarsProvider>
  )
}

export default App
