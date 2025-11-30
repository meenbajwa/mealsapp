import { useEffect, useMemo, useState } from 'react'
import { FiMapPin } from 'react-icons/fi'
import SiteList from '../components/SiteList.jsx'
import MealsGrid from '../components/MealsGrid.jsx'
import { getSites, getMealsForSite } from '../api/sitesApi.js'
import styles from './SitesPage.module.css'

function SitesPage() {
  const [sites, setSites] = useState([])
  const [selectedSiteId, setSelectedSiteId] = useState('')
  const [meals, setMeals] = useState([])
  const [loadingSites, setLoadingSites] = useState(false)
  const [loadingMeals, setLoadingMeals] = useState(false)
  const [siteError, setSiteError] = useState('')
  const [mealError, setMealError] = useState('')

  const SITE_ALIASES = [
    { key: 'hellofresh', name: 'HelloFresh', patterns: ['hellofresh', 'hello-fresh'] },
    { key: 'greenchef', name: 'GreenChef', patterns: ['greenchef', 'green-chef', 'green chef'] },
    { key: 'dinnerly', name: 'Dinnerly', patterns: ['dinnerly'] },
    { key: 'blueapron', name: 'Blue Apron', patterns: ['blueapron', 'blue-apron', 'blue apron'] },
    { key: 'makegood', name: 'MakeGood', patterns: ['makegood', 'make-good', 'make good', 'makeforgood', 'make-for-good'] },
  ]

  const normalizeKey = (value = '') => value.toString().toLowerCase().replace(/[^a-z0-9]/g, '')

  const humanize = (value = '') =>
    value
      .replace(/[_\-]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (c) => c.toUpperCase())

  const parseHost = (urlString = '') => {
    try {
      const url = new URL(urlString)
      const host = url.hostname.replace(/^www\./, '')
      const domainBase = host.split('.')[0]
      return { host, domainBase }
    } catch (e) {
      return { host: '', domainBase: '' }
    }
  }

  const deriveName = (site = {}) => {
    const trimmedDisplay = (site.displayName || '').trim()
    if (trimmedDisplay) return trimmedDisplay

    const trimmedId = (site.siteId || '').trim()
    if (trimmedId) return humanize(trimmedId)

    const { host, domainBase } = parseHost(site.sourcePage)
    if (domainBase) return humanize(domainBase)
    if (host) return humanize(host)

    if (site.sourcePage) return humanize(site.sourcePage)

    return ''
  }

  const findAlias = (combined = '') => {
    const lower = combined.toLowerCase()
    return SITE_ALIASES.find((alias) => alias.patterns.some((p) => lower.includes(p)))
  }

  const getCanonicalInfo = (site = {}) => {
    const { host, domainBase } = parseHost(site.sourcePage)
    const combined = [
      site.displayName || '',
      site.siteId || '',
      site.sourcePage || '',
      host || '',
      domainBase || '',
    ].join(' ')

    const alias = findAlias(combined)
    if (alias) {
      return {
        key: alias.key,
        name: alias.name,
        aliasHit: true,
      }
    }

    const name = deriveName(site)
    const key =
      normalizeKey(name) ||
      normalizeKey(site?.displayName) ||
      normalizeKey(domainBase) ||
      normalizeKey(host) ||
      normalizeKey(site?.siteId) ||
      (site?.sourcePage ? normalizeKey(site.sourcePage) : '')

    if (!key || !name) {
      return { key: '', name: '', aliasHit: false }
    }

    return {
      key,
      name,
      aliasHit: false,
    }
  }

  const groupSites = (list = []) => {
    const map = new Map()
    list.forEach((site) => {
      const { key, name } = getCanonicalInfo(site)
      if (!key || !name) return

      if (!map.has(key)) {
        map.set(key, {
          siteId: key,
          displayName: name,
          mealCount: 0,
          sourcePage: site?.sourcePage,
          siteIds: [],
          primarySiteId: site?.siteId,
        })
      }

      const entry = map.get(key)
      entry.mealCount += site?.mealCount || 0
      entry.sourcePage = entry.sourcePage || site?.sourcePage
      if (site?.siteId) {
        entry.siteIds = Array.from(new Set([...(entry.siteIds || []), site.siteId]))
      }
      entry.primarySiteId = entry.primarySiteId || site?.siteId
    })

    return Array.from(map.values()).sort((a, b) => (b.mealCount || 0) - (a.mealCount || 0))
  }

  const totalMeals = useMemo(() => sites.reduce((sum, site) => sum + (site.mealCount || 0), 0), [sites])

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoadingSites(true)
        const data = await getSites()
        const uniqueSites = groupSites(data || [])
        setSites(uniqueSites)
        setSiteError('')
        if (!selectedSiteId || !uniqueSites.find((s) => s.siteId === selectedSiteId)) {
          setSelectedSiteId(uniqueSites[0]?.siteId || '')
        }
      } catch (err) {
        setSiteError('Unable to load sites.')
      } finally {
        setLoadingSites(false)
      }
    }
    fetchSites()
  }, [])

  useEffect(() => {
    const fetchMeals = async () => {
      if (!selectedSiteId) {
        setMeals([])
        return
      }

      const loadMealsForIds = async (siteIds, siteLabel) => {
        const results = await Promise.allSettled(
          (siteIds || []).map(async (id) => {
            try {
              const data = await getMealsForSite(id)
              return (data || []).map((meal) => ({
                ...meal,
                siteId: id,
                siteName: siteLabel,
              }))
            } catch (err) {
              return []
            }
          }),
        )
        return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
      }

      try {
        setLoadingMeals(true)
        const site = sites.find((s) => s.siteId === selectedSiteId)
        if (!site) {
          setMeals([])
          return
        }
        const groupedMeals = await loadMealsForIds(
          site.siteIds?.length ? site.siteIds : [selectedSiteId],
          site.displayName,
        )
        setMeals(groupedMeals)
        setMealError('')
      } catch (err) {
        setMealError('Unable to load meals for this site.')
      } finally {
        setLoadingMeals(false)
      }
    }
    fetchMeals()
  }, [selectedSiteId, sites])

  const selectedSite = useMemo(
    () => sites.find((site) => site.siteId === selectedSiteId),
    [sites, selectedSiteId],
  )
  const selectedSiteName = selectedSite?.displayName || 'Selected site'

  const downloadCsv = () => {
    if (!meals.length) return
    const headers = ['title', 'description', 'category', 'sourcePage', 'siteName', 'siteId']
    const escape = (val) => `"${(val ?? '').toString().replace(/"/g, '""')}"`
    const csv = [
      headers.join(','),
      ...meals.map((meal) => headers.map((h) => escape(meal[h])).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${normalizeKey(selectedSiteName) || 'meals'}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={styles.page}>
      <section className={`card-surface ${styles.hero}`}>
        <div className={styles.heroText}>
          <p className={styles.kicker}>Site explorer</p>
          <h1 className={styles.title}>
            <FiMapPin /> Meals by site
          </h1>
          <p className={styles.subtitle}>
            Tap a site card to see its meals.
          </p>
        </div>
        <div className={styles.metrics}>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Sites</span>
            <span className={styles.metricValue}>{sites.length || 0}</span>
          </div>
          <div className={styles.metricCard}>
            <span className={styles.metricLabel}>Meals indexed</span>
            <span className={styles.metricValue}>{totalMeals || 0}</span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Choose a site</p>
            <h2 className={styles.sectionTitle}>Site cards</h2>
          </div>
          <p className={styles.sectionHint}>Click a card to load meals below.</p>
        </div>
        <SiteList
          sites={sites}
          selectedSiteId={selectedSiteId}
          onSelect={setSelectedSiteId}
          loading={loadingSites}
          error={siteError}
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <p className={styles.sectionKicker}>Meals</p>
            <h2 className={styles.sectionTitle}>Showing {selectedSiteName || 'a site'}</h2>
          </div>
          <div className={styles.actions}>
            <p className={styles.sectionHint}>Results update instantly based on the selected site card.</p>
            <button className={styles.downloadBtn} onClick={downloadCsv} disabled={!meals.length || loadingMeals}>
              Download CSV
            </button>
          </div>
        </div>
        <MealsGrid meals={meals} loading={loadingMeals} error={mealError} siteName={selectedSiteName} />
      </section>
    </div>
  )
}

export default SitesPage
