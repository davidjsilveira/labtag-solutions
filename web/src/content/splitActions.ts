import {
  LABTAG_CRYO_SHOP_URL,
  LABTAG_CRYO_VIDEOS_URL,
  LABTAG_SAMPLE_URL,
  LABTAG_SHOP_URL,
  LABTAG_VIDEOS_URL,
} from '@/content/labtagLinks'

const VIDEOS = LABTAG_VIDEOS_URL.replace(/\/$/, '')
const SHOP = LABTAG_SHOP_URL.replace(/\/$/, '')

/** Section slug → LabTAG videos “Label Container” filter. */
const VIDEO_CONTAINER_BY_SECTION: Record<string, string> = {
  'tubes-vials-and-boxes': 'tubes-vials',
  'tubes-and-vials': 'tubes-vials',
  microplates: 'microplates',
  pcr: 'pcr',
  'pcr-tubes': 'pcr',
  'pcr-strips': 'pcr',
  'identi-pcr': 'pcr',
  platetag: 'microplates',
  'metal-racks-and-canes': 'metal-rack',
  'cryo-straws': 'straw',
  'cryo-strawtag': 'straw',
  straws: 'straw',
  'self-laminating-wrap-around': 'tubes-vials',
  'cryostuck-frozen-surfaces': 'tubes-vials',
  'side-labels-for-culture-plates': 'microplates',
  'bottom-labels-for-culture-plates': 'microplates',
  'patient-record-labels': 'tubes-vials',
  nitrotag: 'tubes-vials',
  metalitag: 'metal-rack',
  pintag: 'tubes-vials',
  boxes: 'boxes',
  'microscope-slides': 'microscope-slides',
  'blood-bags': 'blood-bag',
  'blood-bag': 'blood-bag',
  syringes: 'syringe',
  'syringe-labels': 'syringe',
  glassware: 'glassware',
}

/** Section slug → LabTAG videos “Printing Method” filter. */
const VIDEO_PRINT_BY_SECTION: Record<string, string> = {
  'thermal-transfer': 'thermal-transfer',
  'direct-thermal': 'direct-thermal',
  'direct-thermal-cryostuck': 'direct-thermal',
  'cryo-lazrtag': 'laser',
  laser: 'laser',
  inkjet: 'inkjet',
  'dymo-450': 'dymo',
  'dymo-labelwriter-450-series': 'dymo',
  'dymo-550-cryostuck': 'dymo',
  'dymo-labelwriter-550-series': 'dymo',
  'labelwriter-550-printer': 'dymo',
  'cryostuck-labels': 'dymo',
  'frozen-vials': 'dymo',
  'simpeel-frozen-surfaces': 'dymo',
  'cryogenic-labels': 'dymo',
  'simpeel-cryogenic': 'dymo',
  'transparent-deep-freeze': 'dymo',
  'heat-resistant': 'dymo',
  'water-dissolvable': 'dymo',
  'general-use': 'dymo',
  'connect-software': 'dymo',
  '2-x-1': 'dymo',
  '2-x-0-25': 'dymo',
  '1-x-1': 'dymo',
  '1-x-0-5': 'dymo',
  'dymo-compatible': 'dymo',
  dymo: 'dymo',
  writable: 'writable',
}

