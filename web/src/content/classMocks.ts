import { SHOP_CARD_IMAGES } from '@/content/shopCardImages'

export type ClassSku = {
  model: string
  dimensions: string
  /** Smallest side in inches, used by the width sort. */
  width: number | null
  shape: string
  container: string
  feature: string
  colors: string[]
  price: string
  image?: string
  /** shortcut: pack layout, fill from catalog when SKU attributes exist */
  labelsAcross?: number | null
  sheetRows?: number | null
  sheetCols?: number | null
  /** shortcut: mock IP marks, replace with catalog attributes */
  badges?: string[]
}

/** shortcut: 1000 labels/roll mock, replace when catalog pack size exists */
export function rollPriceFromUnit(price: string, labelsPerRoll = 1000) {
  const amount = parseFloat(price.replace(/[^0-9.]/g, ''))
  if (Number.isNaN(amount)) return price
  const currency = price.match(/^[^\d]+/)?.[0] ?? ''
  return `${currency}${(amount * labelsPerRoll).toFixed(2)}/roll`
}

export const COLOR_SWATCH: Record<string, string> = {
  White: '#f4f6f8',
  Blue: '#3b82f6',
  Yellow: '#f5c542',
  Green: '#22a35a',
  Orange: '#f97316',
  Red: '#e11d48',
  Pink: '#ec4899',
  Purple: '#8b5cf6',
  Black: '#1f2937',
}

export const JTTA_SHAPES = ['Circle', 'Rectangle', 'Rectangle + Circle', 'SnapPEEL™', 'Special Shape'] as const
export const JTTA_SUMMARY =
  'Thermal-transfer cryogenic labels for cryo vials, microtubes, cryo/freezer boxes, cell culture plates, plastic bags, and other cryo containers destined for storage in liquid and vapor phase liquid nitrogen (-196°C), laboratory freezers (-80°C), or transport on dry ice.'

export const JTTA_DESCRIPTION =
  'Thermal-transfer cryogenic labels for cryo vials, microtubes, cryo/freezer boxes, cell culture plates, plastic bags, and other cryo containers destined for storage in liquid and vapor phase liquid nitrogen (-196°C), laboratory freezers (-80°C), or transport on dry ice. JTTA-class labels have a strong permanent adhesive that allows them to adhere to wet and moist surfaces and withstand extreme temperatures, including multiple freeze-thaw cycles.'

