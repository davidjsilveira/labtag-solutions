import { type ReactNode, useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { VimeoLightbox, YoutubeLightbox } from '@/components/YoutubeLink'
import { REQUEST_FORM_PATHS, SAMPLE_PATH } from '@/content/labtagLinks'
import { RichText } from './RichText'
import { resolveSolutionShopHref } from '@/content/splitActions'
import { resolveImageSrc } from '@/content/resolveImage'
import type { HeroImage } from '@/content/types'

type Props = {
  title: string
  description?: string[]
  image?: HeroImage
  solutionSlug?: string
  /** Related catalog or archive links shown under the hero CTAs. */
  related?: ReactNode
  /** Compact prev/next for cycling combined catalog articles. */
  cycle?: ReactNode
  /** Combined catalog articles stack the figure under the title instead of a two-column split. */
  layout?: 'split' | 'stack'
  /** Intro bullets kept with the hero instead of the page body. */
  points?: string[]
  /** Short linked note under the hero bullets. */
  note?: string
  /** Thumbnail strip shown under the hero video. */
  gallery?: HeroImage[]
}

type HeroAction = {
  label: string
  href: string
  external?: boolean
}

function resolveHeroActions(title: string, solutionSlug?: string): {
  primary: HeroAction
  secondary?: HeroAction
} {
  if (solutionSlug === 'pcr-labels-and-tags') {
    return {
      primary: {
        label: 'Browse Labels',
        href: 'https://www.labtag.com/shop/category/labels/labels-for-pcr/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'pre-labeled-labware') {
    return {
      primary: {
        label: 'Book a Free Consultation',
        href: 'https://www.labtag.com/contact-us/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'vaccine-labels') {
    return {
      primary: {
        label: 'Get Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
      secondary: {
        label: 'Get in Touch',
        href: '#contact-us',
      },
    }
  }

  if (solutionSlug === 'xylene-chemical-resistant-labels') {
    return {
      primary: {
        label: 'Shop Products',
        href: 'https://www.labtag.com/shop/category/chemical-resistant-labels/',
        external: true,
      },
      secondary: {
        label: 'Order Free Sample Kit',
        href: 'https://www.labtag.com/xylene-and-chemical-resistant-sample-kit/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'microscope-slide-over-labeling') {
    return {
      primary: {
        label: 'Get Free Samples',
        href: 'https://www.labtag.com/histology-sample-kit/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'laboratory-labels' || solutionSlug === 'lab-tapes') {
    return {
      primary: {
        label: 'Get Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'resitag-2') {
    return {
      primary: {
        label: 'Get in Touch',
        href: 'https://www.labtag.com/contact-us/',
        external: true,
      },
      secondary: {
        label: 'View Product',
        href: 'https://www.labtag.com/shop/product/chemical-resistant-labels-for-resin-embedding-1-x-0-25-xst-251-patent-pending/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'chemical-container-labeling') {
    return {
      primary: {
        label: 'Request a Quote',
        href: 'https://www.labtag.com/quote/',
        external: true,
      },
      secondary: {
        label: `Shop ${title}`,
        href: resolveSolutionShopHref(solutionSlug),
        external: true,
      },
    }
  }

  if (solutionSlug === 'clinical-trial-labels') {
    return {
      primary: {
        label: 'Request a Quote',
        href: 'https://www.labtag.com/quote',
        external: true,
      },
      secondary: {
        label: 'Get Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'covid-19-laboratory-labels') {
    return {
      primary: {
        label: 'Get Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'labels-for-hard-to-stick-surfaces') {
    return {
      primary: {
        label: 'Get Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'histology-labels') {
    return {
      primary: {
        label: 'Order Free Samples',
        href: 'https://www.labtag.com/histology-sample-kit/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'industrial-labels') {
    return {
      primary: {
        label: 'Shop All Industrial Labels on IndustriTAG.com',
        href: 'https://www.industritag.com',
        external: true,
      },
    }
  }

  if (solutionSlug === 'ivf-labeling-solutions') {
    return {
      primary: {
        label: 'Order Free Sample Kit',
        href: 'https://www.labtag.com/ivf-sample-kit/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'gatorcut') {
    return {
      primary: {
        label: 'Get Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'snappeel-2') {
    return {
      primary: {
        label: 'Shop SnapPEEL Labels',
        href: 'https://www.labtag.com/shop/brand-name/snappeel',
        external: true,
      },
    }
  }

  if (solutionSlug === 'dymo-compatible-laboratory-labels') {
    return {
      primary: {
        label: 'Shop 5-Series',
        href: 'https://www.labtag.com/shop/category/labels/cryogenic-labels/dymo-5-series-cryogenic-labels/',
        external: true,
      },
      secondary: {
        label: 'Shop 4-Series',
        href: 'https://www.labtag.com/shop/category/labels/dymo-labelwriter-450-compatible-labels/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'deep-freeze') {
    return {
      primary: {
        label: 'Order Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'custom-laboratory-labels') {
    return {
      primary: {
        label: 'Request a Quote',
        href: 'https://www.labtag.com/quote',
        external: true,
      },
      secondary: {
        label: 'Order Free Samples',
        href: 'https://www.labtag.com/samples/',
        external: true,
      },
    }
  }

  if (solutionSlug === 'cryogenic-labels') {
    return {
      primary: {
        label: 'Shop Products',
        href: 'https://www.labtag.com/shop/category/cryogenic-labels/',
        external: true,
      },
      secondary: {
        label: 'Free Samples',
        href: 'https://www.labtag.com/cryogenic-sample-kit',
        external: true,
      },
    }
  }

  if (solutionSlug === 'biobanking-labels') {
    return {
      primary: {
        label: `Shop ${title}`,
        href: resolveSolutionShopHref(solutionSlug),
        external: true,
      },
      secondary: {
        label: 'Order Free Sample Kit',
        href: 'https://www.labtag.com/cryogenic-sample-kit/',
        external: true,
      },
    }
  }

  const formConfig =
    solutionSlug && solutionSlug in REQUEST_FORM_PATHS
      ? REQUEST_FORM_PATHS[solutionSlug as keyof typeof REQUEST_FORM_PATHS]
      : undefined

  if (formConfig) {
    return {
      primary: { label: formConfig.primaryLabel, href: formConfig.path },
      secondary: {
        label: solutionSlug === 'autoclave-labels' ? 'Order Free Sample Kit' : 'Request a free sample',
        href: SAMPLE_PATH,
      },
    }
  }

  return {
    primary: {
      label: `Shop ${title}`,
      href: resolveSolutionShopHref(solutionSlug),
      external: true,
    },
    secondary: {
      label: solutionSlug === 'autoclave-labels' ? 'Order Free Sample Kit' : 'Request a free sample',
      href: SAMPLE_PATH,
    },
  }
}

function HeroActionLink({ action, className }: { action: HeroAction; className: string }) {
  if (action.external) {
    return (
      <a className={className} href={action.href} target="_blank" rel="noreferrer">
        {action.label}
      </a>
    )
  }
  return (
    <Link className={className} to={action.href}>
      {action.label}
    </Link>
  )
}

export function PageHero({
  title,
  description = [],
  image,
  solutionSlug,
  related,
  cycle,
  layout = 'split',
  points = [],
  note,
  gallery = [],
}: Props) {
  const resolved = image ? resolveImageSrc(image.src, image.fallbackSrc) : null
  const [current, setCurrent] = useState(resolved?.primary ?? '')
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = Boolean(image && resolved && !imageFailed)
  const actions = resolveHeroActions(title, solutionSlug)
  const stacked = layout === 'stack'
  const covidVideo = solutionSlug === 'covid-19-laboratory-labels'
  const cryoVideo = solutionSlug === 'cryogenic-labels'
  const gatorVideo = solutionSlug === 'gatorcut'
  const snappeelVideo = solutionSlug === 'snappeel-2'
  const ivfVideo = solutionSlug === 'ivf-labeling-solutions'
  const cryostuckVideo = solutionSlug === 'cryostuck'
  const resitagVideo = solutionSlug === 'resitag-2'
  const labVideo = solutionSlug === 'laboratory-labels'
  const tapesVideo = solutionSlug === 'lab-tapes'
  const rfidVideo = solutionSlug === 'rfid-labels-tags'
  const xyleneVideo = solutionSlug === 'xylene-chemical-resistant-labels'
  const playable =
    covidVideo ||
    cryoVideo ||
    gatorVideo ||
    snappeelVideo ||
    ivfVideo ||
    cryostuckVideo ||
    resitagVideo ||
    labVideo ||
    tapesVideo ||
    rfidVideo ||
    xyleneVideo
  const [videoOpen, setVideoOpen] = useState(false)
  const closeVideo = useCallback(() => setVideoOpen(false), [])
  const showMedia = Boolean((showImage && image) || playable)
  const poster = snappeelVideo
    ? 'https://cdn.labtag.com/wp-content/uploads/SnapPEEL-VideoThumb.jpg'
    : gatorVideo
      ? 'https://cdn.labtag.com/wp-content/uploads/TDF-25-use3-1-2.jpg'
      : cryostuckVideo
        ? 'https://i.ytimg.com/vi/E9Nnv_l9rQI/hqdefault.jpg'
        : resitagVideo
          ? 'https://i.ytimg.com/vi/CUqqjcDkdDI/hqdefault.jpg'
          : labVideo
            ? 'https://i.ytimg.com/vi/u2wky3xjv5Q/hqdefault.jpg'
            : tapesVideo
              ? 'https://i.ytimg.com/vi/8AQVHE0RQuo/hqdefault.jpg'
              : rfidVideo
                ? 'https://i.ytimg.com/vi/MFsJ-5hwx8Q/hqdefault.jpg'
                : xyleneVideo
                  ? 'https://i.ytimg.com/vi/-1VW3RzLNqk/hqdefault.jpg'
        : ivfVideo
          ? 'https://i.ytimg.com/vi/IlwTVR25hBw/hqdefault.jpg'
          : cryoVideo
            ? 'https://i.ytimg.com/vi/o3ucTLU90to/hqdefault.jpg'
            : current
  const playLabel = snappeelVideo
    ? 'Play SnapPEEL video'
    : gatorVideo
      ? 'Play GatorCUT video'
      : cryostuckVideo
        ? 'Play CryoSTUCK video'
        : resitagVideo
          ? 'Play ResiTAG video'
          : labVideo
            ? 'Play laboratory labels video'
            : tapesVideo
              ? 'Play lab tapes video'
              : rfidVideo
                ? 'Play RFID labels video'
                : xyleneVideo
                  ? 'Play xylene labels video'
        : ivfVideo
          ? 'Play IVF labeling video'
          : cryoVideo
            ? 'Play cryogenic labels video'
            : 'Play COVID-19 labels video'
  const media = showMedia ? (
    <figure className={`page-hero-media${solutionSlug === 'microscope-slide-over-labeling' ? ' page-hero-media-product' : ''}`}>
      {playable ? (
        <button
          type="button"
          className="covid-play"
          aria-haspopup="dialog"
          aria-label={playLabel}
          onClick={() => setVideoOpen(true)}
        >
          <img src={poster} alt="" />
          <span className="covid-play-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28">
              <path d="M9 7.5v9l8-4.5-8-4.5z" fill="currentColor" />
            </svg>
          </span>
        </button>
      ) : (
        <img
          src={current}
          alt={image?.alt || title}
          decoding="async"
          fetchPriority="high"
          onError={() => {
            if (resolved?.fallback && current !== resolved.fallback) {
              setCurrent(resolved.fallback)
              return
            }
            setImageFailed(true)
          }}
        />
      )}
      {covidVideo && videoOpen ? (
        <VimeoLightbox videoId="675493538" title="COVID-19 Labels" onClose={closeVideo} />
      ) : null}
      {cryoVideo && videoOpen ? (
        <YoutubeLightbox videoId="o3ucTLU90to" title="Cryogenic Labels" onClose={closeVideo} />
      ) : null}
      {gatorVideo && videoOpen ? (
        <YoutubeLightbox videoId="Ifyblwrpp_o" title="GatorCUT™ Technology" onClose={closeVideo} />
      ) : null}
      {snappeelVideo && videoOpen ? (
        <YoutubeLightbox
          videoId="DSjMJul8KjQ"
          title="SnapPEEL™"
          start={17}
          onClose={closeVideo}
        />
      ) : null}
      {ivfVideo && videoOpen ? (
        <YoutubeLightbox videoId="IlwTVR25hBw" title="IVF labeling solutions" onClose={closeVideo} />
      ) : null}
      {cryostuckVideo && videoOpen ? (
        <YoutubeLightbox videoId="E9Nnv_l9rQI" title="CryoSTUCK® Labels" onClose={closeVideo} />
      ) : null}
      {resitagVideo && videoOpen ? (
        <YoutubeLightbox videoId="CUqqjcDkdDI" title="ResiTAG®" start={17} onClose={closeVideo} />
      ) : null}
      {labVideo && videoOpen ? (
        <YoutubeLightbox videoId="u2wky3xjv5Q" title="Laboratory Labels" onClose={closeVideo} />
      ) : null}
      {tapesVideo && videoOpen ? (
        <YoutubeLightbox videoId="8AQVHE0RQuo" title="Lab Tapes" start={12} onClose={closeVideo} />
      ) : null}
      {rfidVideo && videoOpen ? (
        <YoutubeLightbox videoId="MFsJ-5hwx8Q" title="RFID Labels & RFID Tags" onClose={closeVideo} />
      ) : null}
      {xyleneVideo && videoOpen ? (
        <YoutubeLightbox videoId="-1VW3RzLNqk" title="Xylene & Chemical Resistant Labels" onClose={closeVideo} />
      ) : null}
      {solutionSlug === 'microscope-slide-over-labeling' && videoOpen ? (
        <YoutubeLightbox videoId="iItbdYojU3E" title="Histo-PinTAG" onClose={closeVideo} />
      ) : null}
      {cryostuckVideo && gallery.length ? (
        <ul className="cryostuck-thumbs">
          {gallery.map((item) => (
            <li key={item.src}>
              <img src={resolveImageSrc(item.src, item.fallbackSrc).primary} alt={item.alt || ''} />
            </li>
          ))}
        </ul>
      ) : null}
    </figure>
  ) : null

  return (
    <header
      className={`page-hero${solutionSlug === 'pcr-labels-and-tags' ? ' page-hero-pcr' : ''}${solutionSlug === 'pre-labeled-labware' ? ' page-hero-prelab' : ''}${rfidVideo ? ' page-hero-rfid' : ''}${showImage || playable ? (stacked ? ' page-hero-stack' : ' page-hero-split') : ''}`}
    >
      <div className="page-hero-copy">
        {solutionSlug === 'resitag-2' ? <p className="page-hero-label">ResiTAG®</p> : null}
        <h1>{title}</h1>
        {description.length ? (
          <div className="page-hero-description">
            {description.map((paragraph, index) => (
              <p key={index}>
                <RichText text={paragraph} />
              </p>
            ))}
          </div>
        ) : null}
        {points.length ? (
          <ul className="covid-hero-points">
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
        ) : null}
        {note ? (
          <p className="covid-hero-note">
            <RichText text={note} />
          </p>
        ) : null}
        {stacked ? media : null}
        {solutionSlug === 'label-printing-solutions' || solutionSlug === 'cryostuck' || rfidVideo ? null : solutionSlug === 'label-software' ? (
          <div className="page-hero-actions">
            <a className="btn btn-primary" href="#design">
              Design Software
            </a>
            <a className="btn btn-primary" href="#informatics">
              Informatics Software
            </a>
          </div>
        ) : (
          <div className="page-hero-actions">
            <HeroActionLink action={actions.primary} className="btn btn-primary" />
            {solutionSlug === 'microscope-slide-over-labeling' ? (
              <button type="button" className="btn btn-secondary" onClick={() => setVideoOpen(true)}>
                Watch Video
              </button>
            ) : actions.secondary ? (
              <HeroActionLink action={actions.secondary} className="btn btn-secondary" />
            ) : null}
          </div>
        )}
        {related}
      </div>

      {stacked ? null : media}
      {cycle}
    </header>
  )
}
