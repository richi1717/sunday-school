import * as React from 'react'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

export type Mode = 'dark' | 'light' | 'system'

type ColorModeContextProps = {
  mode: Mode
  setColorMode: (mode: Mode) => void
}

export const ColorModeContext = React.createContext<ColorModeContextProps>(
  {} as ColorModeContextProps,
)

function ToggleColorMode() {
  const { mode, setColorMode } = React.useContext(ColorModeContext)

  const handleChange = (
    _: React.MouseEvent<HTMLElement>,
    newMode: 'light' | 'dark' | 'system',
  ) => {
    newMode && setColorMode(newMode)
  }

  return (
    <ToggleButtonGroup
      color="primary"
      value={mode}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton value="light" sx={{ textTransform: 'none' }}>
        <LightModeIcon sx={{ mr: 1 }} />
        Light
      </ToggleButton>
      <ToggleButton value="system" sx={{ textTransform: 'none' }}>
        <SettingsBrightnessIcon sx={{ mr: 1 }} />
        System
      </ToggleButton>
      <ToggleButton value="dark" sx={{ textTransform: 'none' }}>
        <DarkModeIcon sx={{ mr: 1 }} />
        Dark
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default ToggleColorMode
