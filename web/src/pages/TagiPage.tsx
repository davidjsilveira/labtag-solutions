import { Fragment, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Sparkle } from '@phosphor-icons/react'
import { composeTagiAnswer, TAGI_SYSTEM_PROMPT, tagiContext, type TagiAnswer, type TagiSource } from '@/content/tagi'
import { CONTACT_PATH, LABTAG_PRIVACY_URL, LABTAG_TERMS_URL } from '@/content/labtagLinks'
import { recommendedProducts, storeProduct, withoutShopLine, type StoreLabel } from '@/content/storeLabel'

const PROMPTS = [
  'What label fits a 1.5 ml tube?',
  'What label fits a 2 ml cryogenic vial?',
  'What size label fits a 0.2 ml PCR tube?',
  'Which labels work in liquid nitrogen?',
  'What labels work at −80°C?',
  'What autoclave labels are available?',
]

function relatedQuestions(question: string, prior: string[]) {
  const asked = new Set(prior.map((item) => item.trim().toLowerCase()))
  asked.add(question.trim().toLowerCase())
  const pcr = /pcr/i.test(question)
  const vial = /vial|cryo/i.test(question)
  const tube = /tube/i.test(question) && !pcr
  const cold = /nitrogen|−80|-80|freezer/i.test(question)
  const heat = /autoclave/i.test(question)
  const chemical = /xylene|chemical/i.test(question)
  const preferred = pcr
    ? ['What label fits a 1.5 ml tube?', 'What autoclave labels are available?']
    : heat
      ? ['Which labels resist xylene?', 'What label fits a 1.5 ml tube?']
      : chemical
        ? ['What autoclave labels are available?', 'What label fits a 1.5 ml tube?']
        : cold && !tube && !vial
          ? ['What label fits a 2 ml cryogenic vial?', 'What label fits a 1.5 ml tube?']
          : vial
            ? ['Which labels work in liquid nitrogen?', 'What label fits a 1.5 ml tube?']
            : tube
              ? ['What labels work at −80°C?', 'What label fits a 2 ml cryogenic vial?']
              : ['What label fits a 1.5 ml tube?', 'Which labels work in liquid nitrogen?']
  return [...new Set([...preferred, ...PROMPTS, 'Which labels resist xylene?'])]
    .filter((prompt) => !asked.has(prompt.toLowerCase()))
    .slice(0, 2)
}

function answerRecap(text: string) {
  const codes = [...new Set(withoutShopLine(text).match(/\b(?:L2FX|L2FS|AHA|TRCL)-\d+\b/g) ?? [])]
  if (codes.length > 0) return `Show ${codes.slice(0, 3).join(', ')}`
  return 'Show answer'
}

type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  text: string
  sources?: TagiSource[]
  store?: StoreLabel
}

function LinkedText({ text }: { text: string }) {
  const parts = text.split(/(\b(?:L2FX|L2FS|AHA|TRCL)-\d+\b)/g)
  return parts.map((part, index) => {
    const product = storeProduct(part)
    if (!product) return <Fragment key={index}>{part}</Fragment>
    return <SkuLink key={`${part}-${index}`} code={part} product={product} />
  })
}

function SkuLink({ code, product }: { code: string; product: StoreLabel }) {
  const linkRef = useRef<HTMLAnchorElement>(null)
  const [box, setBox] = useState<{ top: number; left: number; above: boolean } | null>(null)

  function place() {
    const rect = linkRef.current?.getBoundingClientRect()
    if (!rect) return
    const width = 288
    const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8)
    const above = rect.top > 160
    setBox({ top: above ? rect.top - 8 : rect.bottom + 8, left, above })
  }

  useEffect(() => {
    if (!box) return
    const close = () => setBox(null)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [box])

  return (
    <>
      <a
        ref={linkRef}
        href={product.href}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={place}
        onMouseLeave={() => setBox(null)}
        onFocus={place}
        onBlur={() => setBox(null)}
      >
        {code}
      </a>
      {box
        ? createPortal(
            <span
              className={box.above ? 'tagi-sku-preview is-above' : 'tagi-sku-preview'}
              style={{ top: box.top, left: box.left }}
            >
              {product.image ? <img src={product.image} alt="" /> : null}
              <span>
                <span className="tagi-sku-code">{product.title}</span>
                {product.detail ? <span className="tagi-sku-size">{product.detail}</span> : null}
                {product.name ? <span className="tagi-sku-name">{product.name}</span> : null}
              </span>
            </span>,
            document.body,
          )
        : null}
    </>
  )
}

