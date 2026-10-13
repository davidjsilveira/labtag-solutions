import type { NumberedStepsBlock } from '@/content/types'

export function NumberedStepsBlockView({ block }: { block: NumberedStepsBlock }) {
  return (
    <section className="block block-steps">
      {block.title ? <h2>{block.title}</h2> : null}
      {block.intro ? <p className="block-intro">{block.intro}</p> : null}
      <ol className="step-list">
        {block.steps.map((step, index) => (
          <li key={`${step.title}-${index}`}>
            <span className="step-index">{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
