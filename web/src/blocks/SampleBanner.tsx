import { Link } from 'react-router-dom'
import { isSampleHref, toInternalSampleHref } from '@/content/labtagLinks'

const FOLDER =
  '/media/histology-labels/Sample-kit-img-1.png'

type Props = {
  title: string
  body?: string
  href: string
  label: string
  id?: string
}

export function SampleBanner({ title, body, href, label, id }: Props) {
  const resolvedHref = toInternalSampleHref(href)
  const external = /^https?:/i.test(resolvedHref) && !isSampleHref(resolvedHref)
  const action = external ? (
    <a className="btn btn-primary" href={resolvedHref} target="_blank" rel="noreferrer">
      {label}
    </a>
  ) : (
    <Link className="btn btn-primary" to={resolvedHref}>
      {label}
    </Link>
  )

  return (
    <section className="sample-banner" id={id} aria-label={title}>
      <div className="sample-banner-inner">
        <div className="sample-banner-copy">
          <h2>{title}</h2>
          {body ? <p>{body}</p> : null}
          {action}
        </div>
        <img src={FOLDER} alt="" />
      </div>
    </section>
  )
}
