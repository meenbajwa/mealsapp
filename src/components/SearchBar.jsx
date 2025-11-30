import { FiSearch } from 'react-icons/fi'
import styles from './SearchBar.module.css'

function SearchBar({ value, onChange, onSubmit, placeholder = 'Search for paneer, dal, paratha...' }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit?.(value)
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.labelRow}>
        <p className={styles.label}>Search meals across multiple food sites</p>
        <span className={styles.hint}>Powered by live suggestions</span>
      </div>
      <form className={styles.card} onSubmit={handleSubmit}>
        <FiSearch className={styles.icon} size={22} />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={styles.input}
          placeholder={placeholder}
          minLength={2}
          aria-label="Search for meals"
        />
        <button type="submit" className={styles.submit}>
          Search
        </button>
      </form>
    </div>
  )
}

export default SearchBar
