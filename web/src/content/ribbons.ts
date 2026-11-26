/** shortcut: live labtag.com RR-Class ribbon subset (USD prices as listed); width in inches.
 *  Kept import-free so node --test can load it without the @/ alias. */
export const RIBBONS = [
  { model: 'RR25X450C1-1iZ4', name: 'RR-Class Resin Ribbon', width: 0.98, size: '0.98″ x 1476′', price: '$32.00', image: 'https://cdn.labtag.com/wp-content/uploads/RR25X450C1-1iZ4.png', url: 'https://www.labtag.com/shop/product/thermal-transfer-resin-ribbon-0-98-x-1476-rr25x450c1-1iz4/' },
  { model: 'RR25x214C1-1iZ4', name: 'RR-Class Resin Ribbon', width: 1, size: '1″ x 702′', price: '$23.00', image: 'https://cdn.labtag.com/wp-content/uploads/rr25x214c1-1iz4.jpg', url: 'https://www.labtag.com/shop/product/thermal-transfer-resin-ribbon-1-x-702-rr25x214c1-1iz4/' },
  { model: 'RR40x450C1-1iZ4', name: 'RR-Class Resin Ribbon', width: 1.57, size: '1.57″ x 1476′', price: '$45.40', image: 'https://cdn.labtag.com/wp-content/uploads/40x450-illustration-Copyright-GA-International-1.jpg', url: 'https://www.labtag.com/shop/product/thermal-transfer-resin-ribbon-1-57-x-1476-rr40x450c1-1iz4/' },
  { model: 'RR57x74C0.5-1ZZ2', name: 'RR-Class Smudge-Proof Resin Ribbon', width: 2.24, size: '2.24″ x 244′', price: '$17.80', image: 'https://cdn.labtag.com/wp-content/uploads/RR57x74C0.5-1ZZ2.png', url: 'https://www.labtag.com/shop/product/thermal-transfer-smudge-proof-resin-ribbon-2-24-x-244-57mm-x-74m-rr57x74c0-5-1zz2/' },
  { model: 'RR60x300C1-1iZ4', name: 'RR-Class Resin Ribbon', width: 2.36, size: '2.36″ x 984′', price: '$49.30', image: 'https://cdn.labtag.com/wp-content/uploads/RR60x300C1-1iZ4.png', url: 'https://www.labtag.com/shop/product/thermal-transfer-resin-ribbon-2-36-x-984-rr60x300c1-1iz4/' },
  { model: 'RR64X74C0.5-1iZ4', name: 'RR-Class Smudge-Proof Resin Ribbon', width: 2.5, size: '2.5″ x 244′', price: '$20.30', image: 'https://cdn.labtag.com/wp-content/uploads/RR64X74C0.5-1iZ4.png', url: 'https://www.labtag.com/shop/product/thermal-transfer-smudge-proof-resin-ribbon-2-5-x-244-rr64x74c0-5-1iz4/' },
  { model: 'RR64X74C0.5-1ZZ4', name: 'Zebra RR-Class Smudge-Proof Resin Ribbon', width: 2.5, size: '2.5″ x 244′', price: '$21.30', image: 'https://cdn.labtag.com/wp-content/uploads/RR64X74C0.5-1ZZ4.png', url: 'https://www.labtag.com/shop/product/zebra-thermal-transfer-smudge-proof-resin-ribbon-2-5-x-244-rr64x74c0-5-1zz4/' },
  { model: 'RR76X360C1-2iD4', name: 'RR-Class Resin Ribbon', width: 3, size: '3″ x 1181′', price: '$50.60', image: 'https://cdn.labtag.com/wp-content/uploads/76x360-illustration-Copyright-GA-International-1.jpg', url: 'https://www.labtag.com/shop/product/thermal-transfer-resin-ribbon-3-x-1181-rr76x360c1-2id4/' },
  { model: 'RR84X74C0.5-1iZ4', name: 'RR-Class Smudge-Proof Resin Ribbon', width: 3.3, size: '3.3″ x 244′', price: '$27.30', image: 'https://cdn.labtag.com/wp-content/uploads/RR84X74C0.5-1iZ4.png', url: 'https://www.labtag.com/shop/product/thermal-transfer-smudge-proof-resin-ribbon-3-3-x-244-rr84x74c0-5-1iz4/' },
  { model: 'RR110X74C0.5-1iZ4', name: 'RR-Class Smudge-Proof Resin Ribbon', width: 4.3, size: '4.3″ x 244′', price: '$33.70', image: 'https://cdn.labtag.com/wp-content/uploads/RR110X74C0.5-1iZ4.png', url: 'https://www.labtag.com/shop/product/thermal-transfer-smudge-proof-resin-ribbon-4-3-x-244-rr110x74c0-5-1iz4/' },
]

/** RR-Class ribbons for a thermal-transfer roll label: at least 0.5" wider than the label, narrowest fits first. */
export function recommendedRibbons(labelWidth: number | null, thermalTransfer: boolean, roll: boolean) {
  if (labelWidth == null || !thermalTransfer || !roll) return []
  return RIBBONS.filter((ribbon) => ribbon.width >= labelWidth + 0.5)
    .sort((a, b) => a.width - b.width)
    .slice(0, 6)
}
