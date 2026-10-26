import { useEffect, useRef } from 'react'

type TaglineRevealProps = {
  lines: string[]
}

export function TaglineReveal({ lines }: TaglineRevealProps) {
  const rootRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const words = root.querySelectorAll<HTMLElement>('[data-tag-word]')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      words.forEach((word) => word.classList.add('is-on'))
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) entry.target.classList.add('is-on')
        }
      },
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 },
    )

    words.forEach((word) => io.observe(word))
    return () => io.disconnect()
  }, [lines])

  let wordIndex = 0

  return (
    <p className="about-tagline-copy" ref={rootRef}>
      {lines.map((line) => (
        <span className="about-tagline-line" key={line}>
          {line.split(' ').map((word) => {
            const delay = wordIndex * 60
            wordIndex += 1
            return (
              <span data-tag-word key={`${line}-${word}-${wordIndex}`} style={{ transitionDelay: `${delay}ms` }}>
                {word}
              </span>
            )
          })}
        </span>
      ))}
    </p>
  )
}
