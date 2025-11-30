import { useEffect, useState } from 'react'
import { FiTrendingUp, FiSearch } from 'react-icons/fi'
import { getTopSearches } from '../api/searchApi.js'
import styles from './TopSearches.module.css'

function TopSearches({ onSelect }) {
  const [top, setTop] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchTop = async () => {
      try {
        setLoading(true)
        const data = await getTopSearches()
        setTop(data || [])
        setError('')
      } catch (err) {
        setError('Could not load most searched words.')
      } finally {
        setLoading(false)
      }
    }
    fetchTop()
  }, [])

  return (
    <div className={`card-surface ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FiTrendingUp className={styles.icon} size={18} />
          <span className={styles.title}>Most searched</span>
        </div>
        {loading && <span className={styles.badge}>Loading...</span>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.chips}>
        {top.map((item) => (
          <button key={item.word} className={styles.chip} onClick={() => onSelect(item.word)} type="button">
            <div className={styles.chipLeft}>
              <FiSearch />
              <span>{item.word}</span>
            </div>
            <span className={styles.count}>{item.searchFrequency}x</span>
          </button>
        ))}
        {!loading && !error && top.length === 0 && <p className={styles.empty}>No searches yet.</p>}
      </div>
    </div>
  )
}

export default TopSearches
