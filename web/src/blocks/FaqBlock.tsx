import type { FaqBlock } from '@/content/types'

export function FaqBlockView({ block }: { block: FaqBlock }) {
  return (
    <section className="block block-faq" aria-label={block.title ?? 'FAQ'}>
      <h2>{block.title ?? 'FAQ'}</h2>
      <div className="faq-list">
        {block.items.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>
              <span className="faq-item-question">{item.question}</span>
            </summary>
            <div className="faq-item-answer">
              <p>{item.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
