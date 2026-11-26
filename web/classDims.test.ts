import assert from 'node:assert/strict'
import { test } from 'node:test'
import { dimMatches, dimsOf, sizeFieldLabel, sizeFieldsForShapes, sizeOf } from './src/content/classDims.ts'

test('strips wrap-around from a height x wrap size', () => {
  assert.equal(sizeOf('0.5" x 1" Wrap-Around'), '0.5" x 1"')
  assert.deepEqual(dimsOf(sizeOf('0.5" x 1" Wrap-Around')), { w: '0.5"', l: '1"', d: null })
})

test('wrap-around plus circle keeps the tab as diameter', () => {
  const size = sizeOf('0.6" x 0.6" + 0.375" Circle')
  assert.equal(size, '0.6" x 0.6" + 0.375"')
  assert.deepEqual(dimsOf(size), { w: '0.6"', l: '0.6"', d: '0.375"' })
})

test('plain circle is still diameter', () => {
  assert.deepEqual(dimsOf(sizeOf('0.25" Circle')), { w: null, l: null, d: '0.25"' })
})

test('circle wrap-around still uses diameter', () => {
  assert.deepEqual(dimsOf(sizeOf('0.25" Circle Wrap-Around')), { w: null, l: null, d: '0.25"' })
})

test('size fields follow the selected shapes', () => {
  assert.deepEqual(sizeFieldsForShapes([]), ['width', 'length', 'diameter'])
  assert.deepEqual(sizeFieldsForShapes(['Rectangle']), ['width', 'length'])
  assert.deepEqual(sizeFieldsForShapes(['Circle']), ['diameter'])
  assert.deepEqual(sizeFieldsForShapes(['Rectangle + Circle']), ['width', 'length', 'diameter'])
  assert.deepEqual(sizeFieldsForShapes(['SnapPEEL™']), ['width', 'length', 'diameter'])
  assert.deepEqual(sizeFieldsForShapes(['Special Shape']), ['width', 'length'])
  assert.equal(sizeFieldLabel('length', ['Special Shape']), 'Wrap')
  assert.equal(sizeFieldLabel('length', ['Rectangle']), 'Height')
})

test('size input matches inch values without requiring the quote', () => {
  assert.equal(dimMatches(['0.5'], '0.5"'), true)
  assert.equal(dimMatches(['0.5"'], '0.5"'), true)
  assert.equal(dimMatches(['1'], '0.5"'), false)
  assert.equal(dimMatches([], '0.5"'), true)
})
