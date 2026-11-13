import { Link, useParams } from 'react-router-dom'
import { BlockRenderer } from '@/blocks/BlockRenderer'
import { PageHero } from '@/blocks/PageHero'
import { RichText } from '@/blocks/RichText'
import { pagesForBrowseAll } from '@/content/categories'
import { getPage } from '@/content/loadPages'
import type { HeroImage } from '@/content/types'

export function SolutionPage() {
  const { slug = '' } = useParams()
  const page = getPage(slug)

  if (!page) {
    return (
      <div className="missing">
        <h1>Page not found</h1>
        <p>No solution matches “{slug}”.</p>
        <Link to="/">Back to all solutions</Link>
      </div>
    )
  }

  const siblings = pagesForBrowseAll()
  const index = siblings.findIndex((item) => item.slug === page.slug)
  const prev = siblings[index - 1]
  const next = siblings[index + 1]
  const animalHealthcare = page.slug === 'animal-healthcare'
  const autoclave = page.slug === 'autoclave-labels'
  const automated = page.slug === 'automated-labels'
  const biobanking = page.slug === 'biobanking-labels'
  const cannabis = page.slug === 'cannabis-labels'
  const chemical = page.slug === 'chemical-container-labeling'
  const clinical = page.slug === 'clinical-trial-labels'
  const covid = page.slug === 'covid-19-laboratory-labels'
  const cryogenic = page.slug === 'cryogenic-labels'
  const custom = page.slug === 'custom-laboratory-labels'
  const deepFreeze = page.slug === 'deep-freeze'
  const gatorcut = page.slug === 'gatorcut'
  const snappeel = page.slug === 'snappeel-2'
  const cryostuck = page.slug === 'cryostuck'
  const hardstick = page.slug === 'labels-for-hard-to-stick-surfaces'
  const covidPoints =
    covid && page.blocks[0]?.type === 'bulletList' ? page.blocks[0].items : undefined
  const covidNote =
    covidPoints && page.blocks[1]?.type === 'text' ? page.blocks[1].paragraphs[0] : undefined
  const covidBlocks =
    covidPoints && covidNote ? page.blocks.slice(2) : covidPoints ? page.blocks.slice(1) : page.blocks
  const cryostuckPoints =
    cryostuck && page.blocks[0]?.type === 'bulletList' ? page.blocks[0].items : undefined
  let cryostuckBlocks = cryostuckPoints ? page.blocks.slice(1) : page.blocks
  const cryostuckGallery: HeroImage[] = []
  if (cryostuck) {
    while (cryostuckBlocks[0]?.type === 'image') {
      const image = cryostuckBlocks[0]
      cryostuckGallery.push({
        src: image.src,
        alt: image.alt,
        fallbackSrc: image.fallbackSrc,
      })
      cryostuckBlocks = cryostuckBlocks.slice(1)
    }
  }
  const hardstickPoints =
    hardstick && page.blocks[0]?.type === 'bulletList' ? page.blocks[0].items : undefined
  const hardstickBlocks = hardstickPoints ? page.blocks.slice(1) : page.blocks
  const pcr = page.slug === 'pcr-labels-and-tags'
  const pcrPoints = pcr && page.blocks[0]?.type === 'bulletList' ? page.blocks[0].items : undefined
  const pcrNote = pcrPoints && page.blocks[1]?.type === 'text' ? page.blocks[1].paragraphs[0] : undefined
  const pcrBlocks = pcrPoints && pcrNote ? page.blocks.slice(2) : pcrPoints ? page.blocks.slice(1) : page.blocks
  const heroPoints = covidPoints ?? cryostuckPoints ?? hardstickPoints ?? pcrPoints
  const bodyBlocks = pcr ? pcrBlocks : cryostuck ? cryostuckBlocks : hardstick ? hardstickBlocks : covidBlocks
  const heroDescription = cannabis ? page.description.slice(0, 1) : page.description
  const cannabisLead = cannabis ? page.description.slice(1) : []
  return (
    <article
      className={`solution-page${animalHealthcare ? ' is-animal-healthcare' : ''}${autoclave ? ' is-autoclave' : ''}${automated ? ' is-automated' : ''}${biobanking ? ' is-biobanking' : ''}${cannabis ? ' is-cannabis' : ''}${chemical ? ' is-chemical' : ''}${clinical ? ' is-clinical' : ''}${covid ? ' is-covid' : ''}${cryogenic ? ' is-cryogenic' : ''}${cryostuck ? ' is-cryostuck' : ''}${custom ? ' is-custom' : ''}${deepFreeze ? ' is-deep-freeze' : ''}${gatorcut ? ' is-gatorcut' : ''}${snappeel ? ' is-snappeel' : ''}`}
    >
      <PageHero
        key={page.slug}
        title={page.title}
        description={heroDescription}
        image={page.heroImage}
        solutionSlug={page.slug}
        layout="split"
        points={heroPoints}
        note={covidNote ?? pcrNote}
        gallery={cryostuckGallery}
      />
      {cannabisLead.length ? (
        <div className="cannabis-lead">
          {cannabisLead.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>
              <RichText text={paragraph} />
            </p>
          ))}
        </div>
      ) : null}
      <BlockRenderer blocks={bodyBlocks} solutionSlug={page.slug} />

      <nav className="pager" aria-label="Adjacent solutions">
          {prev ? (
            <Link to={`/solutions/${prev.slug}`} className="pager-link prev">
              <span>Previous</span>
              <strong>{prev.title}</strong>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link to={`/solutions/${next.slug}`} className="pager-link next">
              <span>Next</span>
              <strong>{next.title}</strong>
            </Link>
          ) : null}
      </nav>
    </article>
  )
}
