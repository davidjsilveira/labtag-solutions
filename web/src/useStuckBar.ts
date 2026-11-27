import { useEffect, useRef, useState } from 'react'

/** True while a position:sticky bar is pinned at its sticky top offset (drives the .is-stuck band, same as the PDP anchor menu). */
export function useStuckBar<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const el = ref.current
      if (!el) return
      setStuck(el.getBoundingClientRect().top <= (parseFloat(getComputedStyle(el).top) || 0) + 1)
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return [ref, stuck] as const
}
