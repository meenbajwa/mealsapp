import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { FiMenu, FiX } from 'react-icons/fi'
import styles from './Navbar.module.css'

const links = [
  { to: '/', label: 'Home' },
  { to: '/crawler', label: 'Crawler' },
  { to: '/sites', label: 'Food Meal Sites' },
  { to: '/about', label: 'About Us' },
]

function Navbar() {
  const [open, setOpen] = useState(false)

  const toggleMenu = () => setOpen((prev) => !prev)
  const closeMenu = () => setOpen(false)

  return (
    <header className={styles.navbar}>
      <div className={`container ${styles.navInner}`}>
        <div className={styles.brand} onClick={closeMenu}>
          <div className={styles.logoMark} />
          <span className={styles.logoText}>MealScout</span>
        </div>
        <button className={styles.menuButton} onClick={toggleMenu} aria-label="Toggle navigation">
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
        <nav className={`${styles.links} ${open ? styles.linksOpen : ''}`}>
          {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
            onClick={closeMenu}
          >
            {link.label}
          </NavLink>
        ))}
        </nav>
      </div>
    </header>
  )
}

export default Navbar
