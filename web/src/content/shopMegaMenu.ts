import { FINDER_PATH, SAMPLE_PATH, SHOP_PATH, TEMPLATES_PATH } from '@/content/labtagLinks'

function shop(...parts: string[]) {
  const path = parts.filter(Boolean).join('/')
  return path ? `${SHOP_PATH}/${path}` : SHOP_PATH
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
  { label: 'Shop by label class', href: shop('labels'), icon: 'tag' as const },
  { label: 'Find a label', href: FINDER_PATH, icon: 'finder' as const },
  { label: 'Browse by template', href: TEMPLATES_PATH, icon: 'template' as const },
] as const

export const SHOP_MEGA_PROMO = {
  kicker: 'Application-first shopping',
  title: 'Find the product family that matches your laboratory workflow.',
  cta: 'Browse products',
  href: SHOP_PATH,
} as const

export const SHOP_MEGA_CATEGORIES: ShopMegaCategory[] = [
  {
    id: 'labels',
    label: 'Labels',
    href: shop('labels'),
    image: '/media/nav/labels.webp',
    imageAlt: 'Gloved hands applying a Laser CryoSTUCK label to a frozen vial',
    columns: [
      {
        heading: 'By container',
        links: [
          { label: 'Tubes & vials', href: shop('tube-vial-container-cryo-labels') },
          { label: 'Microscope slides', href: shop('rfid-labels', 'rfid-labels-for-microscope-slides') },
          { label: 'Storage boxes', href: shop('labels') },
          { label: 'Bottles', href: shop('labels') },
          { label: 'Paraffin blocks', href: shop('rfid-labels', 'rfid-labels-for-paraffin-wax-blocks') },
          { label: 'Metal racks', href: shop('tags', 'hang-tags-for-metal-racks') },
          { label: 'PCR tubes & strips', href: shop('tags', 'tags-for-pcr-tubes-strips-plates') },
          { label: 'Microplates', href: shop('cryogenic-labels', 'cryogenic-labels-for-microplates') },
          { label: 'Blood bags', href: shop('medical-labels', 'blood-bag-labels') },
          { label: 'IVF straws', href: shop('cryogenic-labels', 'ivf-straws-cryo-labels') },
        ],
      },
      {
        heading: 'By resistance',
        links: [
          { label: 'Cryogenic −196°C', href: shop('cryogenic-labels') },
          { label: 'Deep-freeze −80°C', href: shop('deep-freeze-labels') },
          { label: 'Xylene & chemicals', href: shop('chemical-resistant-labels') },
          { label: 'Autoclave', href: shop('autoclave-resistant-labels') },
          { label: 'Heat', href: shop('heat-resistant-labels') },
        ],
      },
      {
        heading: 'Printing method',
        links: [
          { label: 'DYMO® LabelWriter™ 550', href: shop('cryogenic-labels-for-frozen-surfaces', 'dymo-labelwriter-5-series-cryogenic-labels-for-frozen-vials-surfaces') },
          { label: 'DYMO® LabelWriter™ 450', href: shop('cryogenic-labels-for-frozen-surfaces', 'dymo-compatible-labels-for-frozen-surfaces') },
          { label: 'Thermal transfer', href: shop('cryogenic-labels-for-frozen-surfaces', 'cryogenic-thermal-transfer-labels-for-frozen-surfaces') },
          { label: 'Direct thermal', href: shop('cryogenic-labels-for-frozen-surfaces', 'cryo-chemical-resistant-direct-thermal-labels-for-frozen-surfaces') },
          { label: 'Laser', href: shop('cryogenic-labels-for-frozen-surfaces', 'cryogenic-laser-labels-for-frozen-surfaces') },
          { label: 'Inkjet sheet', href: shop('labels') },
          { label: 'Inkjet roll', href: shop('labels') },
          { label: 'Handwritable', href: shop('labels') },
        ],
      },
      {
        heading: 'Special features',
        links: [
          { label: 'Sticks to frozen', href: shop('cryogenic-labels-for-frozen-surfaces') },
          { label: 'Removable', href: shop('labels') },
          { label: 'Wrap-around', href: shop('labels') },
          { label: 'Blackout', href: shop('labels') },
          { label: 'RFID', href: shop('rfid-labels') },
          { label: 'Tamper-evident', href: shop('labels') },
          { label: 'Transparent', href: shop('labels') },
          { label: 'SnapPEEL™', href: shop('labels') },
          { label: 'SimPEEL™', href: shop('labels') },
          { label: 'Destructible', href: shop('labels') },
          { label: 'Piggyback', href: shop('labels') },
        ],
      },
    ],
  },
  {
    id: 'tapes',
    label: 'Tapes',
    href: shop('tapes'),
    image: '/media/nav/tapes.webp',
    imageAlt: 'Gloved hands applying clear cryo tape over a labeled centrifuge tube',
    columns: [
      {
        heading: 'Cold storage',
        links: [
          { label: 'Cryo tapes for metal racks', href: shop('tapes') },
          { label: 'Cryo permanent tapes', href: shop('tapes') },
          { label: 'Cryo laminating tapes', href: shop('tapes') },
          { label: 'Tamper-evident cryo tapes', href: shop('tapes') },
          { label: 'Cryo seal tapes', href: shop('tapes') },
          { label: 'Removable freezer tapes', href: shop('tapes') },
          { label: 'Frozen container tapes', href: shop('tapes') },
          { label: 'Freezer tapes', href: shop('tapes') },
          { label: 'Autoclave-resistant tapes', href: shop('tapes') },
        ],
      },
      {
        heading: 'Lab workflow',
        links: [
          { label: 'GatorCUT™ technology', href: shop('tapes') },
          { label: 'Color lab tapes', href: shop('tapes') },
          { label: 'Ultra-removable lab tapes', href: shop('tapes') },
          { label: 'Self-laminating tapes', href: shop('tapes') },
          { label: 'Static cling tapes', href: shop('tapes') },
          { label: 'Transparent lab tapes', href: shop('tapes') },
          { label: 'Double-sided tapes', href: shop('tapes') },
          { label: 'Warning tapes', href: shop('tapes') },
          { label: 'Tape dispensers', href: shop('accessories') },
        ],
      },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    href: shop('tags'),
    image: '/media/nav/tags.webp',
    imageAlt: 'NitroTAG hanging from a cryogenic storage rack in liquid nitrogen fog',
    columns: [
      {
        heading: 'Applications',
        links: [
          { label: 'PCR tags', href: shop('tags', 'tags-for-pcr-tubes-strips-plates') },
          { label: 'Metal rack tags', href: shop('tags', 'hang-tags-for-metal-racks') },
          { label: 'Asset tags', href: shop('tags', 'asset-tags') },
          { label: 'RFID tags', href: shop('rfid-labels') },
          { label: 'Formalin tags', href: shop('tags', 'formalin-resistant-tags') },
        ],
      },
      {
        heading: 'Find a fit',
        links: [
          { label: 'Browse label classes', href: shop('labels') },
          { label: 'Use the label finder', href: FINDER_PATH },
          { label: 'Request free samples', href: SAMPLE_PATH },
        ],
      },
    ],
  },
  {
    id: 'print',
    label: 'Print & scan',
    href: shop('printers'),
    image: '/media/nav/print-scan.webp',
    imageAlt: 'Lab workstation with a thermal label printer, scanner, and label design on screen',
    columns: [
      {
        heading: 'Hardware',
        links: [
          { label: 'Printers', href: shop('printers') },
          { label: 'Printing kits', href: shop('printing-kits') },
          { label: 'Scanners', href: shop('scanners') },
          { label: 'Software', href: shop('software') },
        ],
      },
      {
        heading: 'Consumables & setup',
        links: [
          { label: 'Ribbons', href: shop('ribbons') },
          { label: 'Label templates', href: TEMPLATES_PATH },
          { label: 'Setup videos', href: shop('printers') },
        ],
      },
    ],
  },
  {
    id: 'accessories',
    label: 'Accessories',
    href: shop('accessories'),
    image: '/media/nav/accessories.webp',
    imageAlt: 'Gloved hands using a PikaTag applicator to place color dots on tube caps',
    columns: [
      {
        heading: 'Application tools',
        links: [
          { label: 'Markers', href: shop('markers') },
          { label: 'Label applicators', href: shop('accessories') },
          { label: 'Ribbon takeup cores', href: shop('accessories') },
          { label: 'Ribbon holders', href: shop('accessories') },
          { label: 'Tape dispensers', href: shop('accessories') },
          { label: 'Cables', href: shop('accessories') },
        ],
      },
      {
        heading: 'Planning tools',
        links: [
          { label: 'Label finder', href: FINDER_PATH },
          { label: 'Request samples', href: SAMPLE_PATH },
        ],
      },
    ],
  },
]
