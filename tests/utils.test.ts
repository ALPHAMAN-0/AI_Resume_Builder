import { describe, expect, it } from 'vitest'
import { formatDate, formatDateRange } from '@/lib/utils'

describe('date formatting', () => {
  it('formats YYYY-MM values as short month and year', () => {
    expect(formatDate('2022-03')).toBe('Mar 2022')
    expect(formatDate('2019-12')).toBe('Dec 2019')
    expect(formatDate('')).toBe('')
  })

  it('formats ranges, open-ended ranges and current roles', () => {
    expect(formatDateRange('2019-06', '2022-02', false)).toBe('Jun 2019 – Feb 2022')
    expect(formatDateRange('2022-03', '', true)).toBe('Mar 2022 – Present')
    expect(formatDateRange('2022-03', '2023-01', true)).toBe('Mar 2022 – Present')
    expect(formatDateRange('2022-03', '', false)).toBe('Mar 2022')
  })
})