/** Section slug → LabTAG videos “Label Feature” filter. */
const VIDEO_FEATURE_BY_SECTION: Record<string, string> = {
  'frozen-surface-cryostuck': 'frozen-containers',
  'frozen-surfaces': 'frozen-containers',
  cryostuck: 'frozen-containers',
  'cryostuck-frozen-surfaces': 'frozen-containers',
  'clear-over-label': 'transparent',
  blackout: 'blackout',
  'blackout-removable': 'blackout',
  'tamper-evident': 'tamper-proof',
  snappeel: 'self-laminating',
  'snappeel-technology': 'self-laminating',
  precision: 'self-laminating',
  efficiency: 'self-laminating',
  visibility: 'self-laminating',
  fjt: 'self-laminating',
  jtta: 'self-laminating',
  dtu: 'self-laminating',
  lcs: 'self-laminating',
  'self-laminating-wrap-around': 'wrap-around',
  'clear-laminating': 'transparent',
  'wrap-around': 'wrap-around',
  'color-coding': 'color',
  transparent: 'transparent',
  rfid: 'rfid',
  'rfid-solutions': 'rfid',
  'rfid-labels-and-smart-labels': 'rfid',
  'rfid-parafitag': 'rfid',
  'rfid-cryo-wraptag': 'rfid',
  'cryogenic-rfid-vial-labels': 'rfid',
  'autoclave-resistant-rfid-labels': 'rfid',
  'deep-freeze-rfid-microplate-labels': 'rfid',
  'xylene-and-chemical-resistant-labels': 'rfid',
  'rfid-tags': 'rfid',
  'rfid-printers': 'rfid',
  'rfid-readers': 'rfid',
  'wide-scanning-radius': 'rfid',
  'printed-and-encoded': 'rfid',
  'flexible-inlays': 'rfid',
  applications: 'rfid',
  'custom-rfid': 'rfid',
  'industrial-rfid': 'rfid',
  'cryo-c-kurtag': 'tamper-proof',
  'c-kur-tamper-evident-cryo-tape': 'tamper-proof',
  'cryostuck-tape': 'frozen-containers',
  gatorcut: 'gatorcut',
  'gatorcut-technology': 'gatorcut',
  'freezertape-tg': 'gatorcut',
  'freezertape-tdf': 'gatorcut',
  frozenstuck: 'gatorcut',
  nitrotape: 'gatorcut',
  'cryostuck-tfng': 'gatorcut',
  'cryostuck-txs': 'gatorcut',
  'cryostuck-txc': 'gatorcut',
  ubicling: 'gatorcut',
  'clear-ubicling': 'gatorcut',
  steritape: 'gatorcut',
}

/**
 * Section slug → short shop CTA label + search query.
 * Label appears as “Shop {label}”.
 */
