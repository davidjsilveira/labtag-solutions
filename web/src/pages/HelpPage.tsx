import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { EnvelopeSimple, MagnifyingGlass, Package, Phone, Printer, Tag, Desktop, X } from '@phosphor-icons/react'
import { HELP_CATEGORIES, HELP_ARTICLES, type HelpCategory } from '@/content/helpArticles'
import {
  CONTACT_PATH,
  LABTAG_FINDER_URL,
  LABTAG_ORDERS_URL,
  LABTAG_TEMPLATES_HUB_URL,
  SAMPLE_PATH,
} from '@/content/labtagLinks'

const PHONE = { label: '1 800 518 0364', href: 'tel:+18005180364' }
const PHONE_INTL = { label: '+1 450 973 9420', href: 'tel:+14509739420' }
const SUPPORT_EMAIL = 'support@ga-international.com'
const ORDERS_EMAIL = 'info@ga-international.com'
const COMMON_IDS = ['printer-compatibility', 'apply-cryostuck', 'calibrate', 'returns', 'track-order', 'word-margins']

const CATEGORY_ICONS = {
  labels: Tag,
  printers: Printer,
  software: Desktop,
  orders: Package,
} as const

type HelpResult = (typeof HELP_ARTICLES)[number]

function articleMatches(article: HelpResult, normalized: string) {
  if (!normalized) return true
  const haystack = `${article.question} ${article.answer} ${article.category}`.toLowerCase()
  if (haystack.includes(normalized)) return true
  const stem = normalized.endsWith('s') ? normalized.slice(0, -1) : ''
  return stem.length > 2 && haystack.includes(stem)
}

