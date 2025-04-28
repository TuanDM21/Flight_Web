import { useRegisterActions } from 'kbar'

const useThemeSwitching = () => {
  const themeAction = [
    {
      id: 'toggleTheme',
      name: 'Toggle Theme',
      shortcut: ['t', 't'],
      section: 'Theme',
    },
    {
      id: 'setLightTheme',
      name: 'Set Light Theme',
      section: 'Theme',
    },
    {
      id: 'setDarkTheme',
      name: 'Set Dark Theme',
      section: 'Theme',
    },
  ]

  useRegisterActions(themeAction)
}

export default useThemeSwitching