const SHOP_BY_SECTION: Record<string, { label: string; query: string }> = {
  'tubes-vials-and-boxes': { label: 'Tubes & Vials', query: 'cryogenic tubes vials' },
  'tubes-and-vials': { label: 'Tubes & Vials', query: 'cryogenic tubes vials' },
  microplates: { label: 'Microplates', query: 'cryogenic microplates' },
  pcr: { label: 'PCR', query: 'cryogenic PCR' },
  'pcr-tubes': { label: 'PCR Tubes', query: 'PCR tube labels' },
  'pcr-strips': { label: 'PCR Strips', query: 'PCR strip labels' },
  'identi-pcr': { label: 'IDenti-PCR', query: 'IDenti-PCR' },
  platetag: { label: 'PlateTAG', query: 'PlateTAG PCR' },
  'pcr-tagtrax': { label: 'PCR-TagTrax', query: 'PCR-TagTrax' },
  applicators: { label: 'Applicators', query: 'PCR label applicator' },
  'cryogenic-adhesive': { label: 'PCR Labels', query: 'cryogenic PCR labels' },
  'barcode-ready': { label: 'Barcode PCR Labels', query: 'barcode PCR labels' },
  'hand-writable': { label: 'Writable PCR Labels', query: 'writable PCR labels' },
  'metal-racks-and-canes': { label: 'Metal Racks', query: 'cryogenic metal racks' },
  'cryo-straws': { label: 'Cryo Straws', query: 'cryo straw labels' },
  straws: { label: 'Cryo Straws', query: 'cryo straw labels' },
  'thermal-transfer': { label: 'Thermal-Transfer', query: 'thermal transfer cryogenic' },
  'direct-thermal': { label: 'Direct Thermal', query: 'direct thermal cryogenic' },
  laser: { label: 'Laser', query: 'laser cryogenic labels' },
  inkjet: { label: 'Inkjet', query: 'inkjet cryogenic' },
  'chemical-resistance': { label: 'ResiTAG', query: 'ResiTAG' },
  'heat-resistance': { label: 'ResiTAG', query: 'ResiTAG heat resistant' },
  'printable-ids': { label: 'ResiTAG', query: 'ResiTAG barcode' },
  'capsule-and-mold-fit': { label: 'ResiTAG', query: 'ResiTAG capsules' },
  'dymo-450': { label: 'DYMO 450', query: 'DYMO 450 cryogenic' },
  'dymo-labelwriter-450-series': { label: 'DYMO 450', query: 'DYMO 450 cryogenic' },
  'dymo-550-cryostuck': { label: 'DYMO 550', query: 'DYMO 550 CryoSTUCK' },
  'dymo-labelwriter-550-series': { label: 'DYMO 550', query: 'DYMO 550 CryoSTUCK' },
  'cryostuck-labels': { label: 'CryoSTUCK', query: 'CryoSTUCK DYMO LWCS' },
  'frozen-vials': { label: 'Frozen Vial Labels', query: 'DYMO EDCS cryogenic' },
  'simpeel-frozen-surfaces': {
    label: 'SimPEEL Frozen',
    query: 'DYMO SPEDCS SimPEEL',
  },
  'cryogenic-labels': { label: 'DYMO Cryo Labels', query: 'DYMO EC1F cryogenic' },
  'simpeel-cryogenic': { label: 'SimPEEL Cryogenic', query: 'DYMO SPED1F SimPEEL' },
  'transparent-deep-freeze': {
    label: 'Transparent Deep-Freeze',
    query: 'DYMO EDFT transparent',
  },
  'heat-resistant': { label: 'Heat-Resistant', query: 'DYMO EDAP heat resistant' },
  'water-dissolvable': {
    label: 'Water Dissolvable',
    query: 'DYMO EDWA water dissolvable',
  },
  'general-use': { label: 'General Use', query: 'DYMO ECY labels' },
  'labelwriter-550-printer': { label: 'DYMO 550', query: 'DYMO LabelWriter 550' },
  'connect-software': { label: 'DYMO Connect', query: 'DYMO LabelWriter 550' },
  '2-x-1': { label: 'LWCS-501', query: 'LWCS-501' },
  '2-x-0-25': { label: 'LWCS-502', query: 'LWCS-502' },
  '1-x-1': { label: 'LWCS-504', query: 'LWCS-504' },
  '1-x-0-5': { label: 'LWCS-505', query: 'LWCS-505' },
  'dymo-compatible': { label: 'DYMO', query: 'DYMO chemical resistant labels' },
  'drums-and-ibc-totes': { label: 'Drum Labels', query: 'GHS drum IBC labels' },
  'bottles-and-secondary-containers': {
    label: 'Bottle Labels',
    query: 'solvent resistant bottle labels',
  },
  'reagent-vials-and-tubes': {
    label: 'Vial Labels',
    query: 'chemical resistant vial labels',
  },
  'ghs-container-labels': { label: 'GHS Labels', query: 'GHS chemical labels' },
  'hmis-warning-labels': { label: 'HMIS Labels', query: 'HMIS warning labels' },
  'nfpa-warning-labels': { label: 'NFPA Labels', query: 'NFPA warning labels' },
  'calibration-and-maintenance': {
    label: 'Calibration Labels',
    query: 'calibration maintenance labels',
  },
  writable: { label: 'Writable', query: 'writable cryogenic dots' },
  automation: { label: 'Automation', query: 'automation cryogenic labels' },
  'blood-bag': { label: 'Blood Bag', query: 'blood bag labels' },
  'blood-bags': { label: 'Blood Bag', query: 'blood bag labels' },
  rectangles: { label: 'Rectangles', query: 'deep freeze rectangle labels' },
  circles: { label: 'Circles', query: 'deep freeze circle labels' },
  'rectangles-circles': { label: 'Rectangles + Circles', query: 'deep freeze labels' },
  'frozen-surface-cryostuck': { label: 'CryoSTUCK', query: 'CryoSTUCK' },
  'frozen-surfaces': { label: 'CryoSTUCK', query: 'CryoSTUCK frozen' },
  cryostuck: { label: 'CryoSTUCK', query: 'CryoSTUCK' },
  'clear-over-label': { label: 'Clear CryoSTUCK', query: 'clear CryoSTUCK' },
  tapes: { label: 'CryoSTUCK Tapes', query: 'CryoSTUCK tape' },
  affixing: { label: 'CryoSTUCK', query: 'CryoSTUCK' },
  dymo: { label: 'DYMO CryoSTUCK', query: 'DYMO CryoSTUCK' },
  nitrotag: { label: 'NitroTAG', query: 'NitroTAG' },
  'refrigerated-vaccine-labels': { label: 'Refrigerated', query: 'refrigerated vaccine labels' },
  'frozen-vaccine-labels': { label: 'Frozen Vaccine', query: 'cryogenic vaccine labels' },
  'ultra-low-vaccine-labels': { label: 'Ultra-Low', query: 'cryogenic vaccine labels -80' },
  'syringe-labels': { label: 'Syringe Labels', query: 'syringe labels' },
  'rfid-labels-and-smart-labels': { label: 'RFID Vaccine', query: 'RFID vaccine labels' },
  'custom-labels-and-clinical-trial-labels': {
    label: 'Custom Vaccine',
    query: 'clinical trial vaccine labels',
  },
  'cryo-lazrtag': { label: 'Cryo-LazrTAG', query: 'Cryo-LazrTAG' },
  'direct-thermal-cryostuck': { label: 'DT CryoSTUCK', query: 'direct thermal CryoSTUCK' },
  'cryo-strawtag': { label: 'Cryo-StrawTAG', query: 'Cryo-StrawTAG' },
  'self-laminating-wrap-around': { label: 'Wrap-Around', query: 'self laminating wrap-around cryogenic' },
  'cryostuck-frozen-surfaces': { label: 'CryoSTUCK', query: 'CryoSTUCK' },
  'side-labels-for-culture-plates': { label: 'Plate Side Labels', query: 'culture plate side labels' },
  'bottom-labels-for-culture-plates': {
    label: 'Plate Bottom Labels',
    query: 'culture plate bottom labels',
  },
  'patient-record-labels': { label: 'Patient Records', query: 'patient record labels' },
  'color-coding': { label: 'Color Labels', query: 'color coded labels' },
  'print-and-scan-kits': { label: 'Print Kits', query: 'IVF printing kit' },
  'trusted-supplier': { label: 'Requisition Forms', query: 'cryogenic requisition forms' },
  customization: { label: 'Custom Forms', query: 'custom clinical requisition forms' },
  'cryogenic-storage': { label: 'Cryo Labels', query: 'cryogenic labels' },
  'chemical-resistant': {
    label: 'Chemical-Resistant',
    query: 'chemical resistant laboratory labels',
  },
  'autoclave-resistant': {
    label: 'Autoclave Labels',
    query: 'autoclave resistant labels',
  },
  medication: { label: 'Medication Labels', query: 'veterinary medication labels' },
  'cage-and-chart': { label: 'Cage Labels', query: 'animal cage labels' },
  'print-and-scan': { label: 'Print & Scan', query: 'label printer scanner kit' },
  'easy-printing': { label: 'Laser Labels', query: 'laser printable cryogenic labels' },
  durability: { label: 'Durable Labels', query: 'durable laboratory labels' },
  speed: { label: 'Variable Data', query: 'variable data printing labels' },
  'user-friendly': { label: 'VDP Labels', query: 'clinical variable data labels' },
  quality: { label: 'Barcode Grading', query: 'barcode grading clinical labels' },
  design: { label: 'Full-Color Labels', query: 'full color clinical labels' },
  metalitag: { label: 'MetaliTAG', query: 'MetaliTAG' },
  pintag: { label: 'PinTAG', query: 'PinTAG' },
  'cryo-c-kurtag': { label: 'Cryo C-kurTAG', query: 'Cryo C-kurTAG' },
  'cryogenic-specialty-tapes': { label: 'Cryo Tapes', query: 'cryogenic tape' },
  'permanent-cryogenic-tape': { label: 'Cryo Tape', query: 'permanent cryogenic tape' },
  'metalitape-for-metal-racks': { label: 'MetaliTAPE', query: 'MetaliTAPE' },
  'cryo-laminate': { label: 'Cryo-Laminate', query: 'Cryo-Laminate' },
  'c-kur-tamper-evident-cryo-tape': { label: 'C-Kur Tape', query: 'C-Kur cryo tape' },
  'cryostuck-tape': { label: 'CryoSTUCK Tape', query: 'CryoSTUCK tape' },
  translutape: { label: 'TransluTAPE', query: 'TransluTAPE' },
  'removable-freezer-tape': { label: 'Freezer Tape', query: 'removable freezer tape' },
  'removable-steritape': { label: 'SteriTAPE', query: 'SteriTAPE' },
  'printable-autoclave-tape': { label: 'Autoclave Tape', query: 'printable autoclave tape' },
  'sterilization-indicator-tape': { label: 'Indicator Tape', query: 'sterilization indicator tape' },
  ubicling: { label: 'UbiCling', query: 'UbiCling' },
  plurotape: { label: 'PluroTAPE', query: 'PluroTAPE' },
  cryohug: { label: 'CryoHUG', query: 'CryoHUG' },
  'color-lab-tape': { label: 'Lab-TAPE', query: 'Color Lab-TAPE' },
  'glow-in-the-dark-tape': { label: 'Glow Tape', query: 'glow in the dark tape' },
  'ultra-removable-tape': { label: 'Ultra-Removable', query: 'ultra removable tape' },
  'tape-dispensers': { label: 'Dispensers', query: 'lab tape dispenser' },
  'rfid-solutions': { label: 'RFID', query: 'RFID cryogenic' },
  'printing-solutions': { label: 'Printing', query: 'label printer laboratory' },
  'lims-integration': { label: 'LIMS Labels', query: 'LIMS laboratory labels' },
  parafitag: { label: 'ParafiTAG', query: 'ParafiTAG' },
  parafigard: { label: 'ParafiGARD', query: 'ParafiGARD' },
  'rfid-parafitag': { label: 'RFID ParafiTAG', query: 'RFID ParafiTAG' },
  'metal-detectable': { label: 'ParafiGARD', query: 'ParafiGARD metal detectable' },
  'microscope-slides': { label: 'Slide Labels', query: 'xylene resistant slide labels' },
  'paraffin-wax-blocks': { label: 'Paraffin Labels', query: 'paraffin wax block labels' },
  'glass-bottles-and-labware': {
    label: 'Bottle Labels',
    query: 'chemical resistant bottle labels',
  },
  'slide-storage-boxes': { label: 'Storage Labels', query: 'freezer slide storage labels' },
  'metal-detectable-blocks': { label: 'ParafiGARD', query: 'ParafiGARD' },
  'self-laminating': { label: 'HistoLAM', query: 'HistoLAM' },
  're-identification': { label: 'Histo-PinTAG', query: 'Histo-PinTAG' },
  'thermal-transfer-printable': {
    label: 'Histology Labels',
    query: 'xylene resistant histology labels',
  },
  'acid-and-base-resistant': {
    label: 'Acid-Resistant',
    query: 'acid base resistant labels',
  },
  'custom-constructs': { label: 'Custom Labels', query: 'custom clinical trial labels' },
  'custom-printing': { label: 'Custom Printing', query: 'custom printed clinical labels' },
  'serialization-and-database': {
    label: 'Serialized Labels',
    query: 'serialized clinical trial labels',
  },
  'full-color-graphics': { label: 'Full-Color Labels', query: 'full color laboratory labels' },
  'rfid-technology': { label: 'RFID Labels', query: 'RFID clinical trial labels' },
  'in-house-manufacturing': { label: 'Clinical Labels', query: 'clinical trial labels' },
  'scientific-expertise': { label: 'Clinical Labels', query: 'clinical trial labels' },
  'global-delivery': { label: 'Clinical Labels', query: 'clinical trial labels' },
  'diagnostic-kits': { label: 'Kit Labels', query: 'diagnostic kit labels' },
  'clinical-trials': { label: 'Clinical Trial Labels', query: 'clinical trial labels' },
  'sample-processing': { label: 'PCR Labels', query: 'PCR laboratory labels' },
  histology: { label: 'Histology Labels', query: 'xylene resistant histology labels' },
  'cold-storage': { label: 'Cryo Labels', query: 'cryogenic deep freeze labels' },
  sterilization: { label: 'Autoclave Labels', query: 'autoclave sterilization labels' },
  blackout: { label: 'Blackout', query: 'blackout cryogenic' },
  'histo-pintag': { label: 'Histo-PinTAG', query: 'Histo-PinTAG' },
  'blackout-removable': {
    label: 'Blackout Slides',
    query: 'blackout removable slide labels',
  },
  'clear-laminating': {
    label: 'Clear Slide Labels',
    query: 'clear laminating slide labels',
  },
  'tamper-evident': { label: 'Tamper-Evident', query: 'tamper evident cryogenic' },
  snappeel: { label: 'SnapPEEL', query: 'SnapPEEL cryogenic' },
  piggyback: { label: 'Piggyback', query: 'piggyback cryogenic' },
  'wrap-around': { label: 'Wrap-Around', query: 'wrap-around cryogenic' },
  transparent: { label: 'Transparent', query: 'transparent cryogenic' },
  simpeel: { label: 'SimPEEL', query: 'SimPEEL cryogenic' },
  rfid: { label: 'RFID', query: 'RFID cryogenic' },
  permanent: { label: 'Permanent', query: 'permanent cryogenic labels' },
  removable: { label: 'Removable', query: 'removable cryogenic labels' },
  'cryogenic-rfid-vial-labels': {
    label: 'Cryogenic RFID',
    query: 'cryogenic RFID vial labels',
  },
  'autoclave-resistant-rfid-labels': {
    label: 'Autoclave RFID',
    query: 'autoclave resistant RFID labels',
  },
  'deep-freeze-rfid-microplate-labels': {
    label: 'Deep-Freeze RFID',
    query: 'deep freeze RFID microplate labels',
  },
  'xylene-and-chemical-resistant-labels': {
    label: 'Xylene RFID',
    query: 'xylene chemical resistant RFID labels',
  },
  'rfid-tags': { label: 'RFID Tags', query: 'RFID tags laboratory' },
  'rfid-printers': { label: 'RFID Printers', query: 'RFID label printer' },
  'rfid-readers': { label: 'RFID Readers', query: 'RFID reader laboratory' },
  'wide-scanning-radius': { label: 'RFID Labels', query: 'RFID labels' },
  'printed-and-encoded': { label: 'RFID Labels', query: 'RFID thermal labels' },
  'flexible-inlays': { label: 'RFID Labels', query: 'RFID smart labels' },
  applications: { label: 'RFID Labels', query: 'RFID laboratory labels' },
  'custom-rfid': { label: 'Custom RFID', query: 'custom RFID labels' },
  'industrial-rfid': { label: 'Industrial RFID', query: 'industrial RFID labels' },
  ivf: { label: 'IVF Labels', query: 'IVF labels' },
  'kits-and-storage': { label: 'Kit Labels', query: 'diagnostic kit labels' },
  cannabis: { label: 'Cannabis Labels', query: 'cannabis labels' },
  packaging: { label: 'Packaging Labels', query: 'cannabis packaging labels' },
  growing: { label: 'Plant Labels', query: 'cannabis plant labels' },
  testing: { label: 'Testing Labels', query: 'cannabis testing labels' },
  'xylene-and-chemical': { label: 'Xylene Labels', query: 'xylene resistant labels' },
  autoclave: { label: 'Autoclave Labels', query: 'autoclave labels' },
  'deep-freeze': { label: 'Deep-Freeze', query: 'deep freeze labels' },
  'snappeel-technology': { label: 'SnapPEEL', query: 'SnapPEEL' },
  precision: { label: 'SnapPEEL', query: 'SnapPEEL' },
  efficiency: { label: 'SnapPEEL', query: 'SnapPEEL' },
  visibility: { label: 'SnapPEEL', query: 'SnapPEEL' },
  fjt: { label: 'FJT SnapPEEL', query: 'FJT SnapPEEL' },
  jtta: { label: 'JTTA SnapPEEL', query: 'JTTA SnapPEEL' },
  dtu: { label: 'DTU SnapPEEL', query: 'DTU SnapPEEL' },
  lcs: { label: 'LCS SnapPEEL', query: 'LCS SnapPEEL' },
  pikatag: { label: 'PikaTAG', query: 'PikaTAG' },
  'rfid-cryo-wraptag': { label: 'RFID Cryo-WrapTAG', query: 'RFID Cryo-WrapTAG' },
  'gatorcut-technology': { label: 'GatorCUT', query: 'GatorCUT' },
  'freezertape-tg': { label: 'FreezerTAPE TG', query: 'FreezerTAPE TG' },
  'freezertape-tdf': { label: 'FreezerTAPE TDF', query: 'FreezerTAPE TDF' },
  frozenstuck: { label: 'FrozenSTUCK', query: 'FrozenSTUCK' },
  nitrotape: { label: 'NitroTAPE', query: 'NitroTAPE' },
  'cryostuck-tfng': { label: 'CryoSTUCK TFNG', query: 'CryoSTUCK TFNG tape' },
  'cryostuck-txs': { label: 'CryoSTUCK TXS', query: 'CryoSTUCK TXS tape' },
  'cryostuck-txc': { label: 'CryoSTUCK TXC', query: 'CryoSTUCK TXC tape' },
  'clear-ubicling': { label: 'Clear UbiCling', query: 'Clear UbiCling' },
  steritape: { label: 'SteriTAPE', query: 'SteriTAPE GatorCUT' },
  'print-solutions': { label: 'Printers', query: 'laboratory label printers' },
  'print-modes': { label: 'Cody-3', query: 'Cody-3 printer' },
  resolution: { label: 'Cody-3', query: 'Cody-3 thermal printer' },
  'media-width': { label: 'Cody-3', query: 'Cody-3 labels' },
  software: { label: 'BarTender', query: 'BarTender Cody-3' },
  connectivity: { label: 'Cody-3', query: 'Cody-3 printer' },
  overview: { label: 'Cody-3', query: 'Cody-3 printer' },
  'what-s-in-the-box': { label: 'Cody-3', query: 'Cody-3 printer kit' },
  'tech-specs': { label: 'Cody-3 Specs', query: 'Cody-3 printer' },
  downloads: { label: 'Cody-3 Downloads', query: 'Cody-3 printer' },
  'design-software': {
    label: 'Design Software',
    query: 'BarTender label design software',
  },
  'informatics-software': {
    label: 'Informatics',
    query: 'LIMS laboratory labels',
  },
  'software-partners': {
    label: 'Software Partners',
    query: 'LabTAG software partners',
  },
  'send-your-labware': {
    label: 'Send Labware',
    query: 'pre-labeled labware',
  },
  'we-procure': {
    label: 'We Procure',
    query: 'pre-labeled labware procurement',
  },
  'custom-barcodes-and-text': {
    label: 'Custom Barcodes',
    query: 'custom barcode labels',
  },
  'graphics-and-logos': {
    label: 'Graphics & Logos',
    query: 'custom printed labels logos',
  },
  'precise-application': {
    label: 'Precise Application',
    query: 'pre-labeled tubes vials',
  },
  'barcode-grading': {
    label: 'Barcode Grading',
    query: 'barcode grading labels',
  },
  'material-range': {
    label: 'Label Materials',
    query: 'laboratory label materials',
  },
  'die-cut': { label: 'Die Cut Labels', query: 'custom die cut labels' },
  'variable-data-printing': {
    label: 'Variable Data',
    query: 'variable data printing labels',
  },
  datagard: { label: 'DataGARD', query: 'DataGARD labels' },
  formats: { label: 'Label Formats', query: 'custom lab labels' },
  printing: { label: 'Custom Printing', query: 'custom printed laboratory labels' },
  materials: { label: 'Label Materials', query: 'custom label materials' },
  resistance: { label: 'Resistant Labels', query: 'chemical resistant custom labels' },
  surfaces: { label: 'Lab Surfaces', query: 'custom vial tube labels' },
  'data-formats': { label: 'Data Formats', query: 'barcode custom labels' },
}