function Highlight({ text, query }: { text: string; query: string }) {
  const needle = query.trim()
  if (!needle) return text
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escaped})`, 'ig'))
  return parts.map((part, index) =>
    part.toLowerCase() === needle.toLowerCase() ? <mark key={`${part}-${index}`}>{part}</mark> : part,
  )
}

function Answer({ text }: { text: string }) {
  const blocks = text.trim().split(/\n\n+/)
  return (
    <div className="faq-item-answer">
      {blocks.map((block) => {
        const lines = block.split('\n').filter((line) => line.length > 0)
        const bulletStart = lines.findIndex((line) => line.startsWith('• '))
        const bullets =
          bulletStart >= 0 && lines.slice(bulletStart).every((line) => line.startsWith('• '))
            ? lines.slice(bulletStart)
            : null
        if (!bullets) return <p key={block}>{block}</p>
        return (
          <Fragment key={block}>
            {lines.slice(0, bulletStart).map((line) => (
              <p key={line}>{line}</p>
            ))}
            <ul>
              {bullets.map((line, index) => (
                <li key={`${line}-${index}`}>{line.slice(2)}</li>
              ))}
            </ul>
          </Fragment>
        )
      })}
    </div>
  )
}

function ArticleList({
  articles,
  openId,
  query,
  showTopic,
  onToggle,
}: {
  articles: HelpResult[]
  openId: string | null
  query: string
  showTopic: boolean
  onToggle: (id: string, isOpen: boolean) => void
}) {
  return (
    <div className="faq-list">
      {articles.map((article) => (
        <details
          key={article.id}
          id={article.id}
          className="faq-item"
          open={openId === article.id}
          onToggle={(event) => onToggle(article.id, event.currentTarget.open)}
        >
          <summary>
            <span className="faq-item-question">
              {showTopic ? <span className="help-article-topic">{article.category}</span> : null}
              <Highlight text={article.question} query={query} />
            </span>
          </summary>
          <Answer text={article.answer} />
        </details>
      ))}
    </div>
  )
}

export function HelpPage() {
  const [query, setQuery] = useState('')
  const [categoryId, setCategoryId] = useState<HelpCategory['id'] | 'all'>('all')
  const [openId, setOpenId] = useState<string | null>(null)
  const scrollToId = useRef<string | null>(null)

  useEffect(() => {
    const previous = document.title
    document.title = 'Help | LabTAG knowledge base'
    return () => {
      document.title = previous
    }
  }, [])

  useEffect(() => {
    function openFromHash() {
      const id = window.location.hash.replace('#', '')
      if (!id) return
      const match = HELP_ARTICLES.find((article) => article.id === id)
      if (!match) return
      scrollToId.current = match.id
      setQuery('')
      setCategoryId('all')
      setOpenId(match.id)
    }
    openFromHash()
    window.addEventListener('hashchange', openFromHash)
    return () => window.removeEventListener('hashchange', openFromHash)
  }, [])

  useEffect(() => {
    const nextHash = openId ? `#${openId}` : ''
    if (window.location.hash === nextHash) return
    const url = `${window.location.pathname}${window.location.search}${nextHash}`
    window.history.replaceState(null, '', url)
  }, [openId])

  useEffect(() => {
    if (!openId || scrollToId.current !== openId) return
    scrollToId.current = null
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    document.getElementById(openId)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }, [openId, categoryId, query])

  const normalized = query.trim().toLowerCase()

  const results = useMemo(
    () =>
      HELP_ARTICLES.filter((article) => {
        if (categoryId !== 'all' && article.categoryId !== categoryId) return false
        return articleMatches(article, normalized)
      }),
    [categoryId, normalized],
  )

  const elsewhere = useMemo(() => {
    if (!normalized || categoryId === 'all') return 0
    return HELP_ARTICLES.filter((article) => article.categoryId !== categoryId && articleMatches(article, normalized)).length
  }, [categoryId, normalized])

  const groups = useMemo(
    () =>
      HELP_CATEGORIES.map((category) => ({
        ...category,
        articles: results.filter((article) => article.categoryId === category.id),
      })).filter((group) => group.articles.length > 0),
    [results],
  )

  const common = COMMON_IDS.map((id) => HELP_ARTICLES.find((article) => article.id === id)).filter(
    (article): article is HelpResult => Boolean(article),
  )

  function toggleArticle(id: string, isOpen: boolean) {
    setOpenId((current) => (isOpen ? id : current === id ? null : current))
  }

  function openArticle(article: HelpResult) {
    scrollToId.current = article.id
    setQuery('')
    setCategoryId('all')
    setOpenId(article.id)
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: HELP_ARTICLES.map((article) => ({
      '@type': 'Question',
      name: article.question,
      acceptedAnswer: { '@type': 'Answer', text: article.answer.replace(/\n+/g, ' ') },
    })),
  }

  return (
    <article className="help-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <header className="help-hero">
        <p className="help-kicker">Help center</p>
        <h1>How can we help you?</h1>
        <p>Browse the knowledge base, or search for a label, printer, template, or order question.</p>
        <form className="help-search" role="search" onSubmit={(event) => event.preventDefault()}>
          <MagnifyingGlass size={18} weight="bold" aria-hidden />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search labels, printers, templates, orders"
            aria-label="Search the knowledge base"
          />
          {query ? (
            <button type="button" className="help-search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={14} weight="bold" aria-hidden />
            </button>
          ) : null}
        </form>
      </header>

      <div className="help-topics" role="tablist" aria-label="Help topics">
        {HELP_CATEGORIES.map((category) => {
          const Icon = CATEGORY_ICONS[category.id]
          const count = HELP_ARTICLES.filter(
            (article) => article.categoryId === category.id && articleMatches(article, normalized),
          ).length
          const selected = categoryId === category.id
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={selected}
              className={`help-topic${selected ? ' is-active' : ''}${count === 0 ? ' is-empty' : ''}`}
              onClick={() => setCategoryId(selected ? 'all' : category.id)}
            >
              <span className="help-topic-icon">
                <Icon size={22} weight="duotone" aria-hidden />
              </span>
              <strong>{category.label}</strong>
              <span className="help-topic-lede">{category.lede}</span>
              <span className="help-topic-count">
                {count} {count === 1 ? 'article' : 'articles'}
              </span>
            </button>
          )
        })}
      </div>

      <div className="help-layout">
        <div className="help-main">
          {!normalized && categoryId === 'all' ? (
            <section className="help-common" aria-labelledby="help-common-title">
              <h2 id="help-common-title">Common questions</h2>
              <ul>
                {common.map((article) => (
                  <li key={article.id}>
                    <button type="button" onClick={() => openArticle(article)}>
                      <span>{article.category}</span>
                      {article.question}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {results.length > 0 && categoryId !== 'all' ? (
            <p className="help-count">
              {results.length} {results.length === 1 ? 'article' : 'articles'}
              <button type="button" onClick={() => setCategoryId('all')}>
                View all topics
              </button>
            </p>
          ) : null}

          {results.length === 0 ? (
            <div className="help-empty">
              <p>
                Nothing in {categoryId === 'all' ? 'the knowledge base' : 'this topic'} matches “{query.trim()}”.
              </p>
              {elsewhere > 0 ? (
                <button type="button" onClick={() => setCategoryId('all')}>
                  Show {elsewhere} {elsewhere === 1 ? 'match' : 'matches'} in other topics
                </button>
              ) : (
                <Link to={CONTACT_PATH}>Contact support</Link>
              )}
            </div>
          ) : categoryId === 'all' ? (
            groups.map((group) => (
              <section key={group.id} className="help-group" aria-labelledby={`help-${group.id}`}>
                <h2 id={`help-${group.id}`}>{group.label}</h2>
                <p>{group.lede}</p>
                <ArticleList
                  articles={group.articles}
                  openId={openId}
                  query={query}
                  showTopic={false}
                  onToggle={toggleArticle}
                />
              </section>
            ))
          ) : (
            <ArticleList articles={results} openId={openId} query={query} showTopic={false} onToggle={toggleArticle} />
          )}
        </div>

        <aside className="help-aside" aria-label="Contact support">
          <h2>Still need a person?</h2>
          <p>Support can match a printer, a template, or an order when the article does not.</p>
          <a className="help-contact" href={PHONE.href}>
            <Phone size={18} weight="bold" aria-hidden />
            <span>
              <strong>{PHONE.label}</strong>
              Toll free, North America
            </span>
          </a>
          <a className="help-contact" href={PHONE_INTL.href}>
            <Phone size={18} weight="bold" aria-hidden />
            <span>
              <strong>{PHONE_INTL.label}</strong>
              International
            </span>
          </a>
          <a className="help-contact" href={`mailto:${SUPPORT_EMAIL}`}>
            <EnvelopeSimple size={18} weight="bold" aria-hidden />
            <span>
              <strong>{SUPPORT_EMAIL}</strong>
              Email the support desk
            </span>
          </a>
          <a className="help-contact" href={`mailto:${ORDERS_EMAIL}`}>
            <EnvelopeSimple size={18} weight="bold" aria-hidden />
            <span>
              <strong>{ORDERS_EMAIL}</strong>
              Order tracking
            </span>
          </a>
          <Link className="btn btn-primary" to={CONTACT_PATH}>
            Contact us
          </Link>
          <nav className="help-links" aria-label="Related">
            <a href={LABTAG_FINDER_URL} target="_blank" rel="noreferrer">
              Label finder
            </a>
            <a href={LABTAG_TEMPLATES_HUB_URL} target="_blank" rel="noreferrer">
              Label templates
            </a>
            <a href={LABTAG_ORDERS_URL} target="_blank" rel="noreferrer">
              My orders
            </a>
            <Link to={SAMPLE_PATH}>Free samples</Link>
          </nav>
        </aside>
      </div>
    </article>
  )
}
