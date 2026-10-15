import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategoryForSlug } from '@/content/categories'
import { getPage } from '@/content/loadPages'
import { resolveImageSrc } from '@/content/resolveImage'
import type { FeatureGridItem } from '@/content/types'

type TempTag = 'cryo' | 'deep-freeze' | 'neutral' | 'heat' | 'autoclave'

type GuideChip = {
  title: string
  slug: string
}

const TEMP_TAG_LABEL: Record<TempTag, string> = {
  cryo: 'Cryo',
  'deep-freeze': 'Deep-Freeze',
  neutral: 'Neutral',
  heat: 'Heat',
  autoclave: 'Autoclave',
}

/** Representative storage temps the class chips jump to. */
const TEMP_TAG_JUMP: Record<TempTag, number> = {
  cryo: -196,
  'deep-freeze': -80,
  neutral: 22,
  heat: 37,
  autoclave: 120,
}

const TEMP_SCALE_MIN = -196
const TEMP_SCALE_MAX = 120
const TEMP_DEFAULT = -80
const CHIP_LIMIT = 6

/** Usability-focused feature pages highlighted at room temperature. */
const NEUTRAL_USABILITY_CHIPS: GuideChip[] = [
  { title: 'SnapPEEL™', slug: 'snappeel-labels' },
  { title: 'Hard-to-stick surfaces', slug: 'labels-for-hard-to-stick-surfaces' },
  { title: 'GatorCUT™', slug: 'gatorcut' },
  { title: 'ResiTAG®', slug: 'resitag' },
  { title: 'Lab tapes', slug: 'lab-tapes' },
  { title: 'DYMO-compatible', slug: 'dymo-compatible-laboratory-labels' },
]

type GuideMatch = {
  maxExclusive: number
  slug: string
  title: string
  headline: string
  body: string
  tags: TempTag[]
  chips?: GuideChip[]
}

/** First matching band wins (cold → warm). */
const GUIDE_BANDS: GuideMatch[] = [
  {
    maxExclusive: -150,
    slug: 'cryogenic-labels',
    title: 'Cryogenic Labels',
    headline: 'Liquid nitrogen territory',
    body: 'Vials, boxes, metal canes, and straws living in LN₂ or vapor phase need adhesives that stay put through immersion and freeze–thaw cycles.',
    tags: ['cryo'],
  },
  {
    maxExclusive: -60,
    slug: 'deep-freeze',
    title: 'Deep-Freeze Labels',
    headline: 'Ultra-low freezer storage',
    body: '−80°C freezers and dry-ice transport call for freezer-grade labels on microtubes, plates, blood bags, and cardboard or polypropylene boxes.',
    tags: ['deep-freeze'],
  },
  {
    maxExclusive: 5,
    slug: 'cryostuck',
    title: 'CryoSTUCK® for frozen surfaces',
    headline: 'Already frozen — no thaw',
    body: 'When the vial cannot warm up, CryoSTUCK® applies straight onto −80°C surfaces so you can re-ID without interrupting the cold chain.',
    tags: ['cryo', 'deep-freeze'],
  },
  {
    maxExclusive: 32,
    slug: 'snappeel-labels',
    title: 'Usability Features',
    headline: 'Room-temp labeling that works faster',
    body: 'At ambient conditions the bottleneck is handling — SnapPEEL™, glove-friendly peels, hard-to-stick surfaces, and tearable tapes that keep techs moving.',
    tags: ['neutral'],
    chips: NEUTRAL_USABILITY_CHIPS,
  },
  {
    maxExclusive: 100,
    slug: 'laboratory-labels',
    title: 'Laboratory Labels',
    headline: 'Warm benches and incubators',
    body: 'Elevated lab temps still need durable ID — from cultureware and kits to containers that move between rooms, fridges, and warm workstations.',
    tags: ['heat'],
  },
  {
    maxExclusive: Number.POSITIVE_INFINITY,
    slug: 'autoclave-labels',
    title: 'Autoclave Labels',
    headline: 'Sterilization heat',
    body: 'Steam, dry heat, gamma, and EtO cycles need constructs that survive autoclaving without smearing, peeling, or losing barcode scannability.',
    tags: ['heat', 'autoclave'],
  },
]

function formatTemp(celsius: number): string {
  const sign = celsius > 0 ? '+' : ''
  return `${sign}${celsius}°C`
}

function solutionPath(slug: string): string {
  const category = getCategoryForSlug(slug)
  return category ? `/solutions/${category.id}/${slug}` : `/solutions/${slug}`
}

function matchGuide(tempC: number): GuideMatch {
  return GUIDE_BANDS.find((band) => tempC < band.maxExclusive) ?? GUIDE_BANDS[GUIDE_BANDS.length - 1]
}