function StoreActions({ text, store }: { text: string; store?: StoreLabel }) {
  const products = recommendedProducts(text, store)
  if (products.length > 1) {
    const family = products.every((product) => product.name && product.name === products[0].name)
      ? products[0].name
      : undefined
    return (
      <div className="tagi-product-set">
        {family ? <p className="tagi-product-family">{family}</p> : null}
        <ul className="tagi-products" aria-label="Recommended labels">
          {products.map((product) => (
            <li key={product.href}>
              <ProductTile product={product} showName={!family} />
            </li>
          ))}
        </ul>
      </div>
    )
  }
  if (products.length === 1) {
    return (
      <ul className="tagi-products is-single" aria-label="Recommended labels">
        <li>
          <ProductPreview product={products[0]} />
        </li>
      </ul>
    )
  }
  if (!store) return null
  return (
    <a className="tagi-shop" href={store.href} target="_blank" rel="noreferrer">
      <span>
        <span className="tagi-shop-kicker">Shop</span>
        <span className="tagi-shop-title">{store.title}</span>
      </span>
      <ArrowRight size={16} weight="bold" aria-hidden />
    </a>
  )
}

function ProductTile({ product, showName }: { product: StoreLabel; showName: boolean }) {
  return (
    <a className="tagi-tile" href={product.href} target="_blank" rel="noreferrer">
      {product.image ? <img src={product.image} alt="" /> : <span className="tagi-tile-fallback" />}
      <span className="tagi-tile-code">{product.title}</span>
      {product.detail ? <span className="tagi-tile-size">{product.detail}</span> : null}
      {showName && product.name ? <span className="tagi-tile-name">{product.name}</span> : null}
    </a>
  )
}

function ProductPreview({ product }: { product: StoreLabel }) {
  return (
    <a className="tagi-product" href={product.href} target="_blank" rel="noreferrer">
      {product.image ? <img src={product.image} alt="" /> : null}
      <span className="tagi-product-copy">
        <span className="tagi-product-code">{product.title}</span>
        {product.detail ? <span className="tagi-product-detail">{product.detail}</span> : null}
        {product.name ? <span className="tagi-product-name">{product.name}</span> : null}
      </span>
      <ArrowRight size={16} weight="bold" aria-hidden />
    </a>
  )
}

function Answer({ text }: { text: string }) {
  const blocks = withoutShopLine(text).trim().split(/\n\n+/)
  return (
    <div className="tagi-answer">
      {blocks.map((block) => {
        const lines = block.split('\n').filter((line) => line.length > 0)
        const bulletStart = lines.findIndex((line) => line.startsWith('• '))
        const bullets =
          bulletStart >= 0 && lines.slice(bulletStart).every((line) => line.startsWith('• '))
            ? lines.slice(bulletStart)
            : null
        if (!bullets) {
          return (
            <p key={block}>
              <LinkedText text={block} />
            </p>
          )
        }
        return (
          <Fragment key={block}>
            {lines.slice(0, bulletStart).map((line) => (
              <p key={line}>
                <LinkedText text={line} />
              </p>
            ))}
            <ul>
              {bullets.map((line, index) => (
                <li key={`${line}-${index}`}>
                  <LinkedText text={line.slice(2)} />
                </li>
              ))}
            </ul>
          </Fragment>
        )
      })}
    </div>
  )
}

type BrowserModel = {
  availability: () => Promise<string>
  create: (options: { initialPrompts: { role: string; content: string }[] }) => Promise<{
    prompt: (input: string) => Promise<string>
    destroy?: () => void
  }>
}

async function browserAnswer(question: string, sources: TagiSource[]) {
  const model = (globalThis as { LanguageModel?: BrowserModel }).LanguageModel
  if (!model || sources.length === 0) return ''
  const available = await model.availability()
  if (available === 'unavailable') return ''
  const session = await model.create({
    initialPrompts: [{ role: 'system', content: TAGI_SYSTEM_PROMPT }],
  })
  try {
    const text = await session.prompt(`Knowledge base:\n${tagiContext(sources)}\n\nQuestion: ${question}`)
    return text.trim()
  } finally {
    session.destroy?.()
  }
}

