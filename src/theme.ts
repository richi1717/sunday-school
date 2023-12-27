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
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            background: {
              default: 'rgb(0, 30, 60)',
              paper: 'rgb(0, 30, 60)',
            },
            text: {
              primary: 'rgb(255, 255, 255)',
              secondary: grey[500],
            },
          }
        : {
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
