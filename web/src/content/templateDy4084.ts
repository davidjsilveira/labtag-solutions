import {
  CONTACT_PATH,
  LABTAG_TEMPLATES_HUB_URL,
  SAMPLE_PATH,
  TEMPLATES_PATH,
} from '@/content/labtagLinks'

export const TEMPLATE_DY4084_PATH = '/templates/dy4-084'

export const TEMPLATE_DY4084 = {
  id: 'DY4-084',
  slug: 'dy4-084',
  name: 'DYMO Rectangle and Circle Template',
  category: 'DYMO',
  sizeMetric: '31.75 × 12.7 mm + 11.1 mm',
  sizeImperial: '1.25 × 0.5 in + 0.437 in',
  shape: 'Rectangle + Circle',
  format: 'DYMO',
  image: {
    primary: '/media/templates/DY4-084.jpg',
    fallback: 'https://cdn.labtag.com/wp-content/uploads/tmb-dymo-084-c.jpg',
    alt: 'DY4-084 rectangle and circle labels on a DYMO roll',
  },
  file: {
    kind: 'download',
    label: 'Download ZIP',
    fileType: 'ZIP',
    href: 'https://cdn.labtag.com/wp-content/uploads/DYMO_084.zip',
    note: 'This file includes both the DYMO Connect template and the DYMO Label Software template.',
    logos: [
      {
        src: '/media/templates/dymo-connect.png',
        alt: 'DYMO Connect',
      },
      {
        src: '/media/templates/dymo-label-software.png',
        alt: 'DYMO Label Software',
      },
    ],
  },
  compareHref: LABTAG_TEMPLATES_HUB_URL,
  breadcrumbs: [
    { label: 'Home', to: '/' },
    { label: 'Templates', to: TEMPLATES_PATH },
    { label: 'DY4-084' },
  ],
  specs: [
    { label: 'Label shape', value: '1 rectangle + 1 circle' },
    {
      label: 'Label size',
      valueMetric: '31.75 mm × 12.7 mm + 11.1 mm',
      valueImperial: '1.25 in × 0.5 in + 0.437 in',
    },
    { label: 'Format', value: 'DYMO' },
    { label: 'Printers', value: 'LabelWriter 450 series and 4XL' },
  ],
  compatibleLabels: [
    {
      sku: 'EDCS-084WH',
      href: 'https://www.labtag.com/shop/product/dymo-compatible-cryogenic-labels-for-frozen-surfaces-1-25-x-0-5-0-437-patented-edcs-084wh/',
      product: 'DYMO-compatible cryogenic labels for frozen surfaces',
      material: 'Direct thermal',
      colors: 'White',
      printingMethod: 'DYMO LabelWriter',
      minTemp: '−196°C',
      maxTemp: '+70°C',
      features: 'Sticks to frozen',
      resistances: 'Cryo, deep-freeze, xylene and chemicals',
    },
    {
      sku: 'EDFT-084',
      href: 'https://www.labtag.com/shop/product/transparent-dymo-compatible-deep-freeze-labels-1-25-x-0-5-0-437-edft-084-patent-pending/',
      product: 'Transparent DYMO-compatible deep-freeze labels',
      material: 'Direct thermal',
      colors: 'Transparent',
      printingMethod: 'DYMO LabelWriter',
      minTemp: '−80°C',
      maxTemp: '+70°C',
      features: 'Transparent',
      resistances: 'Deep-freeze, xylene and chemicals, histo stains',
    },
  ],
  faqs: [
    {
      id: 'labelwriter-550',
      question: 'Are these templates compatible with LabelWriter 550 series or 5XL printers?',
      answer: 'No. These templates are only for LabelWriter 450 series and 4XL printers.',
    },
    {
      id: 'non-dymo',
      question: 'Are these templates compatible with non-DYMO printers?',
      answer: 'No. These templates are meant to be used with DYMO software and printers.',
    },
  ],
  cta: {
    title: 'Not sure this template fits your workflow?',
    body: 'Our labeling specialists can match a size, material, and printer to your application.',
    primary: { label: 'Ask an expert', href: CONTACT_PATH },
    secondary: { label: 'Get a free sample', href: SAMPLE_PATH },
  },
} as const
