import type { FaqBlock } from '@/content/types'

export function FaqBlockView({ block }: { block: FaqBlock }) {
  return (
    <section className="block block-faq">
      <h2>{block.title ?? 'Frequently Asked Questions'}</h2>
      <div className="faq-list">
        {block.items.map((item) => (
          <details key={item.question} className="faq-item">
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
