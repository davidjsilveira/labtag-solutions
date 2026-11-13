import { Link } from 'react-router-dom'

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
  const external = /^https?:/i.test(href)
  const action = external ? (
    <a className="btn btn-primary" href={href} target="_blank" rel="noreferrer">
      {label}
    </a>
  ) : (
    <Link className="btn btn-primary" to={href}>
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
