const STATEMENTS = [
  {
    title: 'ISO 9001:2015 Certified',
    body: 'We are committed to providing reliable products and services that meet customer and regulatory requirements, through our ISO 9001:2015 certified quality management system.',
  },
  {
    title: 'ISO 22301:2012 Compliant',
    body: 'Our ISO 22301:2012 business continuity management system allows us to prepare for and reduce the likelihood of unexpected disruptions so that we may continue to serve our clients.',
  },
] as const

export function IsoBanner() {
  return (
    <section className="iso-banner" aria-label="ISO certifications">
      {STATEMENTS.map((statement) => (
        <div key={statement.title}>
          <h2>{statement.title}</h2>
          <p>{statement.body}</p>
        </div>
      ))}
    </section>
  )
}
