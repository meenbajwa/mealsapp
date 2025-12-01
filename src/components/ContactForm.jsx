import { useEffect, useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMessageCircle, FiCheckCircle, FiAlertTriangle, FiList } from 'react-icons/fi'
import { submitContact, fetchContacts } from '../api/contactApi.js'
import styles from './ContactForm.module.css'

const initialValues = {
  name: '',
  email: '',
  phone: '',
  phoneCountry: 'us_ca',
  message: '',
}

const PHONE_RULES = {
  us_ca: { code: '+1', label: 'US / Canada', pattern: /^\d{10}$/ },
  uk: { code: '+44', label: 'UK', pattern: /^\d{10}$/ },
  in: { code: '+91', label: 'India', pattern: /^\d{10}$/ },
  au: { code: '+61', label: 'Australia', pattern: /^\d{9}$/ },
  eu: { code: '+33', label: 'Europe', pattern: /^\d{8,12}$/ },
}

function ContactForm() {
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [feedback, setFeedback] = useState('')
  const [submissions, setSubmissions] = useState([])
  const [submissionsOpen, setSubmissionsOpen] = useState(false)
  const [submissionsLoading, setSubmissionsLoading] = useState(false)
  const [submissionsError, setSubmissionsError] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    const namePattern = /^[a-zA-Z\s.'-]+$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phoneDigits = form.phone.replace(/[^\d]/g, '')
    const countryRule = PHONE_RULES[form.phoneCountry] || PHONE_RULES.us_ca
    const phonePattern = countryRule.pattern

    if (!form.name.trim()) newErrors.name = 'Name is required.'
    else if (!namePattern.test(form.name.trim())) newErrors.name = 'Use letters and basic punctuation only.'

    if (!form.email.trim()) newErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim())) newErrors.email = 'Enter a valid email.'

    if (form.phone) {
      if (!phonePattern.test(phoneDigits)) {
        newErrors.phone = `Enter a valid number for ${countryRule.label.replace('/', 'or')}.`
      }
    }

    if (!form.message.trim()) newErrors.message = 'Message is required.'
    else if (form.message.trim().length < 10) newErrors.message = 'Message should be at least 10 characters.'
    else if (form.message.trim().length > 500) newErrors.message = 'Message should be under 500 characters.'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validate()
    setErrors(validation)
    if (Object.keys(validation).length > 0) return

    try {
      setStatus('loading')
      setFeedback('')
      const countryCode = (PHONE_RULES[form.phoneCountry] || PHONE_RULES.us_ca).code
      const payload = {
        ...form,
        phone: form.phone ? `${countryCode} ${form.phone.replace(/[^\d]/g, '')}` : '',
      }
      await submitContact(payload)
      setStatus('success')
      setFeedback('We have received your message. Thank you for reaching out!')
      setForm(initialValues)
      if (submissionsOpen) {
        loadSubmissions()
      }
    } catch (err) {
      if (err?.response?.status === 400 && err.response.data?.errors) {
        setErrors(err.response.data.errors)
        setFeedback('Please fix the errors below.')
      } else {
        setFeedback('Something went wrong while sending your message. Please try again.')
      }
      setStatus('error')
    }
  }

  const loadSubmissions = async () => {
    try {
      setSubmissionsLoading(true)
      setSubmissionsError('')
      const data = await fetchContacts()
      setSubmissions(Array.isArray(data) ? data : data?.items || [])
    } catch (err) {
      setSubmissions([])
      setSubmissionsError('Unable to load submissions right now.')
    } finally {
      setSubmissionsLoading(false)
    }
  }

  useEffect(() => {
    if (submissionsOpen) {
      loadSubmissions()
    }
  }, [submissionsOpen])

  return (
    <div className={`card-surface ${styles.card}`}>
      <div className={styles.header}>
        <FiMessageCircle className={styles.headerIcon} size={20} />
        <div>
          <h3 className={styles.title}>Contact Us</h3>
          <p className={styles.subtitle}>We usually respond within a business day.</p>
        </div>
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => setSubmissionsOpen((prev) => !prev)}
        >
          <FiList />
          {submissionsOpen ? 'Hide submissions' : 'Show submissions'}
        </button>
      </div>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">
            Name
          </label>
          <div className={styles.inputWrapper}>
            <FiUser className={styles.inputIcon} />
            <input
              id="name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Jane Doe"
            />
          </div>
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </div>

        <div className={styles.doubleField}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <div className={styles.inputWrapper}>
              <FiMail className={styles.inputIcon} />
              <input
                id="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="jane@example.com"
              />
            </div>
            {errors.email && <p className={styles.error}>{errors.email}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">
              Phone (optional)
            </label>
            <div className={styles.phoneRow}>
              <div className={styles.selectWrapper}>
                <select
                  value={form.phoneCountry}
                  onChange={(e) => handleChange('phoneCountry', e.target.value)}
                  aria-label="Country code"
                >
                  {Object.entries(PHONE_RULES).map(([key, rule]) => (
                    <option key={key} value={key}>
                      {rule.code} {rule.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.inputWrapper}>
                <FiPhone className={styles.inputIcon} />
                <input
                  id="phone"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="Digits only"
                />
              </div>
            </div>
            {errors.phone && <p className={styles.error}>{errors.phone}</p>}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="message">
            Message
          </label>
          <div className={styles.inputWrapper} data-multiline>
            <FiMessageCircle className={styles.inputIcon} />
            <textarea
              id="message"
              value={form.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Tell us how we can help you..."
              rows={4}
            />
          </div>
          <div className={styles.helperRow}>
            <span className={styles.helperText}>{form.message.length}/500</span>
            {errors.message && <p className={styles.error}>{errors.message}</p>}
          </div>
        </div>

        <button className={styles.submit} type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Sending...' : 'Send message'}
        </button>
      </form>

      {status === 'success' && (
        <div className={`${styles.feedback} ${styles.success}`}>
          <FiCheckCircle />
          <span>{feedback}</span>
        </div>
      )}
      {status === 'error' && (
        <div className={`${styles.feedback} ${styles.errorBox}`}>
          <FiAlertTriangle />
          <span>{feedback}</span>
        </div>
      )}

      {submissionsOpen && (
        <div className={styles.submissions}>
          <div className={styles.submissionsHeader}>
            <h4>Past submissions</h4>
            {submissionsLoading && <span className={styles.pill}>Loading...</span>}
          </div>
          {submissionsError && <p className={styles.error}>{submissionsError}</p>}
          {!submissionsLoading && !submissionsError && submissions.length === 0 && (
            <p className={styles.empty}>No submissions yet.</p>
          )}
          {!submissionsLoading && submissions.length > 0 && (
            <div className={styles.submissionList}>
              {submissions.map((item) => (
                <div key={item.id || `${item.email}-${item.phone}`} className={styles.submissionCard}>
                  <div className={styles.submissionTop}>
                    <div>
                      <p className={styles.subName}>{item.name}</p>
                      <p className={styles.subEmail}>{item.email}</p>
                    </div>
                    {item.phone && <span className={styles.subPhone}>{item.phone}</span>}
                  </div>
                  <p className={styles.subMessage}>{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ContactForm
