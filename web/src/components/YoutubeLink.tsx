import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

/** YouTube watch, share, shorts, and embed URLs. Returns undefined for other links. */
export function youtubeVideoId(url: string): string | undefined {
  try {
    const parsed = new URL(url, 'https://www.youtube.com')
    const host = parsed.hostname.replace(/^www\./, '')
    if (host === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0]
      return id || undefined
    }
    if (host === 'youtube.com' || host === 'youtube-nocookie.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v') || undefined
      const parts = parsed.pathname.split('/').filter(Boolean)
      if (parts[0] === 'embed' || parts[0] === 'shorts' || parts[0] === 'live') return parts[1]
    }
  } catch {
    return undefined
  }
  return undefined
}

function VideoLightbox({
  title,
  embedSrc,
  onClose,
}: {
  title: string
  embedSrc: string
  onClose: () => void
}) {
  const titleId = useId()
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus()
    }
  }, [onClose])

  return createPortal(
    <div className="video-lightbox" onClick={onClose}>
      <div
        className="video-lightbox-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <p id={titleId} className="sr-only">
          {title}
        </p>
        <button
          ref={closeRef}
          type="button"
          className="video-lightbox-close"
          aria-label="Close video"
          onClick={onClose}
        >
          <span aria-hidden="true">×</span>
        </button>
        <div className="video-lightbox-frame">
          <iframe
            src={embedSrc}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      </div>
    </div>,
    document.body,
  )
}

function YoutubeDialog({
  videoId,
  title,
  start,
  onClose,
}: {
  videoId: string
  title: string
  start?: number
  onClose: () => void
}) {
  const startQuery = start ? `&start=${start}` : ''
  return (
    <VideoLightbox
      title={title}
      embedSrc={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}?autoplay=1&rel=0${startQuery}`}
      onClose={onClose}
    />
  )
}

export function VimeoLightbox({
  videoId,
  title,
  onClose,
}: {
  videoId: string
  title: string
  onClose: () => void
}) {
  return (
    <VideoLightbox
      title={title}
      embedSrc={`https://player.vimeo.com/video/${encodeURIComponent(videoId)}?autoplay=1`}
      onClose={onClose}
    />
  )
}

export function YoutubeLightbox({
  videoId,
  title,
  start,
  onClose,
}: {
  videoId: string
  title: string
  start?: number
  onClose: () => void
}) {
  return <YoutubeDialog videoId={videoId} title={title} start={start} onClose={onClose} />
}

/** Opens a YouTube URL in a lightbox. Other URLs stay normal links. */
export function YoutubeLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: ReactNode
}) {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const videoId = youtubeVideoId(href)
  const label = typeof children === 'string' ? children : 'YouTube video'

  if (!videoId) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    )
  }

  return (
    <>
      <button
        type="button"
        className={['youtube-trigger', className].filter(Boolean).join(' ')}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        {children}
      </button>
      {open ? <YoutubeDialog videoId={videoId} title={label} onClose={close} /> : null}
    </>
  )
}
