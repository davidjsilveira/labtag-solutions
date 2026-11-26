import assert from 'node:assert/strict'
import { test } from 'node:test'
import { rollPriceFromUnit } from './src/content/classMocks.ts'

test('roll price is unit price times 1000 labels', () => {
  assert.equal(rollPriceFromUnit('CA$0.034/label'), 'CA$34.00/roll')
})

test('catalog placeholder is unchanged', () => {
  assert.equal(rollPriceFromUnit('See catalog'), 'See catalog')
})
