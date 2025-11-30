import { FiGlobe, FiLink, FiLayers, FiList } from 'react-icons/fi'
import styles from './SiteList.module.css'

function SiteList({ sites, selectedSiteId, onSelect, loading, error }) {
  return (
    <div className={`card-surface ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FiGlobe className={styles.icon} size={18} />
          <span className={styles.title}>Sites</span>
        </div>
        {loading && <span className={styles.badge}>Loading...</span>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.list}>
        {sites.map((site) => {
          const active = site.siteId === selectedSiteId
          return (
            <button
              key={site.siteId}
              className={`${styles.item} ${active ? styles.active : ''}`}
              onClick={() => onSelect(site.siteId)}
              type="button"
            >
              <div className={styles.itemTop}>
                <span className={styles.dot} />
                <div>
                  <div className={styles.name}>{site.displayName}</div>
                  <a
                    className={styles.link}
                    href={site.sourcePage}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiLink /> {site.sourcePage}
                  </a>
                </div>
              </div>
              <div className={styles.meta}>
                <span className={styles.metaItem}>
                  <FiLayers /> {site.siteId}
                </span>
                <span className={styles.metaItem}>
                  <FiList /> {site.mealCount} meals
                </span>
              </div>
            </button>
          )
        })}
        {!loading && !error && sites.length === 0 && <p className={styles.empty}>No sites available.</p>}
      </div>
    </div>
  )
}

export default SiteList
