import {
  LABTAG_ACCESSORIES_URL,
  LABTAG_FINDER_URL,
  LABTAG_LABELS_URL,
  LABTAG_PRINT_URL,
  LABTAG_SHOP_URL,
  LABTAG_TAPES_URL,
  LABTAG_TAGS_URL,
  TEMPLATES_PATH,
  LABTAG_VIDEOS_URL,
  SAMPLE_PATH,
} from '@/content/labtagLinks'

const SHOP = 'https://www.labtag.com/shop'

function shopSearch(query: string) {
  return `${SHOP}/?s=${encodeURIComponent(query)}&post_type=product`
}

function shopCategory(...parts: string[]) {
  return `${SHOP}/category/${parts.filter(Boolean).join('/')}/`
}

export type ShopMegaLink = {
  label: string
  href: string
}

export type ShopMegaColumn = {
  heading: string
  links: ShopMegaLink[]
}

export type ShopMegaCategory = {
  id: 'labels' | 'tapes' | 'tags' | 'print' | 'accessories'
  label: string
  href: string
  columns: ShopMegaColumn[]
  image: string
  imageAlt: string
}

export const SHOP_MEGA_FOOTER = [
  { label: 'Shop by label class', href: LABTAG_LABELS_URL, icon: 'tag' as const },
  { label: 'Find a label', href: LABTAG_FINDER_URL, icon: 'finder' as const },
  { label: 'Browse by template', href: TEMPLATES_PATH, icon: 'template' as const },
] as const

export const SHOP_MEGA_PROMO = {
  kicker: 'Application-first shopping',
  title: 'Find the product family that matches your laboratory workflow.',
  cta: 'Browse products',
  href: LABTAG_SHOP_URL,
} as const

