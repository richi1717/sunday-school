import { extendTheme } from '@mui/joy/styles'

declare module '@mui/joy/styles' {
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

const color = {
  paper: '#ffffff',
  primaryLight: '#eef2f6',
  primary200: '#90caf9',
  primaryMain: '#2196f3',
  primaryDark: '#1e88e5',
  primary800: '#1565c0',
  secondaryLight: '#ede7f6',
  secondary200: '#b39ddb',
  secondaryMain: '#673ab7',
  secondaryDark: '#5e35b1',
  secondary800: '#4527a0',
  successLight: '#b9f6ca',
  success200: '#69f0ae',
  successMain: '#00e676',
  successDark: '#00c853',
  errorLight: '#ef9a9a',
  errorMain: '#f44336',
  errorDark: '#c62828',
  orangeLight: '#fbe9e7',
  orangeMain: '#ffab91',
  orangeDark: '#d84315',
  warningLight: '#fff8e1',
  warningMain: '#ffe57f',
  warningDark: '#ffc107',
  grey50: '#F8FAFC',
  grey100: '#EEF2F6',
  grey200: '#E3E8EF',
  grey300: '#CDD5DF',
  grey500: '#697586',
  grey600: '#4B5565',
  grey700: '#364152',
  grey900: '#121926',
  darkPaper: '#111936',
  darkBackground: '#1a223f',
  darkLevel1: '#29314f',
  darkLevel2: '#212946',
  darkTextTitle: '#d7dcec',
  darkTextPrimary: '#bdc8f0',
  darkTextSecondary: '#8492c4',
  darkPrimaryLight: '#eef2f6',
  darkPrimaryMain: '#2196f3',
  darkPrimaryDark: '#1e88e5',
  darkPrimary200: '#90caf9',
  darkPrimary800: '#1565c0',
  darkSecondaryLight: '#d1c4e9',
  darkSecondaryMain: '#7c4dff',
  darkSecondaryDark: '#651fff',
  darkSecondary200: '#b39ddb',
  darkSecondary800: '#6200ea',
}

const themePalette = {
  common: {
    black: color.darkPaper,
  },
  primary: {
    light: color.primaryLight,
    main: color.primaryMain,
    dark: color.primaryDark,
    200: color.primary200,
    800: color.primary800,
  },
  secondary: {
    light: color.secondaryLight,
    main: color.secondaryMain,
    dark: color.secondaryDark,
    200: color.secondary200,
    800: color.secondary800,
  },
  error: {
    light: color.errorLight,
    main: color.errorMain,
    dark: color.errorDark,
  },
  orange: {
    light: color.orangeLight,
    main: color.orangeMain,
    dark: color.orangeDark,
  },
  warning: {
    light: color.warningLight,
    main: color.warningMain,
    dark: color.warningDark,
  },
  success: {
    light: color.successLight,
    200: color.success200,
    main: color.successMain,
    dark: color.successDark,
  },
  grey: {
    50: color.grey50,
    100: color.grey100,
    500: color.grey500,
    600: color.grey900,
    700: color.grey700,
    900: color.grey900,
  },
  dark: {
    light: color.darkTextPrimary,
    main: color.darkLevel1,
    dark: color.darkLevel2,
    800: color.darkBackground,
    900: color.darkPaper,
  },
  text: {
    primary: color.grey700,
    secondary: color.grey500,
    dark: color.grey900,
    hint: color.grey100,
  },
  background: {
    paper: color.paper,
    body: color.paper,
  },
}

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        background: {
          body: '#0d1118',
        },
        // primary: themePalette.primary,
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#6b21a8',
          900: '#581c87',
        },
        // success: themePalette.success,
        success: {
          solidBg: '#2DA44E',
          solidHoverBg: '#2C974B',
          solidActiveBg: '#298E46',
        },
        neutral: {
          outlinedBg: '#F6F8FA',
          outlinedHoverBg: '#F3F4F6',
          outlinedActiveBg: 'rgba(238, 239, 242, 1)',
          outlinedBorder: 'rgba(27, 31, 36, 0.15)',
        },
        focusVisible: 'rgba(3, 102, 214, 0.3)',
      },
    },
    light: {
      palette: {
        background: {
          body: '#dbdfe0',
        },
        success: {
          solidBg: '#2DA44E',
          solidHoverBg: '#2C974B',
          solidActiveBg: '#298E46',
        },
        focusVisible: 'rgba(3, 102, 214, 0.3)',
      },
    },
  },
  focus: {
    default: {
      outlineWidth: '3px',
    },
  },
  breakpoints: {
    values: {
      mobile: 0,
      tablet: 640,
      desktop: 1024,
    },
  },
  // fontFamily: {
  //   body: 'SF Pro Text, var(--gh-fontFamily-fallback)',
  // },
  // components: {
  //   JoyButton: {
  //     styleOverrides: {
  //       root: ({ ownerState }) => ({
  //         borderRadius: '6px',
  //         boxShadow: '0 1px 0 0 rgba(27, 31, 35, 0.04)',
  //         transition: '80ms cubic-bezier(0.33, 1, 0.68, 1)',
  //         transitionProperty: 'color,background-color,box-shadow,border-color',
  //         ...(ownerState.size === 'md' && {
  //           fontWeight: 600,
  //           minHeight: '32px',
  //           fontSize: '14px',
  //           '--Button-paddingInline': '1rem',
  //         }),
  //         ...(ownerState.color === 'success' &&
  //           ownerState.variant === 'solid' && {
  //             '--gh-palette-focusVisible': 'rgba(46, 164, 79, 0.4)',
  //             border: '1px solid rgba(27, 31, 36, 0.15)',
  //             '&:active': {
  //               boxShadow: 'inset 0px 1px 0px rgba(20, 70, 32, 0.2)',
  //             },
  //           }),
  //         ...(ownerState.color === 'neutral' &&
  //           ownerState.variant === 'outlined' && {
  //             '&:active': {
  //               boxShadow: 'none',
  //             },
  //           }),
  //       }),
  //     },
  //   },
  // },
})

export default theme
