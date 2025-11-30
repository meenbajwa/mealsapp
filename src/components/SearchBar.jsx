import { FiSearch } from 'react-icons/fi'
import styles from './SearchBar.module.css'

function SearchBar({ value, onChange, placeholder = 'Search for paneer, dal, paratha...' }) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <p className={styles.label}>Search meals across multiple food sites</p>
        <span className={styles.hint}>Powered by live suggestions</span>
      </div>
      <div className={styles.card}>
        <FiSearch className={styles.icon} size={22} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          placeholder={placeholder}
          minLength={2}
          aria-label="Search for meals"
        />
      </div>
    </div>
  )
}

export default SearchBar