export const SHOP_MEGA_CATEGORIES: ShopMegaCategory[] = [
  {
    id: 'labels',
    label: 'Labels',
    href: LABTAG_LABELS_URL,
    image: '/media/nav/labels.webp',
    imageAlt: 'Gloved hands applying a Laser CryoSTUCK label to a frozen vial',
    columns: [
      {
        heading: 'By container',
        links: [
          { label: 'Tubes & vials', href: shopSearch('tube vial labels') },
          { label: 'Microscope slides', href: shopSearch('microscope slide labels') },
          { label: 'Storage boxes', href: shopSearch('storage box labels') },
          { label: 'Bottles', href: shopSearch('bottle labels') },
          { label: 'Paraffin blocks', href: shopSearch('paraffin block labels') },
          { label: 'Metal racks', href: shopSearch('metal rack labels') },
          { label: 'PCR tubes & strips', href: shopSearch('PCR tube labels') },
          { label: 'Microplates', href: shopSearch('microplate labels') },
          { label: 'Blood bags', href: shopSearch('blood bag labels') },
          { label: 'IVF straws', href: shopSearch('IVF straw labels') },
        ],
      },
      {
        heading: 'By resistance',
        links: [
          {
            label: 'Cryogenic −196°C',
            href: shopCategory('labels', 'cryogenic-labels'),
          },
          {
            label: 'Deep-freeze −80°C',
            href: shopCategory('labels', 'deep-freeze-labels'),
          },
          {
            label: 'Xylene & chemicals',
            href: shopCategory('labels', 'xylene-chemical-resistant-labels'),
          },
          {
            label: 'Autoclave',
            href: shopCategory('labels', 'autoclave-resistant-labels'),
          },
          {
            label: 'Heat',
            href: shopCategory('labels', 'heat-resistant-labels'),
          },
        ],
      },
      {
        heading: 'Printing method',
        links: [
          {
            label: 'DYMO® LabelWriter™ 550',
            href: shopSearch('DYMO LabelWriter 550'),
          },
          {
            label: 'DYMO® LabelWriter™ 450',
            href: shopSearch('DYMO LabelWriter 450'),
          },
          { label: 'Thermal transfer', href: shopSearch('thermal transfer labels') },
          { label: 'Direct thermal', href: shopSearch('direct thermal labels') },
          { label: 'Laser', href: shopSearch('laser labels') },
          { label: 'Inkjet sheet', href: shopSearch('inkjet sheet labels') },
          { label: 'Inkjet roll', href: shopSearch('inkjet roll labels') },
          { label: 'Handwritable', href: shopSearch('handwritable labels') },
        ],
      },
      {
        heading: 'Special features',
        links: [
          {
            label: 'Sticks to frozen',
            href: shopCategory('labels', 'cryogenic-labels', 'cryogenic-labels-for-frozen-surfaces'),
          },
          { label: 'Removable', href: shopSearch('removable labels') },
          { label: 'Wrap-around', href: shopSearch('wrap-around labels') },
          { label: 'Blackout', href: shopSearch('blackout labels') },
          { label: 'RFID', href: shopCategory('labels', 'rfid-labels') },
          { label: 'Tamper-evident', href: shopSearch('tamper-evident labels') },
          { label: 'Transparent', href: shopSearch('transparent labels') },
          { label: 'SnapPEEL™', href: shopSearch('SnapPEEL') },
          { label: 'SimPEEL™', href: shopSearch('SimPEEL') },
          { label: 'Destructible', href: shopSearch('destructible labels') },
          { label: 'Piggyback', href: shopSearch('piggyback labels') },
        ],
      },
    ],
  },
  {
    id: 'tapes',
    label: 'Tapes',
    href: LABTAG_TAPES_URL,
    image: '/media/nav/tapes.webp',
    imageAlt: 'Gloved hands applying clear cryo tape over a labeled centrifuge tube',
    columns: [
      {
        heading: 'Cold storage',
        links: [
          { label: 'Cryo tapes for metal racks', href: shopSearch('cryo tape metal racks') },
          { label: 'Cryo permanent tapes', href: shopSearch('cryo permanent tape') },
          { label: 'Cryo laminating tapes', href: shopSearch('cryo laminating tape') },
          { label: 'Tamper-evident cryo tapes', href: shopSearch('tamper-evident cryo tape') },
          { label: 'Cryo seal tapes', href: shopSearch('cryo seal tape') },
          { label: 'Removable freezer tapes', href: shopSearch('removable freezer tape') },
          { label: 'Frozen container tapes', href: shopSearch('frozen container tape') },
          { label: 'Freezer tapes', href: shopSearch('freezer tape') },
          { label: 'Autoclave-resistant tapes', href: shopSearch('autoclave tape') },
        ],
      },
      {
        heading: 'Lab workflow',
        links: [
          { label: 'GatorCUT™ technology', href: shopSearch('GatorCUT') },
          { label: 'Color lab tapes', href: shopSearch('color lab tape') },
          { label: 'Ultra-removable lab tapes', href: shopSearch('ultra-removable tape') },
          { label: 'Self-laminating tapes', href: shopSearch('self-laminating tape') },
          { label: 'Static cling tapes', href: shopSearch('static cling tape') },
          { label: 'Transparent lab tapes', href: shopSearch('transparent lab tape') },
          { label: 'Double-sided tapes', href: shopSearch('double-sided tape') },
          { label: 'Warning tapes', href: shopSearch('warning tape') },
          { label: 'Tape dispensers', href: shopSearch('tape dispenser') },
        ],
      },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    href: LABTAG_TAGS_URL,
    image: '/media/nav/tags.webp',
    imageAlt: 'NitroTAG hanging from a cryogenic storage rack in liquid nitrogen fog',
    columns: [
      {
        heading: 'Applications',
        links: [
          { label: 'PCR tags', href: shopSearch('PCR tags') },
          { label: 'Metal rack tags', href: shopSearch('metal rack tags') },
          { label: 'Asset tags', href: shopSearch('asset tags') },
          { label: 'RFID tags', href: shopSearch('RFID tags') },
          { label: 'Formalin tags', href: shopSearch('formalin tags') },
        ],
      },
      {
        heading: 'Find a fit',
        links: [
          { label: 'Browse label classes', href: LABTAG_LABELS_URL },
          { label: 'Use the label finder', href: LABTAG_FINDER_URL },
          { label: 'Request free samples', href: SAMPLE_PATH },
        ],
      },
    ],
  },
  {
    id: 'print',
    label: 'Print & scan',
    href: LABTAG_PRINT_URL,
    image: '/media/nav/print-scan.webp',
    imageAlt: 'Lab workstation with a thermal label printer, scanner, and label design on screen',
    columns: [
      {
        heading: 'Hardware',
        links: [
          { label: 'Printers', href: shopSearch('label printers') },
          { label: 'Printing kits', href: shopSearch('printing kits') },
          { label: 'Scanners', href: shopSearch('barcode scanners') },
          { label: 'Software', href: shopSearch('label software') },
        ],
      },
      {
        heading: 'Consumables & setup',
        links: [
          { label: 'Ribbons', href: shopSearch('thermal transfer ribbons') },
          { label: 'Label templates', href: TEMPLATES_PATH },
          { label: 'Setup videos', href: LABTAG_VIDEOS_URL },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    href: LABTAG_ACCESSORIES_URL,
    image: '/media/nav/accessories.webp',
    imageAlt: 'Gloved hands using a PikaTag applicator to place color dots on tube caps',
    columns: [
      {
        heading: 'Application tools',
        links: [
          { label: 'Markers', href: shopSearch('lab markers') },
          { label: 'Label applicators', href: shopSearch('label applicator') },
          { label: 'Ribbon takeup cores', href: shopSearch('ribbon takeup core') },
          { label: 'Ribbon holders', href: shopSearch('ribbon holder') },
          { label: 'Tape dispensers', href: shopSearch('tape dispenser') },
          { label: 'Cables', href: shopSearch('printer cables') },
        ],
      },
      {
        heading: 'Planning tools',
        links: [
          { label: 'Label finder', href: LABTAG_FINDER_URL },
          { label: 'Request samples', href: SAMPLE_PATH },
        ],
      },
    ],
  },
]
