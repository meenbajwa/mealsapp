import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FiSearch } from 'react-icons/fi'
import SearchResults from '../components/SearchResults.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { getSearchResults, recordSearchHit } from '../api/searchApi.js'
import styles from './SearchResultsPage.module.css'

const MIN_QUERY_LENGTH = 2

function SearchResultsPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(params.get('q') || '')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setQuery(params.get('q') || '')
  }, [params])

  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed || trimmed.length < MIN_QUERY_LENGTH) {
      setResults([])
      setError(trimmed ? `Enter at least ${MIN_QUERY_LENGTH} characters.` : '')
      setLoading(false)
      return
    }

    const fetchResults = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await getSearchResults(trimmed)
        setResults(Array.isArray(data) ? data : data?.matches || [])
      } catch (err) {
        setResults([])
        setError('Unable to load results right now.')
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  const goSearch = (value) => {
    const trimmed = (value || '').trim()
    if (!trimmed) return
    recordSearchHit(trimmed).catch(() => {})
    navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <div className={styles.page}>
      <section className={`card-surface ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Search results</p>
          <h1 className={styles.title}>
            <FiSearch /> Showing matches for &quot;{query}&quot;
          </h1>
          <p className={styles.subtitle}>Click results to view their source pages.</p>
        </div>
        <div className={styles.searchBox}>
          <SearchBar value={query} onChange={setQuery} onSubmit={goSearch} placeholder="Search again..." />
        </div>
      </section>

      <SearchResults results={results} loading={loading} error={error} />
    </div>
  )
}

export default SearchResultsPage
