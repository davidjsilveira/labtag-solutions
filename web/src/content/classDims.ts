/** Dimensions strings can carry a trailing shape word; size and shape render in separate columns. */
export function sizeOf(dimensions: string) {
  const size = dimensions.replace(/(?:\s*(?:Circle|Rectangle|Square|Oval|Wrap-Around|Wrap Around))+\s*$/i, '').trim()
  return size || dimensions
}

/** Split a size into width/length/diameter. Wrap-around uses height × wrap as width × length. Circles are diameter. */
export function dimsOf(size: string) {
  const rect = size.match(/^([\d.]+)" x ([\d.]+)"(?: \+ ([\d.]+)")?$/)
  if (rect) return { w: `${rect[1]}"`, l: `${rect[2]}"`, d: rect[3] ? `${rect[3]}"` : null }
  const circle = size.match(/^([\d.]+)"$/)
  if (circle) return { w: null, l: null, d: `${circle[1]}"` }
  return { w: null, l: null, d: null }
}

export type SizeField = 'width' | 'length' | 'diameter'

export function sizeFieldsForShapes(shapes: string[]): SizeField[] {
  if (!shapes.length) return ['width', 'length', 'diameter']
  const fields = new Set<SizeField>()
  for (const shape of shapes) {
    const name = shape.toLowerCase()
    if (name.includes('special')) {
      fields.add('width')
      fields.add('length')
    } else if (name.includes('snappeel') || (name.includes('rectangle') && name.includes('circle'))) {
      fields.add('width')
      fields.add('length')
      fields.add('diameter')
    } else if (name.includes('circle')) {
      fields.add('diameter')
    } else {
      fields.add('width')
      fields.add('length')
    }
  }
  return (['width', 'length', 'diameter'] as const).filter((key) => fields.has(key))
}

export function sizeFieldLabel(key: SizeField, shapes: string[]) {
  if (key === 'width') return 'Width'
  if (key === 'diameter') return 'Diameter'
  const wrapOnly = shapes.length > 0 && shapes.every((shape) => shape.toLowerCase().includes('special'))
  return wrapOnly ? 'Wrap' : 'Height'
}

export function inchValue(input: string) {
  const amount = parseFloat(input.replace(/[^0-9.]/g, ''))
  return Number.isNaN(amount) ? null : amount
}

export function dimMatches(selected: string[], cell: string | null) {
  if (!selected.length) return true
  if (!cell) return false
  const cellAmount = inchValue(cell)
  if (cellAmount == null) return selected.includes(cell)
  return selected.some((value) => inchValue(value) === cellAmount)
}
