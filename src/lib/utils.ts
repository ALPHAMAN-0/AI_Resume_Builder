import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export function formatDateRange(start: string, end: string, current: boolean): string {
  const startFormatted = formatDate(start)
  if (current) return `${startFormatted} – Present`
  if (!end) return startFormatted
  return `${startFormatted} – ${formatDate(end)}`
}
