import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { YoutubeLink, youtubeVideoId } from '@/components/YoutubeLink'

const LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/** Render the markdown links that appear inside a single paragraph. */
export function RichText({ text }: { text: string }) {
  const parts: ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK)) {
    const index = match.index ?? 0
    if (index > last) parts.push(text.slice(last, index))
    const label = match[1]
    const href = match[2].trim()
    if (href.startsWith('/')) {
      parts.push(
        <Link key={index} to={href}>
          {label}
        </Link>,
      )
    } else if (youtubeVideoId(href)) {
      parts.push(
        <YoutubeLink key={index} href={href}>
          {label}
        </YoutubeLink>,
      )
    } else {
      parts.push(
        <a key={index} href={href} target={href.startsWith('#') ? undefined : '_blank'} rel={href.startsWith('#') ? undefined : 'noreferrer'}>
          {label}
        </a>,
      )
    }
    last = index + match[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
