import { useState } from 'react'
import { FiUser, FiMail, FiPhone, FiMessageCircle, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi'
import { submitContact } from '../api/contactApi.js'
import styles from './ContactForm.module.css'

const initialValues = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

function ContactForm() {
  const [form, setForm] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [feedback, setFeedback] = useState('')

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    const namePattern = /^[a-zA-Z\s.'-]+$/
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const phonePattern = /^[\d+\-\s()]{7,20}$/

    if (!form.name.trim()) newErrors.name = 'Name is required.'
    else if (!namePattern.test(form.name.trim())) newErrors.name = 'Use letters and basic punctuation only.'

    if (!form.email.trim()) newErrors.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim())) newErrors.email = 'Enter a valid email.'

    if (form.phone && !phonePattern.test(form.phone.trim())) {
      newErrors.phone = 'Use digits, spaces, +, - or parentheses.'
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
      await submitContact(form)
      setStatus('success')
      setFeedback('We have received your message. Thank you for reaching out!')
      setForm(initialValues)
    } catch (err) {
      setStatus('error')
      setFeedback('Something went wrong while sending your message. Please try again.')
    }
  }

  return (
    <div className={`card-surface ${styles.card}`}>
      <div className={styles.header}>
        <FiMessageCircle className={styles.headerIcon} size={20} />
        <div>
          <h3 className={styles.title}>Contact Us</h3>
          <p className={styles.subtitle}>We usually respond within a business day.</p>
        </div>
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
            <div className={styles.inputWrapper}>
              <FiPhone className={styles.inputIcon} />
              <input
                id="phone"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="+1 647 555 1234"
              />
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
    </div>
  )
}

export default ContactForm