export const JTTA_SKUS: ClassSku[] = [
  { model: 'JTTA-182', dimensions: 'N/A', width: null, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: [], price: 'CA$0.034/label' },
  { model: 'JTTA-294', dimensions: '0.236" x 0.236"', width: 0.236, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.033/label', badges: ['Patented'] },
  { model: 'JTTA-164', dimensions: '0.25" x 1"', width: 0.25, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White', 'Blue', 'Yellow', 'Green'], price: 'CA$0.020/label' , labelsAcross: 10 },
  { model: 'JTTA-288', dimensions: '0.25" Circle', width: 0.25, shape: 'Circle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['White'], price: 'CA$0.035/label' , labelsAcross: 4 },
  { model: 'JTTA-59', dimensions: '0.25" Circle Wrap-Around', width: 0.25, shape: 'Special Shape', container: 'Tubes & Vials', feature: 'Wrap-Around', colors: ['White', 'Yellow', 'Green', 'Orange', 'Red', 'Purple'], price: 'CA$0.035/label' , labelsAcross: 2, badges: ['Patent pending'] },
  { model: 'JTTA-236', dimensions: '0.31" x 0.5"', width: 0.31, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White'], price: 'CA$0.032/label' , labelsAcross: 4 },
  { model: 'JTTA-259', dimensions: '0.328" x 1"', width: 0.328, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.024/label' , labelsAcross: 10 },
  { model: 'JTTA-61', dimensions: '0.354" Circle', width: 0.354, shape: 'Circle', container: 'Cryo Boxes', feature: 'Blackout', colors: ['Yellow', 'Green', 'Orange', 'Purple'], price: 'CA$0.035/label' , labelsAcross: 2 },
  { model: 'JTTA-255', dimensions: '0.375" x 0.375"', width: 0.375, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.033/label' , labelsAcross: 3 },
  { model: 'JTTA-22', dimensions: '0.438" Circle Wrap-Around', width: 0.438, shape: 'Special Shape', container: 'Cryo Boxes', feature: 'Wrap-Around', colors: ['White', 'Yellow', 'Orange', 'Red'], price: 'CA$0.035/label' , labelsAcross: 2, badges: ['Patent pending', 'Protected design'] },
  { model: 'JTTA-204', dimensions: '0.47" x 0.47"', width: 0.47, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White'], price: 'CA$0.033/label' },
  { model: 'JTTA-104', dimensions: '0.5" x 1.375"', width: 0.5, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.057/label' },
  { model: 'JTTA-162', dimensions: '0.5" x 1" Wrap-Around', width: 0.5, shape: 'Special Shape', container: 'Tubes & Vials', feature: 'Wrap-Around', colors: ['Yellow', 'Green', 'Orange', 'Red'], price: 'CA$0.041/label' },
  { model: 'JTTA-293', dimensions: '0.5" Circle', width: 0.5, shape: 'Circle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['Blue'], price: 'CA$0.043/label' , labelsAcross: 3 },
  { model: 'JTTA-34', dimensions: '0.5" x 1.25"', width: 0.5, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White', 'Pink'], price: 'CA$0.050/label' , labelsAcross: 2 },
  { model: 'JTTA-39', dimensions: '0.5" x 2"', width: 0.5, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Blackout', colors: ['White'], price: 'CA$0.036/label' , labelsAcross: 2 },
  { model: 'JTTA-500', dimensions: '0.5" Circle', width: 0.5, shape: 'Circle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['Green'], price: 'CA$0.044/label' },
  { model: 'JTTA-515', dimensions: '0.5" x 1.75"', width: 0.5, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.038/label' , labelsAcross: 3 },
  { model: 'JTTA-531', dimensions: '0.5" x 2" Wrap-Around', width: 0.5, shape: 'Special Shape', container: 'Syringes', feature: 'Wrap-Around', colors: ['White'], price: 'CA$0.047/label' },
  { model: 'JTTA-53', dimensions: '0.5" Circle', width: 0.5, shape: 'Circle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White', 'Yellow', 'Green', 'Orange', 'Red', 'Purple'], price: 'CA$0.035/label' , labelsAcross: 2 },
  { model: 'JTTA-89', dimensions: '0.5" x 1"', width: 0.5, shape: 'Rectangle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['White'], price: 'CA$0.032/label' , labelsAcross: 5 },
  { model: 'JTTA-176', dimensions: '0.55" x 2.75"', width: 0.55, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Blackout', colors: ['White', 'Red'], price: 'CA$0.093/label' },
  { model: 'JTTA-230', dimensions: '0.6" x 0.6" + 0.375" Circle', width: 0.6, shape: 'Rectangle + Circle', container: 'Tubes & Vials', feature: 'Wrap-Around', colors: ['White'], price: 'CA$0.049/set', badges: ['Protected design'] },
  { model: 'JTTA-276', dimensions: '0.625" x 1.28"', width: 0.625, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White'], price: 'CA$0.045/label' },
  { model: 'JTTA-277', dimensions: '0.63" x 1.2"', width: 0.63, shape: 'Rectangle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['White'], price: 'CA$0.041/label' },
  { model: 'JTTA-29', dimensions: '1" x 1"', width: 1, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White', 'Yellow', 'Green', 'Blue', 'Red', 'Pink'], price: 'CA$0.041/label', image: 'https://cdn.labtag.com/wp-content/uploads/JTTA-29C1-1WH.png' },
]

/** shortcut: extra shop rows so pagination is visible; drop when real catalog SKUs exist */
export const SHOP_MOCK_SKUS: ClassSku[] = [0, 1, 2, 3].flatMap((copy) =>
  JTTA_SKUS.map((item, index) => ({
    ...item,
    model: copy === 0 ? item.model : `${item.model}-P${copy + 1}`,
    image: SHOP_CARD_IMAGES[copy * JTTA_SKUS.length + index] ?? item.image,
  })),
)

export function findClassSku(code: string, model: string) {
  const key = model.trim().toLowerCase()
  if (code.trim().toLowerCase() === 'jtta') {
    return JTTA_SKUS.find((item) => item.model.toLowerCase() === key) ?? SHOP_MOCK_SKUS.find((item) => item.model.toLowerCase() === key) ?? null
  }
  return SHOP_MOCK_SKUS.find((item) => item.model.toLowerCase() === key) ?? null
}

export function findShopSku(model: string) {
  const key = model.trim().toLowerCase()
  return SHOP_MOCK_SKUS.find((item) => item.model.toLowerCase() === key) ?? null
}
