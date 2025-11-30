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

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoadingSites(true)
        const data = await getSites()
        setSites(data || [])
        setSiteError('')
        if (data && data.length > 0) {
          setSelectedSiteId(data[0].siteId)
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
      try {
        setLoadingMeals(true)
        const data = await getMealsForSite(selectedSiteId)
        setMeals(data || [])
        setMealError('')
      } catch (err) {
        setMealError('Unable to load meals for this site.')
      } finally {
        setLoadingMeals(false)
      }
    }
    fetchMeals()
  }, [selectedSiteId])

  const selectedSite = useMemo(
    () => sites.find((site) => site.siteId === selectedSiteId),
    [sites, selectedSiteId],
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className="page-title">
          <FiMapPin /> Food Meal Sites
        </h1>
        <p className="page-subtitle">
          Browse through crawled sites and inspect their available meals. Pick a site to load its menu on the right.
        </p>
      </div>
      <div className={styles.layout}>
        <div className={styles.left}>
          <SiteList
            sites={sites}
            selectedSiteId={selectedSiteId}
            onSelect={setSelectedSiteId}
            loading={loadingSites}
            error={siteError}
          />
        </div>
        <div className={styles.right}>
          <MealsGrid
            meals={meals}
            loading={loadingMeals}
            error={mealError}
            siteName={selectedSite?.displayName}
          />
        </div>
      </div>
    </div>
  )
}

export default SitesPage
