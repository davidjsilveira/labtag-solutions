type Props = {
  title: string
  sources: string[]
  eyebrow?: string
}

export function PageHero({ title, sources, eyebrow = 'LabTAG Solutions' }: Props) {
  return (
    <header className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {sources.length ? (
        <ul className="source-list">
          {sources.map((url) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noreferrer">
                {url.replace('https://www.labtag.com', '')}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  )
}
