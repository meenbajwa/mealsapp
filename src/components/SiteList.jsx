import { FiGlobe, FiLink, FiLayers, FiList } from 'react-icons/fi'
import greenChefLogo from '../assets/logos/gc_lg.avif'
import dinnerlyLogo from '../assets/logos/Dinnerly-Logo-e1659897424142.png'
import helloFreshLogo from '../assets/logos/Hello_Fresh_Lockup.webp'
import blueApronLogo from '../assets/logos/Blue_Apron_logo.svg.png'
import goodfoodLogo from '../assets/logos/0x0.png'
import styles from './SiteList.module.css'

const LOGO_MAP = {
  greenchef: greenChefLogo,
  dinnerly: dinnerlyLogo,
  hellofresh: helloFreshLogo,
  blueapron: blueApronLogo,
  goodfood: goodfoodLogo,
}

const normalizeKey = (value = '') => value.toString().toLowerCase().replace(/[^a-z0-9]/g, '')

function getLogoForSite(site) {
  const keyFromId = normalizeKey(site?.siteId || site?.primarySiteId)
  const keyFromName = normalizeKey(site?.displayName)
  return LOGO_MAP[keyFromId] || LOGO_MAP[keyFromName]
}

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
          const logo = getLogoForSite(site)
          return (
            <button
              key={site.siteId}
              className={`${styles.item} ${active ? styles.active : ''}`}
              onClick={() => onSelect(site.siteId)}
              type="button"
            >
              <div className={styles.imageWrap}>
                {logo ? (
                  <img className={styles.image} src={logo} alt={`${site.displayName} logo`} />
                ) : (
                  <div className={styles.imageFallback}>{site.displayName?.[0]?.toUpperCase() || '?'}</div>
                )}
                <span className={styles.mealCount}>{site.mealCount} meals</span>
              </div>
              <div className={styles.content}>
                <div className={styles.nameRow}>
                  <div className={styles.name}>{site.displayName}</div>
                  {(site.primarySiteId || site.siteId) && (
                    <span className={styles.siteId}>
                      <FiLayers /> {site.primarySiteId || site.siteId}
                    </span>
                  )}
                </div>
                <div className={styles.meta}>
                  <span className={styles.metaItem}>
                    <FiList /> {site.mealCount} meals indexed
                  </span>
                  {site.siteIds && site.siteIds.length > 1 && (
                    <span className={styles.metaItem}>{site.siteIds.length} sources</span>
                  )}
                </div>
                {site.sourcePage && (
                  <a
                    className={styles.link}
                    href={site.sourcePage}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <FiLink /> View site
                  </a>
                )}
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