const CRYO_SOLUTION_SLUGS = new Set([
  'cryogenic-labels',
  'cryostuck',
  'deep-freeze',
  'biobanking-labels',
  'ivf-labeling-solutions',
  'cryogenic-clinical-requisition-forms',
  'vaccine-labels',
])

export type SplitCardActions = {
  shopHref: string
  shopLabel: string
  sampleHref: string
  /** Only set when the section maps to a specific LabTAG video filter. */
  videoHref?: string
}

function videoContainerUrl(container: string): string {
  return `${VIDEOS}/?_sft_video_container=${container}`
}

function videoPrintUrl(method: string): string {
  return `${VIDEOS}/?_sft_printing_method=${method}`
}

function videoFeatureUrl(feature: string): string {
  return `${VIDEOS}/?_sft_label_feature=${feature}`
}

function shopSearchUrl(query: string): string {
  return `${SHOP}/?s=${encodeURIComponent(query)}&post_type=product`
}

function titleToShopLabel(title?: string): string {
  if (!title) return 'labels'
  return title
    .replace(/®|™/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^DYMO®?\s*LabelWriter™?\s*/i, 'DYMO ')
    .replace(/\s*Series$/i, '')
    .replace(/\s*\/\s*/g, ' / ')
    .trim()
}

/** Section-specific video filter URL, or undefined when none applies. */
function resolveVideoHref(sectionSlug: string): string | undefined {
  const container = VIDEO_CONTAINER_BY_SECTION[sectionSlug]
  if (container) return videoContainerUrl(container)

  const print = VIDEO_PRINT_BY_SECTION[sectionSlug]
  if (print) return videoPrintUrl(print)

  const feature = VIDEO_FEATURE_BY_SECTION[sectionSlug]
  if (feature) return videoFeatureUrl(feature)

  return undefined
}

