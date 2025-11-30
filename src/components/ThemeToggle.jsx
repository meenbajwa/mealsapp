import { useEffect, useState } from 'react'
import { FiMoon, FiSun } from 'react-icons/fi'
import styles from './ThemeToggle.module.css'

const THEME_KEY = 'mealsapp-theme'

function ThemeToggle() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    const stored = localStorage.getItem(THEME_KEY)
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored || (prefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
  }, [])

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    localStorage.setItem(THEME_KEY, next)
  }

  return (
    <button className={styles.toggle} onClick={toggle} aria-label="Toggle theme">
      <span className={styles.thumb}>{theme === 'light' ? <FiSun /> : <FiMoon />}</span>
      <span className={styles.label}>{theme === 'light' ? 'Light' : 'Dark'}</span>
    </button>
  )
}

export default ThemeToggle
