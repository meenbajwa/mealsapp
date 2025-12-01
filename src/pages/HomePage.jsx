import { useEffect, useState } from 'react'
import { FiSunrise, FiShield, FiTrendingUp } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import SuggestionsPanel from '../components/SuggestionsPanel.jsx'
import TopSearches from '../components/TopSearches.jsx'
import { getSuggestions, recordSearchHit } from '../api/searchApi.js'
import styles from './HomePage.module.css'

const DEBOUNCE_MS = 450
const MIN_QUERY_LENGTH = 2

function HomePage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [spellCheck, setSpellCheck] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSuggestions([])
      setSpellCheck(null)
      setError('')
      setLoading(false)
      return undefined
    }

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setSuggestions([])
      setSpellCheck(null)
      setError(`Enter at least ${MIN_QUERY_LENGTH} characters to search.`)
      setLoading(false)
      return undefined
    }

    setError('')

    const handle = setTimeout(async () => {
      try {
        setLoading(true)
        const data = await getSuggestions(trimmedQuery)
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
    const trimmed = (value || '').trim()
    setQuery(trimmed)
    if (trimmed.length >= MIN_QUERY_LENGTH) {
      recordSearchHit(trimmed).catch(() => {})
      navigate(`/search?q=${encodeURIComponent(trimmed)}`)
    }
  }

  const submitSearch = (value) => {
    const trimmed = (value || '').trim()
    if (!trimmed || trimmed.length < MIN_QUERY_LENGTH) {
      setError(`Enter at least ${MIN_QUERY_LENGTH} characters to search.`)
      return
    }
    recordSearchHit(trimmed).catch(() => {})
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
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
          <SearchBar value={query} onChange={setQuery} onSubmit={submitSearch} />
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
