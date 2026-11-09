import {
  CONTACT_PATH,
  LABTAG_TEMPLATES_HUB_URL,
  SAMPLE_PATH,
} from '@/content/labtagLinks'

export const TEMPLATE_SR1_PATH = '/templates/sr-1'

export const TEMPLATE_SR1 = {
  id: 'SR-1',
  slug: 'sr-1',
  name: 'Standard Roll Rectangle Template',
  sizeMetric: '25.4 × 11.1 mm',
  sizeImperial: '1 × 0.4375 in',
  shape: 'Rectangle',
  format: 'Standard roll',
  badge: 'Template',
  image: {
    primary: '/media/templates/SR-1.jpg',
    fallback: 'https://cdn.labtag.com/wp-content/uploads/SR-1.jpg',
    alt: 'SR-1 rectangle label template diagram',
  },
  gallery: [
    { id: 'diagram', label: 'Template diagram', tone: 'diagram' },
    { id: 'white', label: 'White', tone: 'white' },
    { id: 'yellow', label: 'Yellow', tone: 'yellow' },
    { id: 'blue', label: 'Blue', tone: 'blue' },
    { id: 'more', label: 'More colors', tone: 'more', moreCount: 3 },
  ],
  downloadHref: 'https://www.labtag.com/templates/sr-1/',
  compareHref: LABTAG_TEMPLATES_HUB_URL,
  breadcrumbs: [
    { label: 'Home', to: '/' },
    { label: 'Templates', href: LABTAG_TEMPLATES_HUB_URL },
    { label: 'SR-1' },
  ],
  specs: [
    { label: 'Label shape', value: 'Rectangle' },
    { label: 'Label size', valueMetric: '25.4 mm × 11.1 mm', valueImperial: '1 in × 0.4375 in' },
    { label: 'Format', value: 'Standard roll' },
    { label: 'Labels per row', value: '1' },
    { label: 'Printer type', value: 'Thermal-transfer' },
  ],
  compatibleLabels: [
    {
      sku: 'FJT-1',
      href: 'https://www.labtag.com/?s=FJT-1',
      product: 'Permanent deep-freeze labels',
      material: 'Thermal-transfer',
      colors: '3 options',
      printingMethod: 'Thermal transfer',
      minTemp: '−80°C',
      maxTemp: '+110°C',
      features: '—',
      resistances: 'Deep-freeze, heat',
    },
    {
      sku: 'JTTA-1',
      href: 'https://www.labtag.com/?s=JTTA-1',
      product: 'Cryogenic labels',
      material: 'Thermal-transfer',
      colors: '3 options',
      printingMethod: 'Thermal transfer',
      minTemp: '−196°C',
      maxTemp: '+110°C',
      features: '—',
      resistances: 'Cryo, deep-freeze, heat',
    },
  ],
  faqs: [
    {
      id: 'what-is-sr1',
      question: 'What is the SR-1 template used for?',
      answer:
        'SR-1 is a standard roll rectangle template at 25.4 mm × 11.1 mm (1 in × 0.4375 in). It matches LabTAG thermal-transfer label SKUs that share this footprint, including FJT-1 and JTTA-1.',
    },
    {
      id: 'which-software',
      question: 'Which software can I use with this template?',
      answer:
        'Design the layout in label software such as BarTender, cablabel S3, or ZebraDesigner. Use the template size and one-across roll format when you create the stock.',
    },
    {
      id: 'thermal-templates',
      question: 'Where do I find templates for thermal-transfer labels?',
      answer:
        'Thermal-transfer and direct-thermal layouts are built in label software. The wizard walks through the stock size. Contact support if you want help building the template.',
    },
    {
      id: 'black-mark',
      question: 'Why do my labels have a black mark on the back or a notch between labels?',
      answer:
        'Those marks help the printer sense the gap or black mark between labels. Match the sensor mode in the printer driver to the stock you are using.',
    },
    {
      id: 'custom-size',
      question: 'Can I get a custom size if SR-1 is not the right fit?',
      answer:
        'Yes. LabTAG can produce custom label sizes and printed layouts. Contact us with the container, temperature range, and printer so we can match the stock.',
    },
  ],
  cta: {
    title: 'Not sure this template fits your workflow?',
    body: 'Our labeling specialists can match a size, material, and printer to your application.',
    primary: { label: 'Ask an expert', href: CONTACT_PATH },
    secondary: { label: 'Get a free sample', href: SAMPLE_PATH },
  },
} as const
