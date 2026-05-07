import { format } from 'date-fns'

export const formatCurrency = (value, currency = 'MAD') => {
  if (Number.isNaN(Number(value))) return `0 ${currency}`
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value))
}

export const formatDate = (value, pattern = 'dd MMM yyyy') => {
  if (!value) return ''
  try {
    return format(new Date(value), pattern)
  } catch (error) {
    return ''
  }
}

export const formatPercent = (value) => `${Math.round(value)}%`
