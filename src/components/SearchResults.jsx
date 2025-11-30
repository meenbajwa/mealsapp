import { FiAlertCircle, FiExternalLink, FiMapPin, FiLink2 } from 'react-icons/fi'
import greenChefLogo from '../assets/logos/gc_lg.avif'
import dinnerlyLogo from '../assets/logos/Dinnerly-Logo-e1659897424142.png'
import helloFreshLogo from '../assets/logos/Hello_Fresh_Lockup.webp'
import blueApronLogo from '../assets/logos/Blue_Apron_logo.svg.png'
import makeGoodLogo from '../assets/logos/gc_lg.avif'
import styles from './SearchResults.module.css'

const pick = (obj, keys) => keys.map((k) => obj?.[k]).find(Boolean)

const formatHost = (url = '') => {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch (e) {
    return ''
  }
}

const LOGO_MAP = {
  greenchef: greenChefLogo,
  dinnerly: dinnerlyLogo,
  hellofresh: helloFreshLogo,
  blueapron: blueApronLogo,
  makegood: makeGoodLogo,
}

const normalizeKey = (value = '') => value.toString().toLowerCase().replace(/[^a-z0-9]/g, '')

const getLogo = (item) => {
  const site = pick(item, ['siteName', 'site', 'domain']) || ''
  return LOGO_MAP[normalizeKey(site)]
}

function SearchResults({ results = [], loading, error }) {
  const hasResults = results && results.length > 0

  return (
    <div className={`card-surface ${styles.card}`}>
      <div className={styles.header}>
        <div>
          <p className={styles.kicker}>Results</p>
          <h3 className={styles.title}>Matches in your data</h3>
        </div>
        {loading && <span className={styles.badge}>Loading...</span>}
      </div>

      {error && (
        <div className={styles.error} role="alert" aria-live="assertive">
          <FiAlertCircle /> {error}
        </div>
      )}

      {!loading && !error && !hasResults && <p className={styles.empty}>No matches yet.</p>}

      {hasResults && (
        <div className={styles.list}>
          {results.map((item, idx) => {
            const title =
              pick(item, ['title', 'meal', 'name', 'word']) || pick(item, ['line', 'row']) || 'Match found'
            const description =
              pick(item, ['description', 'detail', 'subtitle', 'summary', 'text', 'content']) ||
              pick(item, ['line', 'row'])
            const sourceUrl = pick(item, ['sourcePage', 'url', 'link'])
            const site = pick(item, ['siteName', 'site', 'domain'])
            const category = pick(item, ['category', 'type', 'tag'])
            const host = sourceUrl ? formatHost(sourceUrl) : ''
            const logo = getLogo(item)

            return (
              <article key={item.id || item.word || idx} className={styles.item}>
                <div className={styles.itemTop}>
                  <div className={styles.itemMain}>
                    {logo && (
                      <div className={styles.logoWrap}>
                        <img src={logo} alt={`${site || 'Site'} logo`} />
                      </div>
                    )}
                    <h4 className={styles.itemTitle}>{title}</h4>
                    {description && <p className={styles.itemDesc}>{description}</p>}
                  </div>
                  <div className={styles.pills}>
                    {site && (
                      <span className={styles.pill}>
                        <FiMapPin /> {site}
                      </span>
                    )}
                    {category && (
                      <span className={styles.pillMuted}>
                        <FiLink2 /> {category}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.metaRow}>
                  {host && (
                    <span className={styles.host}>{host}</span>
                  )}
                  {sourceUrl && (
                    <a className={styles.source} href={sourceUrl} target="_blank" rel="noreferrer">
                      <FiExternalLink /> View source
                    </a>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SearchResults
