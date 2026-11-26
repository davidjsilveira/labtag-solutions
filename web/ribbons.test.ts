import assert from 'node:assert/strict'
import { test } from 'node:test'
import { recommendedRibbons } from './src/content/ribbons.ts'

test('1" thermal-transfer roll gets ribbons at least 0.5" wider, narrowest first', () => {
  const picks = recommendedRibbons(1, true, true)
  assert.equal(picks.length, 6)
  assert.ok(picks.every((r) => r.width >= 1.5))
  const widths = picks.map((r) => r.width)
  assert.deepEqual(widths, [...widths].sort((a, b) => a - b))
  assert.equal(picks[0].width, 1.57)
})

test('narrow label (0.236") can use the sub-inch ribbons', () => {
  const picks = recommendedRibbons(0.236, true, true)
  assert.equal(picks[0].model, 'RR25X450C1-1iZ4') // 0.98" >= 0.736"
})

test('no recommendation without a width, or for non-thermal-transfer / non-roll labels', () => {
  assert.deepEqual(recommendedRibbons(null, true, true), [])
  assert.deepEqual(recommendedRibbons(1, false, true), [])
  assert.deepEqual(recommendedRibbons(1, true, false), [])
})
