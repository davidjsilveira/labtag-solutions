export type ShopCategory = {
  slug: string
  title: string
  blurb: string
  image: string
  families?: boolean
}

/** Top-level departments from https://www.labtag.com/shop/ */
export const SHOP_DEPARTMENTS: ShopCategory[] = [
  {
    slug: 'labels',
    title: 'Labels',
    blurb: 'Adhesive labels for barcoding, identification, and sample tracking in laboratory workflows.',
    image: '/media/nav/labels.webp',
    families: true,
  },
  {
    slug: 'tags',
    title: 'Tags',
    blurb:
      'Adhesive-free tags for barcode printers, ideal for the identification of material and samples in extreme environments. This includes non-adhesive printable tags that withstand extreme temperatures, with hang tags for the identification of metal racks used for storage in extreme cryogenic conditions. Specialized tags are also available, with chemical resistant tags specifically designed for long-term preservation of specimen in formalin, and durable, barcode printer compatible PCR tags for High-Profile 0.2 ml PCR tubes, strips, and plates, perfect for use in thermocyclers and storage in lab freezers.',
    image: '/media/nav/tags.webp',
  },
  {
    slug: 'tapes',
    title: 'Lab Tape',
    blurb: 'Laboratory tape for use in Cryogenic, freezer and general use environments for the identification of samples and material in the lab. These durable lab tapes are available in a variety of colors for easy identification and color coding, with a range of specialty tapes available for every application. This includes cryogenic lab tapes, such as CryoSTUCK® Tape for labeling already frozen containers, Cryo C-Kur™ tamper-evident tape for added security and CryoHUG™, an adhesive-free cryogenic seal tape. Self-laminating perforated tape, removable color lab tape, and autoclave tape are also available for use in non-cryogenic conditions.',
    image: '/media/nav/tapes.webp',
  },
  {
    slug: 'printers',
    title: 'Barcode Label Printers',
    blurb: 'High-performance printers designed for accurate barcode and label production.',
    image: '/media/dymo-labelwriter-550/Dymo-LabelWriter-550-Printer-2-2-1.jpg',
  },
  {
    slug: 'printing-kits',
    title: 'Printing Kits',
    blurb: 'Complete print-and-label solutions with everything needed to get started.',
    image: '/media/label-printing-solutions/Zebra-Printing-Kit.png',
  },
  {
    slug: 'ribbons',
    title: 'Ribbons',
    blurb: 'Thermal-transfer ink ribbons for sharp, long-lasting print quality.',
    image: '/media/label-printing-solutions/Ribbons-1.png',
  },
  {
    slug: 'scanners',
    title: 'Barcode Scanners & RFID Readers',
    blurb: 'Fast and accurate barcode scanners and RFID readers for sample tracking.',
    image: '/media/histology-labels/ivf-scanner.jpg',
  },
  {
    slug: 'software',
    title: 'Software',
    blurb: 'Software for designing, printing, and automating barcodes, RFID tags, and labels.',
    image: '/media/label-software/printing-labels.png',
  },
  {
    slug: 'markers',
    title: 'Markers',
    blurb: 'Laboratory-grade markers for clear, smudge-resistant writing on labels and surfaces.',
    image: '/media/cryogenic-labels/LT-13X6-multicolor-with-marker.png',
  },
  {
    slug: 'accessories',
    title: 'Accessories',
    blurb: 'Essential accessories to support labeling, printing, and laboratory workflows.',
    image: '/media/nav/accessories.webp',
  },
]

export const SHOP_HOME: ShopCategory = {
  slug: '',
  title: 'Shop LabTAG',
  blurb:
    'Adhesive labels, tags, tapes, printers, ribbons, scanners, and accessories for laboratory identification — from cryogenic storage to everyday sample tracking.',
  image: '/media/nav/labels.webp',
}

export const SHOP_LABELS: ShopCategory = {
  slug: 'labels',
  title: 'Labels',
  blurb:
    'We manufacture premium laboratory labels engineered for reliable identification in cryogenic storage, deep-freeze conditions, and demanding laboratory environments.',
  image: 'https://cdn.labtag.com/wp-content/uploads/JTTA-103-Use-vials-3-1.jpg',
  families: true,
}