function tagsForTemp(tempC: number): TempTag[] {
  const tags: TempTag[] = []
  if (tempC <= -150) tags.push('cryo')
  if (tempC > -196 && tempC <= -20) tags.push('deep-freeze')
  if (tempC >= 15 && tempC <= 28) tags.push('neutral')
  if (tempC > 28 && tempC <= 100) tags.push('heat')
  if (tempC > 100) tags.push('autoclave')
  if (tags.length === 0) {
    return matchGuide(tempC).tags
  }
  return tags
}

function chipsForPage(slug: string): FeatureGridItem[] {
  const page = getPage(slug)
  if (!page) return []
  const grid = page.blocks.find((block) => block.type === 'featureGrid')
  if (!grid || grid.type !== 'featureGrid') return []
  return grid.items.slice(0, CHIP_LIMIT)
}

function resolveChips(guide: GuideMatch): { title: string; to: string }[] {
  if (guide.chips?.length) {
    return guide.chips.slice(0, CHIP_LIMIT).map((chip) => ({
      title: chip.title,
      to: solutionPath(chip.slug),
    }))
  }

  const path = solutionPath(guide.slug)
  return chipsForPage(guide.slug).map((chip) => ({
    title: chip.title,
    to: chip.href ? `${path}${chip.href}` : path,
  }))
}

function FeatureBackdrop({ slug }: { slug: string }) {
  const page = getPage(slug)
  const image = page?.heroImage
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null

  if (!resolved) {
    return <div className="temp-slider-bg-fallback" aria-hidden="true" />
  }

  return (
    <img
      key={slug}
      src={resolved.primary}
      alt=""
      loading="lazy"
      onError={(event) => {
        if (resolved.fallback && event.currentTarget.src !== resolved.fallback) {
          event.currentTarget.src = resolved.fallback
        }
      }}
    />
  )
}

export function TemperatureSlider() {
  const labelId = useId()
  const [tempC, setTempC] = useState(TEMP_DEFAULT)

  const guide = matchGuide(tempC)
  const tags = tagsForTemp(tempC)
  const chips = resolveChips(guide)
  const path = solutionPath(guide.slug)
  const pageTitle = getPage(guide.slug)?.title ?? guide.title
  const thumbPercent =
    ((tempC - TEMP_SCALE_MIN) / (TEMP_SCALE_MAX - TEMP_SCALE_MIN)) * 100

  return (
    <div className="temp-slider-layout">
      <div className="temp-slider-bg" aria-hidden="true">
        <FeatureBackdrop slug={guide.slug} />
      </div>

      <div className="temp-slider">
        <div className="temp-slider-readout">
          <p id={labelId} className="temp-slider-value">
            {formatTemp(tempC)}
          </p>
          <p className="temp-slider-match">
            Best match: <strong>{guide.title}</strong>
          </p>
        </div>

        <div className="temp-slider-control">
          <div className="temp-slider-track" aria-hidden="true">
            <span className="temp-slider-spectrum" />
            <span className="temp-slider-thumb-glow" style={{ left: `${thumbPercent}%` }} />
          </div>
          <input
            className="temp-slider-input"
            type="range"
            min={TEMP_SCALE_MIN}
            max={TEMP_SCALE_MAX}
            step={1}
            value={tempC}
            aria-labelledby={labelId}
            aria-valuetext={`${formatTemp(tempC)} — ${guide.title}`}
            onChange={(event) => setTempC(Number(event.target.value))}
          />
          <div className="temp-slider-scale" aria-hidden="true">
            <span>{formatTemp(TEMP_SCALE_MIN)}</span>
            <span>{formatTemp(TEMP_SCALE_MAX)}</span>
          </div>
        </div>

        <div className="temp-range-tags" role="group" aria-label="Jump to temperature class">
          {(Object.keys(TEMP_TAG_LABEL) as TempTag[]).map((tag) => {
            const active = tags.includes(tag)
            return (
              <button
                key={tag}
                type="button"
                className={`temp-tag temp-tag-${tag}${active ? ' is-active' : ''}`}
                aria-pressed={active}
                onClick={() => setTempC(TEMP_TAG_JUMP[tag])}
              >
                {TEMP_TAG_LABEL[tag]}
              </button>
            )
          })}
        </div>

        <Link className="btn btn-secondary" to={path}>
          Open {pageTitle}
        </Link>
      </div>

      <aside className="temp-slider-feature" aria-live="polite">
        <div className="temp-slider-feature-copy" key={guide.slug}>
          <p className="temp-slider-feature-kicker">{formatTemp(tempC)}</p>
          <h3 className="temp-slider-feature-title">{guide.headline}</h3>
          <p className="temp-slider-feature-body">{guide.body}</p>
        </div>

        {chips.length > 0 ? (
          <ul className="temp-slider-chips" aria-label={`${pageTitle} categories`}>
            {chips.map((chip) => (
              <li key={chip.title}>
                <Link to={chip.to} className="temp-slider-chip">
                  {chip.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </aside>
    </div>
  )
}
