import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateInvoiceNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${year}${month}-${random}`
}

export function generateQuotationNumber(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `QT-${year}${month}-${random}`
}

export function calculateTotals(
  items: Array<{ quantity: number; unit_price: number; tax_rate: number; discount: number }>
): {
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
} {
  let subtotal = 0
  let taxAmount = 0
  let discountAmount = 0

  for (const item of items) {
    const itemTotal = item.quantity * item.unit_price
    const itemDiscount = item.discount || 0
    const itemTax = (itemTotal - itemDiscount) * (item.tax_rate / 100)
    
    subtotal += itemTotal
    discountAmount += itemDiscount
    taxAmount += itemTax
  }

  return {
    subtotal,
    taxAmount,
    discountAmount,
    total: subtotal - discountAmount + taxAmount,
  }
}
