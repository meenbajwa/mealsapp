import { useEffect, useState } from 'react'
import { FiSunrise, FiShield, FiTrendingUp } from 'react-icons/fi'
import SearchBar from '../components/SearchBar.jsx'
import SuggestionsPanel from '../components/SuggestionsPanel.jsx'
import TopSearches from '../components/TopSearches.jsx'
import { getSuggestions } from '../api/searchApi.js'
import styles from './HomePage.module.css'

const DEBOUNCE_MS = 450

function HomePage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [spellCheck, setSpellCheck] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([])
      setSpellCheck(null)
      setError('')
      return undefined
    }

    const handle = setTimeout(async () => {
      try {
        setLoading(true)
        const data = await getSuggestions(query.trim())
        setSuggestions(data?.suggestions || [])
        setSpellCheck(data?.spellCheck || null)
        setError('')
      } catch (err) {
        setError('Unable to load suggestions right now.')
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => clearTimeout(handle)
  }, [query])

  const applySuggestion = (value) => {
    setQuery(value)
  }

  return (
    <div className={styles.page}>
      <section className={`card-surface ${styles.hero}`}>
        <div className={styles.heroText}>
          <div className={styles.heroBadge}>
            <FiSunrise />
            Smart meal discovery
          </div>
          <h1 className={styles.title}>Search meals across multiple food sites</h1>
          <p className={styles.subtitle}>
            Type what you are craving and we will surface spell-checked suggestions, live search stats, and trending
            picks from the crawled meal sites.
          </p>
          <div className={styles.heroMeta}>
            <span>
              <FiShield /> API backed
            </span>
            <span>
              <FiTrendingUp /> Real usage data
            </span>
          </div>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroBubble}>
            <span>🍲</span>
            <span>🥗</span>
            <span>🥘</span>
          </div>
          <div className={styles.heroCard}>
            <p className={styles.heroCardTitle}>Live stats</p>
            <div className={styles.heroStats}>
              <div>
                <p className={styles.heroStatNumber}>+3K</p>
                <p className={styles.heroStatLabel}>meals indexed</p>
              </div>
              <div>
                <p className={styles.heroStatNumber}>140</p>
                <p className={styles.heroStatLabel}>searches today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.layout}>
        <div className={styles.left}>
          <SearchBar value={query} onChange={setQuery} />
          <SuggestionsPanel
            loading={loading}
            spellCheck={spellCheck}
            suggestions={suggestions}
            query={query}
            error={error}
            onApplySpell={applySuggestion}
            onSelectSuggestion={applySuggestion}
          />
        </div>
        <div className={styles.right}>
          <TopSearches onSelect={applySuggestion} />
        </div>
      </section>
    </div>
  )
}

export default HomePage
