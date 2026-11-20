import type { HeroImage, SolutionPage } from './types'

const RASTER = /\.(?:jpe?g|png|webp|gif)(?:$|\?)/i
const VIDEO = /\.(?:mp4|webm|ogg)(?:$|\?)/i
const PREVIEW_MEDIA = /\.(?:jpe?g|png|webp|gif|mp4|webm|ogg)(?:$|\?)/i

/** Skip guide covers, icons, and other assets that read poorly as cards. */
const WEAK_PREVIEW =
  /thumb-guide|guide-cover|-icon(?:-|\.|$)|immersion-icon|illustrations_symbol|checkbox|\/24hr-/i

function isStrongPreview(src: string) {
  return PREVIEW_MEDIA.test(src) && !WEAK_PREVIEW.test(src)
}

export function isVideoSrc(src: string) {
  return VIDEO.test(src)
}

function asHero(src: string, alt?: string, fallbackSrc?: string): HeroImage {
  return { src, alt: alt ?? '', fallbackSrc }
}

/** Photo for index cards and mega tiles. Prefers a real product photo over guide thumbs. */
export function previewImage(page: SolutionPage): HeroImage | undefined {
  if (page.heroImage && isStrongPreview(page.heroImage.src)) return page.heroImage

  for (const block of page.blocks) {
    if (
      (block.type === 'image' || block.type === 'video') &&
      (isStrongPreview(block.src) || (block.fallbackSrc && isStrongPreview(block.fallbackSrc)))
    ) {
      return asHero(block.src, block.alt, block.fallbackSrc)
    }
  }

  if (
    page.heroImage &&
    (RASTER.test(page.heroImage.src) ||
      VIDEO.test(page.heroImage.src) ||
      (page.heroImage.fallbackSrc && VIDEO.test(page.heroImage.fallbackSrc)))
  ) {
    return page.heroImage
  }

  return undefined
}