/** Label families from https://www.labtag.com/shop/category/labels/ */
export const SHOP_FAMILIES: ShopCategory[] = [
  {
    slug: 'cryogenic-labels',
    title: 'Cryogenic Labels',
    blurb:
      'Shop premium-quality Cryogenic Labels. Cryogenic labels for the identification of vials, microtubes, freezer boxes, microplates, cell culture plates, plastic bags, and other containers for short and long-term storage in liquid and vapor phase liquid nitrogen (-196°C), laboratory freezers (-120°C, -80°C, -20°C), and transportation on dry ice.',
    image: 'https://cdn.labtag.com/wp-content/uploads/JTTA-103-Use-vials-3-1.jpg',
  },
  {
    slug: 'cryogenic-labels-for-frozen-surfaces',
    title: 'Cryogenic Labels for Frozen Surfaces',
    blurb:
      'CryoSTUCK® is a unique cryogenic label that can stick to already frozen vials at -80°C. No need to thaw valuable samples before labeling, thereby compromising the integrity of their contents. Once applied to frozen containers they can be stored in liquid nitrogen tanks at -196°C or low-temperature freezers (-80°C) for further preservation. Our CryoSTUCK labels already available for thermal-transfer printers, are now joined by our new Laser CryoSTUCK labels, for laser printers. Blackout and clear CryoSTUCK labels are also available, for over-labeling of important samples, including legacy vials. Our blackout labels will cover-up obsolete information, while our clear labels provide an extra layer of protection, laminating existing labels, without concealing their information.',
    image: 'https://cdn.labtag.com/wp-content/uploads/A4LCS-23-use4.jpg',
  },
  {
    slug: 'deep-freeze-labels',
    title: 'Deep-Freeze Labels',
    blurb:
      'Deep-freeze labels for storage in ultra-low temperature laboratory freezers (-80°C, -50°C, -20°C) and on dry ice. Designed to adhere to wet and damp surfaces, the durable, waterproof labels can resist multiple freeze-thaw cycles, and long-term storage. Ideal for labeling small diameter cry tubes, vials, cryo/freezer boxes, as well as PCR tubes and strips. The freezer-grade labels can be provided in rolls, or sheets, and in an assortment of colors for easy identification and color-coding. LabTAG also offers deep-freeze RFID labels, providing an improved way to track your samples, enhancing sample traceability and minimizing labeling errors. With a flexible UHF inlay, they have excellent adhesion to tubes, vials, boxes, and other containers.',
    image: 'https://cdn.labtag.com/wp-content/uploads/FJT-556-use1.jpg',
  },
  {
    slug: 'chemical-resistant-labels',
    title: 'Xylene & Chemical-Resistant Labels',
    blurb:
      'Chemical and solvent-resistant labels capable of withstanding direct exposure and immersion in xylene, toluene, alcohols, formalin, hexane, acetone, dimethyl sulfoxide (DMSO), methyl ethyl ketone (MEK), acetonitrile (ACN) as well as other chemicals and organic solvents. GA International provides labels for every step of the histological process, from microscope slide labels, to labels for tissue cassettes, and paraffin wax blocks, to color labels for chemical bottles and drums. There are also more specialized labels, including labels for resin emdedding, formalin preservation and for volumetric flasks.',
    image: 'https://cdn.labtag.com/wp-content/uploads/Solvent-resistant-labels-for-histology-procedures-2-e1564071355243.png',
  },
  {
    slug: 'autoclave-resistant-labels',
    title: 'Autoclave-Resistant Labels',
    blurb:
      'GA International offers high-temperature resistant labels for the identification of materials that will undergo the sterilization process. These autoclave-resistant labels are ideal for labeling metal (stainless steel and aluminum), glass (Pyrex), plastic (Polypropylene) surfaces, and Genesis™ sterilization containers that will be sterilized using steam autoclaves, dry heat ovens, gamma irradiators or by ethylene oxide gas. The versatile autoclavable labels, are provided for thermal-transfer, laser and inkjet printers, and are perfectly suited for labeling surgical instruments and trays, glass and plastic labware, blister packs, medical equipment and more. The autoclave labels are also offered with a range of additional features, such as blackout labels and wrap-around labels, allowing the labels to cover-up pre-existing information, or to be used for cryogenic storage.',
    image: 'https://cdn.labtag.com/wp-content/uploads/AUTR-56-Use.png',
  },
  {
    slug: 'heat-resistant-labels',
    title: 'Heat-Resistant Labels',
    blurb:
      'Our heat-resistant labels are made of a durable thermoplastic film, designed to endure extended periods at extreme temperatures. Perfect for use in various high temperature environments and applications, including in heated water baths, lab incubators, and for heat inactivation protocols. We also offer heat-resistant labels intended for use in sterilization procedures that use high heat and pressure conditions.',
    image: 'https://cdn.labtag.com/wp-content/uploads/DH-7-use3-1.jpg',
  },
  {
    slug: 'rfid-labels',
    title: 'RFID Labels',
    blurb:
      'GA International’s line of radio-frequency identification (RFID) labels and tags are the perfect solution for printing visible data (text, graphics, and barcodes) as well as concurrent electronic encoding via UHF technology. Their integrated UHF inlay can be encoded with up to 32 hexadecimal characters of information and allow multiple tags to be scanned simultaneously, without the need for a direct line-of-sight. We offer a variety of RFID solutions for various applications, including deep freeze storage, cryogenic storage in liquid and vapor phase liquid nitrogen, sterilization procedures, such as steam autoclaving, and chemical exposure, commonly encountered during histology protocols.',
    image: 'https://cdn.labtag.com/wp-content/uploads/RFID-Custom-Color-Labels.jpg',
  },
  {
    slug: 'general-use-labels',
    title: 'General-Use Labels',
    blurb:
      'General use paper labels are provided in a range of colors, ideal for use as shipping labels, color coding, price tagging, in warehouses, logistics, and sorting facilities as well as general office and laboratory organization. They are printable using your printer of choice, including thermal (thermal-transfer and direct thermal) and digital (laser and inkjet), and can be inscribed with markers and ballpoint pens. Specialty labels are also available, in unique formats, such as static cling and water dissolvable, and for specific applications, including warning and calibration labels.',
    image: 'https://cdn.labtag.com/wp-content/uploads/ivf-gpa-28-e1705606211927.jpg',
  },
  {
    slug: 'medical-labels',
    title: 'Medical Labels',
    blurb:
      'LabTAG offers a variety of medical labels designed for the healthcare field, providing an accurate and efficient way to identify medication, charts, specimens, as well as patient information and medical equipment. This includes a range of durable pre-printed medical labels, in vibrant colors, for use in hospitals, clinics, pharmacies, and clinical labs. We also offer printable healthcare labels for identifying blood bags and syringes that can be printed with high-resolution information, as well as 1D and/or 2D barcodes for improved tracking.',
    image: 'https://cdn.labtag.com/wp-content/uploads/H-JTTA-14-use.png',
  },
]

