import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { slugify } from '@/content/slugify'
import type { BulletListBlock, ContentBlock, ImageBlock, SectionBlock } from '@/content/types'
import { paragraphLink, proseParagraphs } from './AutoclaveSections'
import { ImageBlockView } from './ImageBlock'
import { RichText } from './RichText'

type ProductItem = {
  section: SectionBlock
  image: ImageBlock
  bullets?: BulletListBlock
}

function readSection(blocks: ContentBlock[], start: number) {
  const section = blocks[start] as SectionBlock
  let next = start + 1
  const images: ImageBlock[] = []
  while (blocks[next]?.type === 'image') {
    images.push(blocks[next] as ImageBlock)
    next += 1
  }
  let paragraphs = [...section.paragraphs]
  const following = blocks[next]
  if (following?.type === 'text') {
    paragraphs = [...paragraphs, ...following.paragraphs]
    next += 1
  }
  const list = blocks[next]
  const bullets = list?.type === 'bulletList' ? list : undefined
  if (bullets) next += 1
  return {
    section: { ...section, paragraphs },
    images,
    bullets,
    next,
  }
}

function readProducts(blocks: ContentBlock[], start: number) {
  const items: ProductItem[] = []
  let i = start
  while (i < blocks.length) {
    const block = blocks[i]
    if (block.type !== 'section' || (block.level ?? 2) < 3) break
    let next = i + 1
    const images: ImageBlock[] = []
    while (blocks[next]?.type === 'image') {
      images.push(blocks[next] as ImageBlock)
      next += 1
    }
    if (!images.length) break
    const list = blocks[next]
    const bullets = list?.type === 'bulletList' ? list : undefined
    if (bullets) next += 1
    items.push({ section: block, image: images[0], bullets })
    i = next
  }
  return { items, next: i }
}

function ActionLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith('/')) {
    return (
      <Link className="btn btn-primary" to={href}>
        {label}
      </Link>
    )
  }
  const external = !href.startsWith('#')
  return (
    <a className="btn btn-primary" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
      {label}
    </a>
  )
}

function Points({ items }: { items: string[] }) {
  return (
    <ul className="automated-points">
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </ul>
  )
}

function Feature({
  image,
  section,
  bullets,
}: {
  image: ImageBlock
  section: SectionBlock
  bullets: BulletListBlock
}) {
  return (
    <section className="automated-feature" id={slugify(section.title)}>
      <div className="automated-feature-copy">
        <h2>{section.title}</h2>
        <Points items={bullets.items} />
      </div>
      <div className="automated-feature-media">
        <ImageBlockView src={image.src} alt={image.alt} fallbackSrc={image.fallbackSrc} />
      </div>
    </section>
  )
}

function Brand({ image, section }: { image: ImageBlock; section: SectionBlock }) {
  return (
    <header className="automated-brand" id={slugify(section.title)}>
      <img className="automated-brand-mark" src={image.src} alt={image.alt} />
      <div>
        <h2>{section.title}</h2>
        {section.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>
            <RichText text={paragraph} />
          </p>
        ))}
      </div>
    </header>
  )
}

function ProductGrid({ items }: { items: ProductItem[] }) {
  return (
    <div className="automated-grid">
      {items.map((item) => (
        <article key={item.section.title} className="automated-card" id={slugify(item.section.title)}>
          <div className="automated-card-media">
            <ImageBlockView
              src={item.image.src}
              alt={item.image.alt}
              fallbackSrc={item.image.fallbackSrc}
            />
          </div>
          <div className="automated-card-copy">
            <h3>{item.section.title}</h3>
            {item.bullets ? <Points items={item.bullets.items} /> : null}
          </div>
        </article>
      ))}
    </div>
  )
}

function Contact({
  id,
  title,
  body,
  href,
  label,
}: {
  id: string
  title?: string
  body: string
  href?: string
  label?: string
}) {
  return (
    <aside className="automated-contact" id={id}>
      <div>
        {title ? <h2>{title}</h2> : null}
        {body ? <p>{body}</p> : null}
      </div>
      {href && label ? <ActionLink href={href} label={label} /> : null}
    </aside>
  )
}

export function AutomatedLayout({ blocks }: { blocks: ContentBlock[] }) {
  const nodes: ReactNode[] = []
  let i = 0

  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === 'image') {
      const section = blocks[i + 1]
      const bullets = blocks[i + 2]
      if (section?.type === 'section' && bullets?.type === 'bulletList') {
        nodes.push(
          <Feature key={`feature-${i}`} image={block} section={section} bullets={bullets} />,
        )
        i += 3
        continue
      }
    }

    if (block.type === 'section' && (block.level ?? 2) < 3) {
      const absorbed = readSection(blocks, i)
      if (absorbed.images.length && !absorbed.bullets) {
        const products = readProducts(blocks, absorbed.next)
        nodes.push(
          <section key={`group-${i}`} className="automated-group">
            <Brand image={absorbed.images[0]} section={absorbed.section} />
            {products.items.length ? <ProductGrid items={products.items} /> : null}
          </section>,
        )
        i = products.next
        continue
      }

      const action = paragraphLink(absorbed.section.paragraphs)
      const prose = proseParagraphs(absorbed.section.paragraphs)
      if (action && !absorbed.images.length && !absorbed.bullets) {
        nodes.push(
          <Contact
            key={`contact-${i}`}
            id={slugify(block.title)}
            title={block.title}
            body={prose.join(' ')}
            href={action.href}
            label={action.label}
          />,
        )
        i = absorbed.next
        continue
      }

      nodes.push(
        <header key={`lead-${i}`} className="automated-lead" id={slugify(block.title)}>
          <h2>{block.title}</h2>
          {prose.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>
              <RichText text={paragraph} />
            </p>
          ))}
        </header>,
      )
      i = absorbed.next
      continue
    }

    if (block.type === 'section') {
      const products = readProducts(blocks, i)
      if (products.items.length) {
        nodes.push(<ProductGrid key={`grid-${i}`} items={products.items} />)
        i = products.next
        continue
      }
      const action = paragraphLink(block.paragraphs)
      const prose = proseParagraphs(block.paragraphs)
      nodes.push(
        <Contact
          key={`contact-${i}`}
          id={slugify(block.title)}
          title={prose.length ? block.title : undefined}
          body={prose.length ? prose.join(' ') : block.title}
          href={action?.href}
          label={action?.label}
        />,
      )
      i += 1
      continue
    }

    i += 1
  }

  return <>{nodes}</>
}
