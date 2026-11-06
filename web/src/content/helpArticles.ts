export type HelpArticle = {
  id: string
  question: string
  answer: string
}

export type HelpCategory = {
  id: 'labels' | 'printers' | 'software' | 'orders'
  label: string
  lede: string
  articles: HelpArticle[]
}

export const HELP_CATEGORIES: HelpCategory[] = [
  {
    id: 'labels',
    label: 'Labels',
    lede: 'Compatibility, cryogenic and autoclave labels, templates, and print quality.',
    articles: [
      {
        id: 'custom-colors-sizes',
        question: 'Are your labels available in other colors or sizes than what is on the website?',
        answer:
          'LabTAG can customize size, color, and configuration when the catalog SKU is not a match. Email the details to Support@Ga-International.com and the team will reply with pricing.',
      },
      {
        id: 'apply-cryostuck',
        question: 'How do I correctly apply CryoSTUCK labels?',
        answer:
          'Apply CryoSTUCK at −80°C, ideally on dry ice. Wipe away excess frost, start with the left edge, then press the label along the vial.\n\nLabel in batches and keep tubes in an insulated container of dry ice so samples do not thaw. If the vials came from liquid nitrogen, let them equilibrate on dry ice for at least 5 minutes first.\n\nRoll-format CryoSTUCK labels need at least 0.25 in of overlap. Wipe visible frost with a lint-free wipe, avoid touching the adhesive, anchor the edge first, and press the printable area before the clear wrap on wrap-around labels.',
      },
      {
        id: 'printer-compatibility',
        question: 'How do I know if your labels are compatible with my printer?',
        answer:
          'Labels are compatible with most printer brands, and product pages note the print method. To confirm a specific model, use chat and have the brand and model ready, for example Zebra GX430T.',
      },
      {
        id: 'cryogenic-labels',
        question: 'What are cryogenic labels?',
        answer:
          'Cryogenic labels are built for liquid and vapor phase liquid nitrogen (−196°C), laboratory freezers (−40°C, −80°C, −120°C), and dry ice.\n\nThey cover tubes, vials, boxes, caps, frozen surfaces, microplates, IVF straws, PCR tubes, metal racks, and cryo storage canes. Print methods include thermal transfer, direct thermal, inkjet, laser, DYMO, and automated printers. Adhesives can be permanent or removable, in white, transparent, or colors, including tamper-evident, destructible, blackout, piggyback, and wrap-around.',
      },
      {
        id: 'autoclave-labels',
        question: 'What are autoclave labels?',
        answer:
          'Autoclave labels resist the heat and pressure of sterilization on metal, glass, and plastic. They withstand steam autoclaves, dry heat ovens, gamma irradiation, and ethylene oxide.\n\nThe working range is −60°C to +150°C, up to 30 psi and radiation as high as 50 kGy. Print methods include thermal transfer, inkjet, and laser, in permanent or removable formats, including blackout, piggyback, and wrap-around.',
      },
      {
        id: 'direct-thermal-chemicals',
        question: 'Can direct thermal labels handle chemicals and heat?',
        answer:
          'No. Direct thermal labels are not for harsh chemicals, intense heat, or prolonged light. The coating darkens when a heated printhead, light, or pH changes the dye.\n\nThey are not suitable for steam autoclaves or dry heat ovens. Acids, xylene, and alcohols react with the coating, and UV light can darken the label completely.',
      },
      {
        id: 'pick-label',
        question: 'How do I pick the correct labels?',
        answer:
          'Pick the label by container, conditions, and printer.\n\nStart with the container. The label needs at least 0.25 in of overlap, and the printable area must not overlap itself. CryoSTUCK sizes cover common tubes, and a size table covers PCR tubes, vials, and conical tubes.\n\nThen match the conditions and the printer. Cryogenic labels are for liquid nitrogen and laboratory freezers. Autoclave labels are for sterilization heat and pressure. Direct thermal labels are not for harsh chemicals, intense heat, or prolonged light. Product pages note the print method. If the catalog size or color is not a match, LabTAG can customize it.',
      },
      {
        id: 'cryostuck-sizing',
        question: 'How do I find the right CryoSTUCK label for my tubes?',
        answer:
          'Two rules decide the fit. The wrapped label needs at least 0.25 in of overlap, and the printable area must not overlap itself on the tube.\n\nThese CryoSTUCK labels match common tubes:\n• 1.0 ml Matrix or Biotubes: 1.0 in × 0.75 in, L2FX-406\n• 1.5 ml conical tubes: 1.75 in × 0.5 in, L2FX-401\n• 2.0 ml cryogenic vials: L2FX-345, AHA-268, or AHA-224\n• 15 ml conical tubes: L2FX-312 or L2FX-308\n\nOther sizes, including 5 ml and 50 ml tubes, are in the CryoSTUCK thermal-transfer range. Blackout CryoSTUCK labels cover information that is already on the vial.',
      },
      {
        id: 'label-size-table',
        question: 'What label size fits my vial or tube?',
        answer:
          'These are the maximum dimensions that avoid overlap. Sizes are approximate and vary by brand.\n• 0.2 ml PCR: 19 mm × 7 mm\n• 0.5 ml Eppendorf: 22 mm × 15 mm\n• 1.0 ml Matrix or Biotube: 25 mm × 32 mm\n• 1 ml skirted: 29 mm × 19 mm\n• 1.5 ml Eppendorf: 29 mm × 18 mm\n• 1.8–2 ml skirted: 32 mm × 28 mm\n• 5 ml conical: 32 mm × 67 mm\n• 15 ml conical: 44 mm × 85 mm\n• 50 ml conical: 82 mm × 86 mm\n• 13 × 75 mm blood vial: 40 mm × 50 mm\n• 13 × 100 mm blood vial: 40 mm × 75 mm\n• 16 × 100 mm blood vial: 50 mm × 75 mm\n• 16 × 125 mm blood vial: 50 mm × 100 mm\n\nIf your container is not listed, contact support.',
      },
      {
        id: 'core-size',
        question: 'What does label core size mean?',
        answer:
          'Core size is the inside diameter of the tube a roll is wound on. It decides whether the roll fits the printer spindle. Outside diameter mainly sets how many labels are on the roll.\n\nMost desktop thermal printers use a 1 in (25 mm) core. Industrial printers often use 3 in (76 mm). Inkjet roll printers more often use 2 in (51 mm).',
      },
      {
        id: 'word-barcodes',
        question: 'Can I print barcodes using your Word templates?',
        answer: 'Yes, with additional software. Contact support for the setup that matches your printer.',
      },
      {
        id: 'blank-template',
        question: 'Why do I see a blank page with no gridlines when I open a label template?',
        answer:
          'Turn the table gridlines on.\n• Word 2007 and 2010: Layout tab under Table Tools, then View Gridlines.\n• Word 2003: Table menu, then Show Gridlines.\n• Pages: View, then Show Layout.',
      },
      {
        id: 'laser-margins',
        question: 'The printing on my laser labels is too close to the edge or exceeds the margins.',
        answer:
          'Adjust the template margins.\n• With the template open in Word, open the Layout tab.\n• Choose Margins, then Custom Margins.\n• Enter the top and side margins from the GA International laser formatting appendix.\n• If Word warns that a margin is outside the printable area, choose Ignore.\n\nThe template number matches the SKU number. Template 23 is the sheet for CL, RCL, and TRCL-23.',
      },
      {
        id: 'ink-does-not-adhere',
        question: 'The ink does not adhere and comes off when I remove the labels from the sheet.',
        answer:
          'The ink is not fusing with enough heat. In the print dialog, open Properties next to the printer name and change Media or Paper Type from Plain Paper to Label. If Label is not listed, choose Thicker Paper.',
      },
      {
        id: 'word-templates',
        question: 'Where can I download Word templates for laser and inkjet labels?',
        answer:
          'Free Word templates are on the templates page in US Letter (8.5 in × 11 in) and A4 (210 mm × 297 mm).\n\nIf the product number starts with A4, use the A4 format. Otherwise use Letter. The numeric part of the SKU is the template number. CL-12 uses template 12 in the Letter section.',
      },
      {
        id: 'manual-feed',
        question: 'Word asks me to load the manual feed when I want the paper tray.',
        answer:
          'In Word, open Page Layout and expand Page Setup. On the Paper tab, set the paper source for the first page and the following pages to Default Tray (Auto Select).',
      },
      {
        id: 'reprint-sheet',
        question: 'Can I print a few labels and save the sheet for later?',
        answer:
          'Yes. Laser sheets are made to pass through a laser printer more than once without the labels peeling or jamming.',
      },
      {
        id: 'bartender-database',
        question: 'Can I import database data into BarTender and print it on my labels?',
        answer:
          'Yes. You need at least BarTender Professional. Create a text field or barcode, open its properties, change Embedded Data to Database Field, then use Database Connection Setup. Contact support if the database connection fails.',
      },
      {
        id: 'black-mark-notch',
        question: 'Why do my labels have a black mark on the back or a notch between labels?',
        answer:
          'Those marks tell the printer where each label starts so the print stays aligned. The sensor has to be set for that media.\n\nIn BarTender, open Document Properties, then the Stock tab, and set Media Type to Non-Continuous (Mark Sensing).\n\nOn a Citizen CL-S631, set the sensor to Reflective (manual pages 45–47). On a Zebra GX430t, see pages 102 and 107.',
      },
      {
        id: 'faint-thermal-transfer',
        question: 'The printout on my thermal-transfer labels is faint.',
        answer:
          'Increase darkness, and lower speed if it is still light. Resin ribbons need more heat to transfer.\n\nIn BarTender, open Document Properties. On Stock, Print Method should be Thermal-Transfer and Media Type should match the label. On Options, turn off Use current printer settings for Darkness, keep Relative, and move the bar to about 20. Raise it further if needed. If it is still faint at maximum darkness, lower speed to 3 in/s or 2 in/s.\n\nWithout BarTender, change darkness on the printer. Citizen CL-S631: manual pages 31 and 34. Zebra GX430t: page 107.',
      },
      {
        id: 'thermal-templates',
        question: 'Where can I find templates for thermal-transfer and direct thermal labels?',
        answer:
          'Design the layout in label software such as BarTender. The wizard walks through the stock. Contact support if you want help building the template.',
      },
      {
        id: 'thermal-vs-direct-labels',
        question: 'What is the difference between thermal-transfer and direct thermal printing?',
        answer:
          'Both use a heated printhead. Thermal transfer needs an ink ribbon. Direct thermal does not.\n\nDirect thermal heats a dye coated on the label. The print can fade in heat or humidity, and a scratch can mark it. Thermal transfer melts ribbon ink onto the label, so the print is more stable. Those labels are usually a thermoplastic film, and sometimes paper.',
      },
      {
        id: 'faint-dymo',
        question: 'The printout on DYMO-compatible labels is faint. How do I improve it?',
        answer:
          'In DYMO software, open Edit, then Preferences. On the LabelWriter printer tab, set print quality to Barcode and graphics, then print again.',
      },
      {
        id: 'dfp-on-dymo',
        question: 'Can I print GA International direct thermal labels (DFP) with my DYMO printer?',
        answer:
          'No. DYMO LabelWriter printers need a notch between labels that other thermal rolls do not use. Use the DYMO-compatible label range instead.',
      },
    ],
  },
  {
    id: 'printers',
    label: 'Printers',
    lede: 'Direct thermal, thermal transfer, alignment, color, and calibration.',
    articles: [
      {
        id: 'what-is-direct-thermal',
        question: 'What is direct thermal?',
        answer:
          'Direct thermal printers use no ink, toner, or ribbon. The heated printhead touches a label coated with a leuco dye that darkens when heated.\n\nThe print can fade in heat or humidity, and a scratch can mark the label.',
      },
      {
        id: 'what-is-thermal-transfer',
        question: 'What is thermal transfer?',
        answer:
          'Thermal transfer melts a wax, resin, or wax-resin ribbon onto the label. The label itself is not reactive, so the print is more durable. Labels are usually a thermoplastic film, and sometimes paper. It is the usual method for durable barcodes.',
      },
      {
        id: 'direct-vs-transfer',
        question: 'What is the difference between direct thermal and thermal transfer?',
        answer:
          'Both use a heated printhead. Direct thermal puts that heat on the label coating. Thermal transfer puts the heat on a wax or resin ribbon, and the ink transfers to the label.',
      },
      {
        id: 'what-is-thermal-printer',
        question: 'What is a thermal printer?',
        answer:
          'A thermal printer uses heat to make the image. Direct thermal heats a coated label. Thermal transfer heats a ribbon that transfers ink to the label.',
      },
      {
        id: 'alignment',
        question: 'What is the difference between left-aligned and center-aligned printers?',
        answer:
          'Left-aligned printers are the usual mechanism. You move the printhead pressure plungers to match the label width.\n\nCenter-aligned printers keep even pressure across widths, so you do not adjust plungers. The media guide and roller stay aligned, which helps labels narrower than 1 in.',
      },
      {
        id: 'color-printing',
        question: 'How do I print labels in color?',
        answer:
          'Inkjet is the practical choice when a label needs several colors. Desktop inkjets such as HP print sheets. Roll inkjets such as Primera print on demand and let you replace one cartridge at a time. Image quality is similar.',
      },
      {
        id: 'calibrate',
        question: 'How do I calibrate my printer?',
        answer:
          'Calibration lines the print up with each label.\n\nCab: hold the button on the back right until the LED flashes red, then release. Feed should advance one label.\n\nZebra: with the printer on, hold Feed until the status light flashes once, then twice, and release. Feed should advance one label.\n\nCognitive: in the administrator label positioning tab, under index settings, choose the indexing method, apply, save, and calibrate. A successful status means Feed ejects one label.',
      },
    ],
  },
  {
    id: 'software',
    label: 'Software',
    lede: 'BarTender, Word, ZebraDesigner, cablabel, barcodes, and databases.',
    articles: [
      {
        id: 'serialize',
        question: 'Can I serialize and barcode my data on my own?',
        answer:
          'Yes. BarTender and similar software can design the template, print it, and manage the barcoded data. The wizard walks through the steps.',
      },
      {
        id: 'bartender-sheet',
        question: 'How do I create sheet format templates in BarTender?',
        answer:
          'The wizard starts when you open BarTender, or when you create a new document.\n• Choose Blank Template, or open an existing document to edit.\n• Select the printer.\n• Choose Specify Custom Settings.\n• Set page size, orientation, label shape, and margins. Margin figures are in the GA International laser appendix.\n• Set columns and rows. Label size is calculated, or choose Set Manually.\n• Set print order, usually top-left and horizontally.\n• Add a background if you need one, review the preview, and finish.\n\nThen add text and barcodes on the template.',
      },
      {
        id: 'cablabel-sheet',
        question: 'How do I create sheet format templates in cablabel S3?',
        answer:
          'Open cablabel and choose New Label. Pick millimeters or inches and enter the label size. Change the column count only when the sheet is more than one label across.\n\nClick Next. Use Text to place copy and set the font, then Barcode to encode a 1D or 2D symbol. Click OK when each dialog is done.',
      },
      {
        id: 'word-margins',
        question: 'How do I adjust margins in Word?',
        answer:
          'Most templates print without a margin change. If the print sits too close to the edge:\n• Open Layout, then Margins, then Custom Margins.\n• Enter the top and side values from the laser formatting appendix.\n• If Word warns the margin is outside the printable area, choose Ignore.\n\nThe template number matches the SKU. Template 23 is the sheet for CL, RCL, and TRCL-23.',
      },
      {
        id: 'human-readable',
        question: 'How do I show or hide the text encoded in a barcode?',
        answer:
          'BarTender: double-click the barcode, open Human Readable, and choose None to hide it. Placement, alignment, and offset set where the text sits.\n\nZebraDesigner: double-click the barcode, choose Define next to Barcode Type, then the Human Readable tab. No interpretation hides it. Below or Above barcode places it. Custom font changes the style.\n\ncablabel S3: double-click the barcode, open the Barcode tab, and clear Human readable. Placement of that text cannot be changed.',
      },
      {
        id: 'print-database',
        question: 'How do I print from a database?',
        answer:
          'In BarTender, double-click a text box or barcode. In the Data Source tab, change Embedded Data to Database Field. Open Database Connection Setup, pick the type (for example Excel), select the file, and choose the column.\n\nRepeat Database Field on the next object and pick its column. In the print dialog, Selected Records prints a range such as 1–50, and Copies per Serial Number sets copies of each row. Preview before you print.',
      },
      {
        id: 'speed-darkness',
        question: 'How do I set print speed and darkness?',
        answer:
          'Faint print usually needs a slower speed and a higher darkness.\n\ncablabel, CAB MACH1/300: configure the selected device, then the Options tab. Lowest speed is 50.8 mm/s. Highest darkness is 19.\n\nZebraDesigner: File, Printer Settings, Options. Lowest speed is 2 in/s. Highest darkness is 30.\n\nBarTender: Document Properties, Options. Turn off Use current printer settings for Darkness and Speed, then raise darkness or lower speed. The maximum depends on the driver.',
      },
      {
        id: 'zebra-designer',
        question: 'How do I create sheet format templates in ZebraDesigner?',
        answer:
          'Choose Create a new label and finish the first wizard step. Select the printer. Leave stock, page size, and layout as they are unless you need a change. Enter label width and height, then finish.\n\nUse Bar Code to place a 1D or 2D symbol. The A control adds a text box. Font and size work the same way as in Word.',
      },
    ],
  },
  {
    id: 'orders',
    label: 'Orders',
    lede: 'Shipping, returns, tracking, and distributors.',
    articles: [
      {
        id: 'cannot-ship',
        question: 'Why am I seeing an error that you cannot ship to our location?',
        answer:
          'If checkout still blocks the address, contact support and the team will place or route the order.',
      },
      {
        id: 'returns',
        question: 'Is it possible to return items for a refund?',
        answer:
          'GA International products other than software and hardware have a satisfaction guarantee. Return them within 90 days for a refund or replacement. Other products follow the warranty you are given.\n\nA 10% restocking fee applies when the return is not about performance or quality. Opened software and hardware are not returnable. Software has a 30-day trial you can download to evaluate.\n\nContact support for a return merchandise authorization and the return instructions.',
      },
      {
        id: 'track-order',
        question: 'How do I track the status of my order?',
        answer:
          'Email info@ga-international.com with your company name and order confirmation number. If the order has shipped, the reply includes the tracking number.',
      },
      {
        id: 'distributor',
        question: 'Do you have a distributor in my region?',
        answer:
          'Orders ship worldwide. To buy through a local distributor, email distributor_inquiries@ga-international.com.',
      },
    ],
  },
]

export const HELP_ARTICLES = HELP_CATEGORIES.flatMap((category) =>
  category.articles.map((article) => ({ ...article, categoryId: category.id, category: category.label })),
)