export const SHOP_TUBE_VIAL: ShopCategory = {
  slug: 'tube-vial-container-cryo-labels',
  title: 'Tube, Vial & Container Cryo Labels',
  blurb:
    'Cryogenic labels for cryo vials, microtubes, cryo/freezer boxes and other cryogenic containers. Available for thermal-transfer, direct thermal, laser and inkjet printers, GA International provides cryogenic labels for every application, regardless of your specific needs. These cryo labels are designed to withstand long-term storage in liquid phase and vapor phase liquid nitrogen (−196°C), laboratory freezers (−120°C, −80°C and −20°C), and transportation on dry ice. The freezer labels can be provided in a range of sizes, configurations and colors, able to conform to any surface, and for easy color coding.',
  image: 'https://cdn.labtag.com/wp-content/uploads/CL-23-use3.jpg',
}

/** Child categories from each family's Magento "Shop by" strips. */
export const SHOP_CHILD_MAP: Record<string, ShopCategory[]> = {
  'cryogenic-labels': [
    SHOP_TUBE_VIAL,
    {
      slug: 'cryogenic-labels-for-microplates',
      title: 'Microplates & Dishes',
      blurb:
        'Water-proof thermoplastic labels ideal for use on cell culture plates, microwell plates, 96 and 384 well PCR plates and Petri dishes. Available for thermal-transfer and laser printers, as well as for automated printers and labelers. Easy to manipulate, these labels remain straight upon removal from the support liner which facilitates the application of the label to any multi-well plate or Petri dish. Specifically designed to fit the sides of both flat and round bottom microtiter plates. The culture plate labels are excellent for printing both 1-D and 2-D barcodes, as well as serial numbers, and alphanumeric text.',
      image: 'https://cdn.labtag.com/wp-content/uploads/TRCL-11-use.png',
    },
    {
      slug: 'ivf-straws-cryo-labels',
      title: 'IVF Straws',
      blurb:
        'Our Cryo-StrawTAG™ cryogenic labels have been carefully tested inside liquid nitrogen and approved for 0.25 ml and 0.5 ml IVF straws of different configurations. These specialty cryo straw labels are designed to withstand long-term preservation inside liquid nitrogen Dewars (liquid and vapor phase) as well as freezers and dry ice transportation. The cryo IVF straw labels withstand the vitrification process which is an ultra-rapid freezing of oocytes and embryos used to avoid the formation of ice crystals. These Cryo-StrawTAG labels are compatible with all standard cryo straws as well as high-security straws such as Kitazato®, and CBS™ vitrification straws. The adhesive and the facestock material easily conform to the small diameter of the straws and the label adheres strongly and permanently. The information can be printed or handwritten on the white part of the label with the transparent part laminating over and safeguarding the information from any chemical or physical exposure. For convenience, we provide these labels in white and in a number of colors for color coding and easy identification purposes.',
      image: 'https://cdn.labtag.com/wp-content/uploads/CST-29-use.jpg',
    },
  ],
  'cryogenic-labels-for-frozen-surfaces': [
    {
      slug: 'cryogenic-laser-labels-for-frozen-surfaces',
      title: 'Laser',
      blurb: 'Cryogenic labels for frozen surfaces, laser printable.',
      image: 'https://cdn.labtag.com/wp-content/uploads/LCS-125-Use5-2.jpg',
    },
    {
      slug: 'cryogenic-thermal-transfer-labels-for-frozen-surfaces',
      title: 'Thermal-Transfer',
      blurb: 'Cryogenic labels for frozen surfaces, thermal-transfer printable.',
      image: 'https://cdn.labtag.com/wp-content/uploads/L2FSA-348-use1.jpg',
    },
    {
      slug: 'dymo-labelwriter-5-series-cryogenic-labels-for-frozen-vials-surfaces',
      title: 'DYMO® LabelWriter™ 5-Series',
      blurb: 'Cryogenic labels for frozen surfaces for DYMO LabelWriter 5-Series printers.',
      image: 'https://cdn.labtag.com/wp-content/uploads/LWCS-505-WH.jpg',
    },
    {
      slug: 'dymo-compatible-labels-for-frozen-surfaces',
      title: 'DYMO® LabelWriter™ 450-Series',
      blurb: 'Cryogenic labels for frozen surfaces for DYMO LabelWriter 450-Series printers.',
      image: 'https://cdn.labtag.com/wp-content/uploads/EDCS-070-Use2-edited.jpg',
    },
    {
      slug: 'cryo-chemical-resistant-direct-thermal-labels-for-frozen-surfaces',
      title: 'Direct Thermal',
      blurb: 'Direct-thermal cryogenic labels for frozen surfaces.',
      image: 'https://cdn.labtag.com/wp-content/uploads/DTU-560SBNOT-Use6-1.jpg',
    },
  ],
  'rfid-labels': [
    {
      slug: 'rfid-labels-for-tubes-vials-containers',
      title: 'Tubes & Vials',
      blurb: 'RFID labels for cryogenic vials, microtubes, and containers.',
      image: 'https://cdn.labtag.com/wp-content/uploads/RF3-JTTA-9-use2-1.jpg',
    },
    {
      slug: 'rfid-labels-for-microplates',
      title: 'Microplates',
      blurb: 'RFID labels for microplates.',
      image: 'https://cdn.labtag.com/wp-content/uploads/RFP-550-Use2.jpg',
    },
    {
      slug: 'rfid-labels-for-microscope-slides',
      title: 'Microscope Slides',
      blurb: 'RFID labels for microscope slides.',
      image: 'https://cdn.labtag.com/wp-content/uploads/RF3-FTT-98-use1.jpg',
    },
    {
      slug: 'rfid-labels-for-paraffin-wax-blocks',
      title: 'Paraffin Blocks',
      blurb: 'RFID labels for paraffin wax blocks.',
      image: 'https://cdn.labtag.com/wp-content/uploads/RF3-PRF-67-use1.jpg',
    },
    {
      slug: 'cryogenic-rfid-labels-for-frozen-surfaces',
      title: 'Frozen Surfaces',
      blurb: 'RFID labels that stick to frozen surfaces.',
      image: 'https://cdn.labtag.com/wp-content/uploads/RF3-L2FSA-348-use6.jpg',
    },
  ],
  'medical-labels': [
    {
      slug: 'blood-bag-labels',
      title: 'Blood Bags',
      blurb:
        'LabTAG offers ultra-durable secondary blood bag labels for blood banks designed to be applied over the existing primary label. These deep-freeze labels can withstand prolonged storage in refrigerators and freezers (as low as -80°C) and resist spraying with alcohols and centrifugation. They can be printed with relevant information and barcodes, perfect for identification and storage of whole blood, resuspensions, and components, including red blood cells, platelets, and plasma.',
      image: 'https://cdn.labtag.com/wp-content/uploads/Blood-Bag-Labels.jpg',
    },
    {
      slug: 'medical-equipment-labels',
      title: 'Medical Equipment',
      blurb: 'Labels for medical equipment.',
      image: 'https://cdn.labtag.com/wp-content/uploads/CALA-001-illu1.jpg',
    },
    {
      slug: 'syringe-identification-labels',
      title: 'Syringes',
      blurb:
        'These syringe labels are intended for the secure and accurate identification of medications and vaccines used in hospitals, pharmacies, as well as medical and clinical laboratory settings. Their flag design ensures syringes are clearly labeled without obscuring their contents. They can be used and stored at room temperature, in refrigerators (+4°C) as well as in freezers (-20°C, -40°C, -80°C). We also offer these labels pre-printed with your desired information in various colors for quick and easy identification.',
      image: 'https://cdn.labtag.com/wp-content/uploads/SYRA-2-use1.jpg',
    },
  ],
  tags: [
    {
      slug: 'tags-for-pcr-tubes-strips-plates',
      title: 'PCR Tags',
      blurb:
        'Durable, barcode printer compatible PCR tags for High-Profile 0.2 ml PCR tubes, strips, and plates, perfect for use in thermocyclers and storage in lab freezers.',
      image: 'https://cdn.labtag.com/wp-content/uploads/PID-1-multicolor-use2.jpg',
    },
    {
      slug: 'hang-tags-for-metal-racks',
      title: 'Metal Rack Tags',
      blurb:
        'These cryo tags are designed for identifying metal racks used for long-term storage of containers in cryogenic conditions. Available in various colors and color combinations, they provide a means to quickly identify the contents of metal racks used in freezers and liquid nitrogen tanks to store and organize sample containers. They are provided with durable cryogenic labels, that can be written-on using permanent cryo markers.',
      image: 'https://cdn.labtag.com/wp-content/uploads/CID-02-Use.png',
    },
    {
      slug: 'asset-tags',
      title: 'Asset Tags',
      blurb:
        'Our asset tags can be attached to a variety of equipment and other assets to identify them for tracking, inventory, and accountability purposes. This includes inkjet printable tags as well as thermal-transfer RFID tags that further enhance tracking, being able to scanned in a 360° radius, without the need for a direct line of sight.',
      image: 'https://cdn.labtag.com/wp-content/uploads/ALA-64-use2.jpg',
    },
    {
      slug: 'formalin-resistant-tags',
      title: 'Formalin Tags',
      blurb: 'Chemical resistant tags specifically designed for long-term preservation of specimen in formalin.',
      image: 'https://cdn.labtag.com/wp-content/uploads/ALA-25-use1-2.jpg',
    },
  ],
}

