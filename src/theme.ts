import { createTheme } from '@mui/material/styles'
import { grey } from '@mui/material/colors'

declare module '@mui/material/styles' {
  interface BreakpointOverrides {
    xs: false // removes the `xs` breakpoint
    sm: false
    md: false
    lg: false
    xl: false
    mobile: true // adds the `mobile` breakpoint
    tablet: true
    desktop: true
  }
}

export default (mode: 'dark' | 'light' = 'dark') =>
  createTheme({
    typography: {
      fontFamily: [
        '-apple-system',
        'Inter',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    },
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            background: {
              default: '#0f1418',
            },
            text: {
              primary: 'rgb(255, 255, 255)',
              secondary: grey[500],
            },
            primary: { main: '#6e43a3' },
          }
        : {
            primary: { main: '#410060' },
            background: {
              default: grey[100],
              paper: grey[100],
            },
            text: {
              primary: grey[700],
              secondary: grey[500],
            },
          }),
    },
    breakpoints: {
      values: {
        mobile: 0,
        tablet: 640,
        desktop: 1024,
      },
    },
  })
