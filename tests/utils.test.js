import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { formatDate, formatDateRange } from '@/lib/utils'

describe('date formatting', () => {
  it('formats YYYY-MM values as short month and year', () => {
    assert.equal(formatDate('2022-03'), 'Mar 2022')
    assert.equal(formatDate('2019-12'), 'Dec 2019')
    assert.equal(formatDate(''), '')
  })

  it('formats ranges, open-ended ranges and current roles', () => {
    assert.equal(formatDateRange('2019-06', '2022-02', false), 'Jun 2019 – Feb 2022')
    assert.equal(formatDateRange('2022-03', '', true), 'Mar 2022 – Present')
    assert.equal(formatDateRange('2022-03', '2023-01', true), 'Mar 2022 – Present')
    assert.equal(formatDateRange('2022-03', '', false), 'Mar 2022')
  })
})