export function resolveVideosHref(solutionSlug?: string): string {
  return solutionSlug && CRYO_SOLUTION_SLUGS.has(solutionSlug)
    ? LABTAG_CRYO_VIDEOS_URL
    : LABTAG_VIDEOS_URL
}

export function resolveSolutionShopHref(solutionSlug?: string): string {
  return solutionSlug && CRYO_SOLUTION_SLUGS.has(solutionSlug)
    ? LABTAG_CRYO_SHOP_URL
    : LABTAG_SHOP_URL
}

export function resolveSplitCardActions(
  sectionSlug: string,
  solutionSlug?: string,
  sectionTitle?: string,
): SplitCardActions {
  const cryo = Boolean(solutionSlug && CRYO_SOLUTION_SLUGS.has(solutionSlug))
  const mapped = SHOP_BY_SECTION[sectionSlug]
  const shopLabel = mapped?.label ?? titleToShopLabel(sectionTitle)
  const shopHref = mapped
    ? shopSearchUrl(mapped.query)
    : cryo
      ? LABTAG_CRYO_SHOP_URL
      : shopSearchUrl(shopLabel)

  return {
    shopHref,
    shopLabel,
    sampleHref: LABTAG_SAMPLE_URL,
    videoHref: resolveVideoHref(sectionSlug),
  }
}
