import { FiGrid, FiTag } from 'react-icons/fi'
import styles from './MealsGrid.module.css'

function MealsGrid({ meals, loading, error, siteName }) {
  return (
    <div className={`card-surface ${styles.card}`}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <FiGrid className={styles.icon} size={18} />
          <span className={styles.title}>Meals {siteName ? `from ${siteName}` : ''}</span>
        </div>
        {loading && <span className={styles.badge}>Loading...</span>}
      </div>
      {error && <p className={styles.error}>{error}</p>}
      {!loading && !error && meals.length === 0 && (
        <p className={styles.empty}>Select a site to load its meals.</p>
      )}
      <div className={styles.grid}>
        {meals.map((meal) => (
          <article key={meal.id} className={styles.cardItem}>
            <div className={styles.cardHeader}>
              <h3 className={styles.mealTitle}>{meal.title}</h3>
              {meal.category && (
                <span className={styles.category}>
                  <FiTag />
                  {meal.category}
                </span>
              )}
            </div>
            <p className={styles.description}>{meal.description}</p>
            {meal.sourcePage && (
              <a className={styles.source} href={meal.sourcePage} target="_blank" rel="noreferrer">
                View source
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

export default MealsGrid
