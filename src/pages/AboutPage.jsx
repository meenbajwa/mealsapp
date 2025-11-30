import { FiUsers, FiInfo, FiCheckSquare } from 'react-icons/fi'
import ContactForm from '../components/ContactForm.jsx'
import styles from './AboutPage.module.css'

function AboutPage() {
  return (
    <div className={styles.page}>
      <div className={`card-surface ${styles.introCard}`}>
        <div className={styles.introHeader}>
          <div className="page-title">
            <FiInfo /> About Us
          </div>
          <p className="page-subtitle">
            A course project that crawls multiple food delivery and meal kit sites to aggregate searchable meals.
          </p>
        </div>
        <div className={styles.details}>
          <div className={styles.detailBlock}>
            <FiUsers className={styles.icon} />
            <div>
              <p className={styles.detailLabel}>Course</p>
              <p className={styles.detailValue}>Advanced Web Development</p>
            </div>
          </div>
          <div className={styles.detailBlock}>
            <FiCheckSquare className={styles.icon} />
            <div>
              <p className={styles.detailLabel}>What we built</p>
              <p className={styles.detailValue}>
                Unified search across crawled sites, live suggestion service, and contact feedback channel.
              </p>
            </div>
          </div>
        </div>
      </div>

      <ContactForm />
    </div>
  )
}

export default AboutPage
