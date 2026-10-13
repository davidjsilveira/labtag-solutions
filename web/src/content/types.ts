export type ImageBlock = {
  type: 'image'
  src: string
  alt: string
  fallbackSrc?: string
  variant?: 'hero' | 'gallery' | 'logo'
}

export type VideoBlock = {
  type: 'video'
  src: string
  alt: string
  fallbackSrc?: string
}

export type TextBlock = {
  type: 'text'
  paragraphs: string[]
}

export type SectionBlock = {
  type: 'section'
  title: string
  level: 2 | 3
  paragraphs: string[]
}

export type BulletListBlock = {
  type: 'bulletList'
  title?: string
  items: string[]
}

export type NumberedStepImage = {
  src: string
  alt: string
  fallbackSrc?: string
}

export type NumberedStepsBlock = {
  type: 'numberedSteps'
  title?: string
  intro?: string
  steps: { title: string; body: string; image?: NumberedStepImage }[]
}

export type FeatureGridBlock = {
  type: 'featureGrid'
  title?: string
  items: { title: string; body: string }[]
}

export type TableBlock = {
  type: 'table'
  title?: string
  headers: string[]
  rows: string[][]
}

export type QuoteBlock = {
  type: 'quote'
  text: string
  attribution?: string
}

export type FaqBlock = {
  type: 'faq'
  title?: string
  items: { question: string; answer: string }[]
}

export type CtaBlock = {
  type: 'cta'
  title: string
  body: string
}

export type ContentBlock =
  | ImageBlock
  | VideoBlock
  | TextBlock
  | SectionBlock
  | BulletListBlock
  | NumberedStepsBlock
  | FeatureGridBlock
  | TableBlock
  | QuoteBlock
  | FaqBlock
  | CtaBlock

export type HeroImage = {
  src: string
  alt: string
  fallbackSrc?: string
}

export type SolutionPage = {
  slug: string
  title: string
  sources: string[]
  /** Short blurb for index cards */
  excerpt: string
  /** Lead copy shown in the page hero */
  description: string[]
  heroImage?: HeroImage
  blocks: ContentBlock[]
}
