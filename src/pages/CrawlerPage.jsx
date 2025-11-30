import { useMemo, useState } from 'react'
import { FiCopy, FiExternalLink, FiLoader, FiSend, FiAlertCircle, FiCheck } from 'react-icons/fi'
import client from '../api/client.js'
import styles from './CrawlerPage.module.css'

const dedupe = (items = []) => Array.from(new Set((items || []).filter(Boolean)))

const normalizeUrl = (value = '') => {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
}

const isValidUrl = (value = '') => {
  try {
    const url = new URL(value)
    const host = url.hostname
    if (!host || host.includes(' ')) return false
    if (!host.includes('.')) return false
    const tld = host.split('.').pop()
    if (!tld || tld.length < 2) return false
    return true
  } catch (e) {
    return false
  }
}

const getErrorMessage = (err) => {
  const apiMessage = err?.response?.data?.message || err?.response?.data?.error || err?.response?.data?.detail
  if (err?.response?.status === 400) {
    return apiMessage || 'That URL is not valid for crawling.'
  }
  if (apiMessage) return apiMessage
  return 'Unable to crawl that page right now. Please try again.'
}

function ResultCard({ title, items = [] }) {
  return (
    <div className={`card-surface ${styles.resultCard}`}>
      <div className={styles.resultHeader}>
        <h3>{title}</h3>
        <span className={styles.count}>{items.length} found</span>
      </div>
      {items.length === 0 ? (
        <p className={styles.empty}>None found</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item} className={styles.listItem}>
              <span className={styles.itemText}>{item}</span>
              <CopyButton value={item} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch (e) {
      // ignore
    }
  }

  return (
    <button className={styles.copyButton} onClick={handleCopy} aria-label="Copy to clipboard">
      {copied ? <FiCheck /> : <FiCopy />}
    </button>
  )
}

function CrawlerPage() {
  const [urlInput, setUrlInput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState({ emails: [], phones: [], links: [] })

  const hasResult = useMemo(
    () => result.emails.length || result.phones.length || result.links.length,
    [result.emails.length, result.phones.length, result.links.length],
  )

  const handleSubmit = async (e) => {
    e.preventDefault()
    const normalized = normalizeUrl(urlInput)
    if (!normalized) {
      setError('Enter a URL to crawl.')
      return
    }
    if (!isValidUrl(normalized)) {
      setError('Enter a valid URL (e.g., example.com).')
      return
    }

    setLoading(true)
    setError('')
    try {
      const encodedUrl = encodeURIComponent(normalized)
      const response = await client.get(`/api/crawl/page?url=${encodedUrl}`)
      const data = response.data || {}
      setResult({
        emails: dedupe(data.emails || data.emailAddresses || []),
        phones: dedupe(data.phones || data.phoneNumbers || []),
        links: dedupe(data.links || data.urls || []),
      })
    } catch (err) {
      setResult({ emails: [], phones: [], links: [] })
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.page}>
      <section className={`card-surface ${styles.hero}`}>
        <div>
          <p className={styles.kicker}>Crawler</p>
          <h1 className={styles.title}>Pull emails, phones, and links from any page</h1>
          <p className={styles.subtitle}>Paste a URL to extract emails, phone numbers, and outbound links automatically.</p>
        </div>
        <div className={styles.accentBadge}>
          <FiExternalLink /> Live fetch
        </div>
      </section>

      <section className={styles.controlCard}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.inputWrap}>
            <input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/contact"
              className={styles.input}
              aria-label="Page URL to crawl"
            />
            <button className={styles.submit} type="submit" disabled={loading}>
              {loading ? (
                <>
                  <FiLoader className={styles.spin} /> Crawling...
                </>
              ) : (
                <>
                  <FiSend /> Crawl
                </>
              )}
            </button>
          </div>
        </form>
        {error && (
          <div className={styles.error} role="alert" aria-live="assertive">
            <FiAlertCircle /> {error}
          </div>
        )}
      </section>

      <section className={styles.resultsSection}>
        {hasResult ? (
          <div className={styles.grid}>
            <ResultCard title="Emails" items={result.emails} />
            <ResultCard title="Phone Numbers" items={result.phones} />
            <ResultCard title="Links" items={result.links} />
          </div>
        ) : (
          <div className={styles.placeholder}>
            <p>No results yet. Submit a URL to see what we find.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default CrawlerPage
