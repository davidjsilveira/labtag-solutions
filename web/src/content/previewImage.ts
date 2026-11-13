import type { HeroImage, SolutionPage } from './types'

const RASTER = /\.(?:jpe?g|png|webp|gif)(?:$|\?)/i

/** Photo for index cards. Uses the hero when it is a photo, otherwise the first photo in the article. */
export function previewImage(page: SolutionPage): HeroImage | undefined {
  if (page.heroImage && RASTER.test(page.heroImage.src)) return page.heroImage

  for (const block of page.blocks) {
    if (block.type === 'image' && RASTER.test(block.src)) {
      return {
        src: block.src,
        alt: block.alt,
        fallbackSrc: block.fallbackSrc,
      }
    }
  }

  return page.heroImage
}
