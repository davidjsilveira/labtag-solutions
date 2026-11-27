import assert from 'node:assert/strict'
import { test } from 'node:test'
import { pagerItems } from './src/pagerPages.ts'

test('short ranges show every page, no ellipsis', () => {
  assert.deepEqual(pagerItems(3, 5), [1, 2, 3, 4, 5])
  assert.deepEqual(pagerItems(1, 1), [1])
})

test('long ranges truncate around the current page', () => {
  assert.deepEqual(pagerItems(4, 8), [1, '…', 3, 4, 5, '…', 8])
  assert.deepEqual(pagerItems(10, 20), [1, '…', 9, 10, 11, '…', 20])
})

test('edges keep first/last without a dangling ellipsis', () => {
  assert.deepEqual(pagerItems(1, 8), [1, 2, '…', 8])
  assert.deepEqual(pagerItems(2, 8), [1, 2, 3, '…', 8])
  assert.deepEqual(pagerItems(7, 8), [1, '…', 6, 7, 8])
  assert.deepEqual(pagerItems(8, 8), [1, '…', 7, 8])
})

test('exactly 7 pages still renders fully; 8 truncates', () => {
  assert.deepEqual(pagerItems(4, 7), [1, 2, 3, 4, 5, 6, 7])
  assert.equal(pagerItems(4, 8).includes('…'), true)
})
