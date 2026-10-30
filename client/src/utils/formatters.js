/**
 * Format a number as currency (Indian Rupees by default)
 */
export const formatCurrency = (amount, currency = 'INR') => {
  if (amount === null || amount === undefined) return '₹0.00'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format a date string to readable format
 */
export const formatDate = (dateStr, options = {}) => {
  if (!dateStr) return '-'
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(dateStr))
}

/**
 * Format date to ISO string for API (YYYY-MM-DD)
 */
export const toISODate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}

/**
 * Get relative time (e.g., "2 days ago")
 */
export const getRelativeTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

/**
 * Calculate percentage
 */
export const calcPercentage = (part, total) => {
  if (!total || total === 0) return 0
  return Math.round((part / total) * 100)
}

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, maxLength = 30) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

/**
 * Get first letter(s) for avatar
 */
export const getInitials = (name) => {
  if (!name) return 'U'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

/**
 * Group transactions by date
 */
export const groupByDate = (transactions) => {
  return transactions.reduce((groups, tx) => {
    const date = tx.date
    if (!groups[date]) groups[date] = []
    groups[date].push(tx)
    return groups
  }, {})
}

/**
 * Get month name from month number (1-12)
 */
export const getMonthName = (month) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[month - 1] || ''
}

/**
 * Generate color from string (for category fallbacks)
 */
export const stringToColor = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const color = Math.abs(hash).toString(16).substring(0, 6).padStart(6, '0')
  return `#${color}`
}

/**
 * CHART COLORS for Recharts
 */
export const CHART_COLORS = [
  '#6366f1', '#8b5cf6', '#a78bfa', '#f97316', '#ec4899',
  '#14b8a6', '#22c55e', '#eab308', '#ef4444', '#3b82f6',
  '#06b6d4', '#84cc16', '#f59e0b', '#d946ef', '#10b981',
]
