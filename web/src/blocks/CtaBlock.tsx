import { Link } from 'react-router-dom'
import type { CtaBlock } from '@/content/types'

export function CtaBlockView({ block }: { block: CtaBlock }) {
  const action =
    block.actionHref && block.actionLabel ? (
      block.actionHref.startsWith('http') ? (
        <a className="btn btn-primary" href={block.actionHref} target="_blank" rel="noreferrer">
          {block.actionLabel}
        </a>
      ) : (
        <Link className="btn btn-primary" to={block.actionHref}>
          {block.actionLabel}
        </Link>
      )
    ) : null

  return (
    <aside className="block block-cta">
      <h2>{block.title}</h2>
      {block.body ? <p>{block.body}</p> : null}
      {action ? <div className="block-cta-actions">{action}</div> : null}
    </aside>
  )
}
