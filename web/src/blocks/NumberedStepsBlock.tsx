import { useState } from 'react'
import { resolveImageSrc } from '@/content/resolveImage'
import type { NumberedStepImage, NumberedStepsBlock } from '@/content/types'

function StepImage({ image }: { image: NumberedStepImage }) {
  const resolved = resolveImageSrc(image.src, image.fallbackSrc)
  const [current, setCurrent] = useState(resolved.primary)

  return (
    <figure className="step-media">
      <img
        src={current}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        onError={() => {
          if (resolved.fallback && current !== resolved.fallback) {
            setCurrent(resolved.fallback)
          }
        }}
      />
    </figure>
  )
}

export function NumberedStepsBlockView({ block }: { block: NumberedStepsBlock }) {
  const hasImages = block.steps.some((step) => step.image)

  return (
    <section className={`block block-steps${hasImages ? ' block-steps-imaged' : ''}`}>
      {block.title ? <h2>{block.title}</h2> : null}
      {block.intro ? <p className="block-intro">{block.intro}</p> : null}
      <ol className={`step-list${hasImages ? ' step-list-imaged' : ''}`}>
        {block.steps.map((step, index) => (
          <li key={`${step.title}-${index}`} className={step.image ? 'step-with-image' : undefined}>
            {step.image ? <StepImage image={step.image} /> : null}
            <div className="step-copy">
              <span className="step-index">{index + 1}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