async function askTagi(question: string, history: { role: 'user' | 'assistant'; text: string }[]): Promise<TagiAnswer> {
  const local = composeTagiAnswer(question)
  let result = local
  try {
    const response = await fetch('/api/tagi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ question, history: history.slice(-6) }),
    })
    if (response.ok) {
      const data = (await response.json()) as TagiAnswer
      if (data?.answer) {
        result = {
          answer: data.answer,
          sources: data.sources?.length ? data.sources : local.sources,
          engine: data.engine === 'llm' ? 'llm' : 'knowledge-base',
          store: data.store ?? local.store,
        }
      }
    }
  } catch {
    result = local
  }

  if (result.engine !== 'llm' && result.sources.length > 0) {
    try {
      const generated = await browserAnswer(question, result.sources)
      if (generated) return { ...result, answer: generated, engine: 'llm' }
    } catch {
      return result
    }
  }
  return result
}

let tagiSeed = ''

export function TagiPage() {
  const [params, setParams] = useSearchParams()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [draft, setDraft] = useState('')
  const [pending, setPending] = useState(false)
  const [opened, setOpened] = useState<{ id: string; during: string } | null>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const pageRef = useRef<HTMLElement>(null)
  const latestRef = useRef<HTMLLIElement>(null)
  const earlierRef = useRef<HTMLLIElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const busy = useRef(false)
  const historyRef = useRef(messages)
  historyRef.current = messages

  useEffect(() => {
    const previous = document.title
    document.title = 'Ask Tagi | LabTAG'
    return () => {
      document.title = previous
    }
  }, [])

  useEffect(() => {
    const thread = threadRef.current
    const latest = latestRef.current
    if (!thread || !latest) return
    window.scrollTo({ top: 0, behavior: 'auto' })
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const behavior = reduce ? 'auto' : 'smooth'
    const latestTop = latest.getBoundingClientRect().top - thread.getBoundingClientRect().top + thread.scrollTop
    const fits = latest.offsetHeight <= thread.clientHeight - 16
    thread.scrollTo({ top: fits ? thread.scrollHeight : latestTop, behavior })
  }, [messages, pending])

  useEffect(() => {
    const page = pageRef.current
    if (!page) return
    const fit = () => {
      const top = page.getBoundingClientRect().top + window.scrollY
      if (top > 0) page.style.setProperty('--tagi-top', `${Math.round(top)}px`)
    }
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  useEffect(() => {
    const field = inputRef.current
    if (!field) return
    field.style.height = 'auto'
    field.style.height = `${Math.min(field.scrollHeight, 112)}px`
  }, [draft])

  async function submit(raw: string) {
    const question = raw.trim()
    if (!question || busy.current) return
    busy.current = true
    const prior = historyRef.current.map((item) => ({ role: item.role, text: item.text }))
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text: question }])
    setDraft('')
    setPending(true)
    try {
      const result = await askTagi(question, prior)
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: result.answer,
          sources: result.sources,
          store: result.store,
        },
      ])
    } catch {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: 'Tagi could not answer just now. Try again, or contact support.',
        },
      ])
    } finally {
      busy.current = false
      setPending(false)
      inputRef.current?.focus({ preventScroll: true })
    }
  }

  const seed = params.get('q')?.trim() ?? ''

  useEffect(() => {
    if (!seed || tagiSeed === seed) return
    tagiSeed = seed
    setParams({}, { replace: true })
    void submit(seed)
  }, [seed, setParams])

  const exchanges: { question: ChatMessage; answer?: ChatMessage }[] = []
  for (let index = 0; index < messages.length; index += 1) {
    const item = messages[index]
    if (item.role !== 'user') continue
    const next = messages[index + 1]
    const answer = next?.role === 'assistant' ? next : undefined
    exchanges.push({ question: item, answer })
    if (answer) index += 1
  }

  const chatting = messages.length > 0
  const latestId = exchanges.at(-1)?.question.id
  const openEarlier = opened && opened.during === latestId ? opened.id : null

  useEffect(() => {
    const node = earlierRef.current
    const stage = threadRef.current
    if (!openEarlier || !node || !stage) return
    const top = node.getBoundingClientRect().top - stage.getBoundingClientRect().top + stage.scrollTop
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    stage.scrollTo({ top: Math.max(0, top - 8), behavior: reduce ? 'auto' : 'smooth' })
  }, [openEarlier])
  const latestAnswered = [...exchanges].reverse().find((exchange) => exchange.answer)
  const suggestions =
    latestAnswered && !pending && !draft.trim()
      ? relatedQuestions(
          latestAnswered.question.text,
          exchanges.map((exchange) => exchange.question.text),
        )
      : []

  return (
    <article className={chatting ? 'tagi-page is-chatting' : 'tagi-page'} ref={pageRef}>
      {chatting ? <h1 className="sr-only">Ask Tagi</h1> : null}
      <div className="tagi-stage" ref={threadRef}>
      {chatting ? (
        <ol className="tagi-thread" aria-live="polite">
          {exchanges.map(({ question, answer }, index) => {
            const latest = index === exchanges.length - 1
            const open = latest || openEarlier === question.id
            return (
            <li
              key={question.id}
              className={open ? 'tagi-exchange' : 'tagi-exchange is-collapsed'}
              ref={latest ? latestRef : openEarlier === question.id ? earlierRef : undefined}
            >
              {answer && !open ? (
                <button
                  type="button"
                  className="tagi-asked is-earlier"
                  onClick={() => latestId && setOpened({ id: question.id, during: latestId })}
                >
                  <span>{question.text}</span>
                  <span className="tagi-earlier-meta">{answerRecap(answer.text)}</span>
                </button>
              ) : (
                <>
                  <h2 className="tagi-asked">{question.text}</h2>
                  {answer ? (
                    <div className="tagi-reply">
                      <p className="tagi-who">
                        <Sparkle size={14} weight="fill" aria-hidden />
                        Tagi
                        {latest ? null : (
                          <button type="button" onClick={() => setOpened(null)}>
                            Hide
                          </button>
                        )}
                      </p>
                      <Answer text={answer.text} />
                      <StoreActions text={answer.text} store={answer.store} />
                      {answer.sources && answer.sources.length > 0 ? (
                        <ul className="tagi-sources">
                          {answer.sources.map((source) => (
                            <li key={source.id}>
                              <Link to={source.href}>
                                <span>{source.category}</span>
                                {source.question}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : answer.store ? null : (
                        <Link className="tagi-solution" to={CONTACT_PATH}>
                          Contact support
                        </Link>
                      )}
                    </div>
                  ) : (
                    <div className="tagi-reply">
                      <p className="tagi-who">
                        <Sparkle size={14} weight="fill" aria-hidden />
                        Tagi
                      </p>
                      <p className="tagi-pending" role="status">
                        <span className="tagi-loader" aria-hidden />
                        Searching the knowledge base
                      </p>
                    </div>
                  )}
                </>
              )}
            </li>
            )
          })}
        </ol>
      ) : (
        <div className="tagi-welcome">
          <p className="tagi-kicker">Ask Tagi</p>
          <h1>How can we help you?</h1>
          <p>Ask about a container, size, temperature, or feature. Tagi recommends a label from the LabTAG catalog.</p>
          <section className="tagi-prompts" aria-label="Example questions">
            {PROMPTS.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void submit(prompt)}>
                <Sparkle size={16} weight="fill" aria-hidden />
                {prompt}
              </button>
            ))}
          </section>
        </div>
      )}
      </div>

      <div className="tagi-dock">
        {suggestions.length > 0 ? (
          <div className="tagi-suggest" aria-label="Related questions">
            {suggestions.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void submit(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        ) : null}
        <form
          className="tagi-composer"
          onSubmit={(event) => {
            event.preventDefault()
            void submit(draft)
          }}
        >
          <label className="sr-only" htmlFor="tagi-question">
            Ask Tagi
          </label>
          <textarea
            id="tagi-question"
            ref={inputRef}
            rows={1}
            value={draft}
            placeholder="Container, size, temperature, or feature"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void submit(draft)
              }
            }}
          />
          <button type="submit" aria-label="Ask" disabled={pending || !draft.trim()}>
            <ArrowRight size={18} weight="bold" aria-hidden />
          </button>
        </form>
        <p className="tagi-note">
          {chatting ? (
            <>
              <button
                type="button"
                className="tagi-clear"
                onClick={() => {
                  setMessages([])
                  setDraft('')
                  setOpened(null)
                  inputRef.current?.focus({ preventScroll: true })
                }}
              >
                Clear chat
              </button>
              {' · '}
              Check the product page before you order.{' '}
              <a href={LABTAG_PRIVACY_URL} target="_blank" rel="noreferrer">
                Privacy policy
              </a>
              {' · '}
              <a href={LABTAG_TERMS_URL} target="_blank" rel="noreferrer">
                Terms of use
              </a>
            </>
          ) : (
            <>
              Answers come from the knowledge base. Check the product page before you order. By using Ask Tagi, you agree
              to the{' '}
              <a href={LABTAG_PRIVACY_URL} target="_blank" rel="noreferrer">
                privacy policy
              </a>{' '}
              and{' '}
              <a href={LABTAG_TERMS_URL} target="_blank" rel="noreferrer">
                terms of use
              </a>
              .
            </>
          )}
        </p>
      </div>
    </article>
  )
}
