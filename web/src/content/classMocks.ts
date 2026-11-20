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

/** Demo catalog so the JTTA class page can exercise the size table and filters. */
export const JTTA_SUMMARY =
  'Thermal-transfer cryogenic labels for cryo vials, microtubes, cryo/freezer boxes, cell culture plates, plastic bags, and other cryo containers destined for storage in liquid and vapor phase liquid nitrogen (-196°C), laboratory freezers (-80°C), or transport on dry ice.'

export const JTTA_DESCRIPTION =
  'Thermal-transfer cryogenic labels for cryo vials, microtubes, cryo/freezer boxes, cell culture plates, plastic bags, and other cryo containers destined for storage in liquid and vapor phase liquid nitrogen (-196°C), laboratory freezers (-80°C), or transport on dry ice. JTTA-class labels have a strong permanent adhesive that allows them to adhere to wet and moist surfaces and withstand extreme temperatures, including multiple freeze-thaw cycles.'

export const JTTA_SKUS: ClassSku[] = [
  { model: 'JTTA-182', dimensions: 'N/A', width: null, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: [], price: 'CA$0.034/label' },
  { model: 'JTTA-294', dimensions: '0.236" x 0.236"', width: 0.236, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.033/label' },
  { model: 'JTTA-164', dimensions: '0.25" x 1"', width: 0.25, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White', 'Blue', 'Yellow', 'Green'], price: 'CA$0.020/label' },
  { model: 'JTTA-288', dimensions: '0.25" Circle', width: 0.25, shape: 'Circle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['White'], price: 'CA$0.035/label' },
  { model: 'JTTA-59', dimensions: '0.25" Circle', width: 0.25, shape: 'Circle', container: 'Tubes & Vials', feature: 'Wrap-Around', colors: ['White', 'Yellow', 'Green', 'Orange', 'Red', 'Purple'], price: 'CA$0.035/label' },
  { model: 'JTTA-236', dimensions: '0.31" x 0.5"', width: 0.31, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White'], price: 'CA$0.032/label' },
  { model: 'JTTA-259', dimensions: '0.328" x 1"', width: 0.328, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.024/label' },
  { model: 'JTTA-61', dimensions: '0.354" Circle', width: 0.354, shape: 'Circle', container: 'Cryo Boxes', feature: 'Blackout', colors: ['Yellow', 'Green', 'Orange', 'Purple'], price: 'CA$0.035/label' },
  { model: 'JTTA-255', dimensions: '0.375" x 0.375"', width: 0.375, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.033/label' },
  { model: 'JTTA-22', dimensions: '0.438" Circle', width: 0.438, shape: 'Circle', container: 'Cryo Boxes', feature: 'Wrap-Around', colors: ['White', 'Yellow', 'Orange', 'Red'], price: 'CA$0.035/label' },
  { model: 'JTTA-204', dimensions: '0.47" x 0.47"', width: 0.47, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White'], price: 'CA$0.033/label' },
  { model: 'JTTA-104', dimensions: '0.5" x 1.375"', width: 0.5, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.057/label' },
  { model: 'JTTA-162', dimensions: '0.5" x 1"', width: 0.5, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Wrap-Around', colors: ['Yellow', 'Green', 'Orange', 'Red'], price: 'CA$0.041/label' },
  { model: 'JTTA-293', dimensions: '0.5" Circle', width: 0.5, shape: 'Circle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['Blue'], price: 'CA$0.043/label' },
  { model: 'JTTA-34', dimensions: '0.5" x 1.25"', width: 0.5, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White', 'Pink'], price: 'CA$0.050/label' },
  { model: 'JTTA-39', dimensions: '0.5" x 2"', width: 0.5, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Blackout', colors: ['White'], price: 'CA$0.036/label' },
  { model: 'JTTA-500', dimensions: '0.5" Circle', width: 0.5, shape: 'Circle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['Green'], price: 'CA$0.044/label' },
  { model: 'JTTA-515', dimensions: '0.5" x 1.75"', width: 0.5, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White'], price: 'CA$0.038/label' },
  { model: 'JTTA-531', dimensions: '0.5" x 2"', width: 0.5, shape: 'Rectangle', container: 'Syringes', feature: 'Wrap-Around', colors: ['White'], price: 'CA$0.047/label' },
  { model: 'JTTA-53', dimensions: '0.5" Circle', width: 0.5, shape: 'Circle', container: 'Tubes & Vials', feature: 'Barcode', colors: ['White', 'Yellow', 'Green', 'Orange', 'Red', 'Purple'], price: 'CA$0.035/label' },
  { model: 'JTTA-89', dimensions: '0.5" x 1"', width: 0.5, shape: 'Rectangle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['White'], price: 'CA$0.032/label' },
  { model: 'JTTA-176', dimensions: '0.55" x 2.75"', width: 0.55, shape: 'Rectangle', container: 'Tubes & Vials', feature: 'Blackout', colors: ['White', 'Red'], price: 'CA$0.093/label' },
  { model: 'JTTA-230', dimensions: '0.6" x 0.6" + 0.375" Circle', width: 0.6, shape: 'Rectangle + Circle', container: 'Tubes & Vials', feature: 'Wrap-Around', colors: ['White'], price: 'CA$0.049/set' },
  { model: 'JTTA-276', dimensions: '0.625" x 1.28"', width: 0.625, shape: 'Rectangle', container: 'Syringes', feature: 'Barcode', colors: ['White'], price: 'CA$0.045/label' },
  { model: 'JTTA-277', dimensions: '0.63" x 1.2"', width: 0.63, shape: 'Rectangle', container: 'Cryo Boxes', feature: 'Barcode', colors: ['White'], price: 'CA$0.041/label' },
]