const ALL_CHILDREN = Object.values(SHOP_CHILD_MAP).flat()

const BY_SLUG = new Map<string, ShopCategory>([
  ...SHOP_DEPARTMENTS.map((item) => [item.slug, item] as const),
  ...SHOP_FAMILIES.map((item) => [item.slug, item] as const),
  ...ALL_CHILDREN.map((item) => [item.slug, item] as const),
  [SHOP_TUBE_VIAL.slug, SHOP_TUBE_VIAL],
  [SHOP_LABELS.slug, SHOP_LABELS],
])

export function findShopCategory(slug: string) {
  if (!slug) return SHOP_HOME
  return BY_SLUG.get(slug) ?? null
}

export function childrenOf(slug: string) {
  if (slug === 'labels') return SHOP_FAMILIES
  return SHOP_CHILD_MAP[slug] ?? []
}

export function parentOf(slug: string) {
  return Object.keys(SHOP_CHILD_MAP).find((parent) => SHOP_CHILD_MAP[parent].some((item) => item.slug === slug)) ?? null
}

export function isLabelListing(slug: string) {
  if (!slug) return false
  if (SHOP_DEPARTMENTS.some((item) => item.slug === slug)) return true
  if (SHOP_FAMILIES.some((item) => item.slug === slug)) return true
  return ALL_CHILDREN.some((item) => item.slug === slug)
}
