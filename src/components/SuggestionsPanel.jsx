import { FiAlertCircle, FiCornerDownRight, FiBarChart2, FiHash } from 'react-icons/fi'
import styles from './SuggestionsPanel.module.css'

function SuggestionsPanel({
  loading,
  spellCheck,
  suggestions = [],
  query,
  error,
  onApplySpell,
  onSelectSuggestion,
}) {
  const hasQuery = Boolean(query && query.trim())
  const hasSuggestions = suggestions.length > 0
  const showSpellCheck = spellCheck?.corrected

  return (
    <div className={`card-surface ${styles.panel}`}>
      <div className={styles.header}>
        <span className={styles.title}>Suggestions</span>
        {loading && <span className={styles.pill}>Loading...</span>}
      </div>
      {!hasQuery && <p className={styles.emptyState}>Start typing to see live suggestions.</p>}
      {error && (
        <div className={styles.errorRow}>
          <FiAlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      {showSpellCheck && (
        <div className={styles.spellRow}>
          <FiAlertCircle size={18} className={styles.spellIcon} />
          <span className={styles.spellText}>
            Did you mean{' '}
            <button className={styles.spellButton} onClick={() => onApplySpell(spellCheck.suggestion)}>
              &quot;{spellCheck.suggestion}&quot;
            </button>
            ?
          </span>
        </div>
      )}

      {hasSuggestions ? (
        <div className={styles.list}>
          {suggestions.map((item) => (
            <button
              key={item.word}
              className={styles.item}
              onClick={() => onSelectSuggestion(item.word)}
              type="button"
            >
              <div className={styles.itemLeft}>
                <FiCornerDownRight className={styles.itemIcon} size={18} />
                <span className={styles.word}>{item.word}</span>
              </div>
              <div className={styles.badges}>
                <span className={styles.badge}>
                  <FiBarChart2 />
                  <span>{item.searchFrequency} searches</span>
                </span>
                <span className={styles.badge}>
                  <FiHash />
                  <span>{item.totalFrequency} matches</span>
                </span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        hasQuery &&
        !loading &&
        !error && <p className={styles.emptyState}>No suggestions found yet.</p>
      )}
    </div>
  )
}

export default SuggestionsPanel
