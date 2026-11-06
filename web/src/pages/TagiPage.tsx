import { Fragment, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowRight, Sparkle } from '@phosphor-icons/react'
import { composeTagiAnswer, TAGI_SYSTEM_PROMPT, tagiContext, type TagiAnswer, type TagiSource } from '@/content/tagi'
import { CONTACT_PATH, LABTAG_PRIVACY_URL, LABTAG_TERMS_URL } from '@/content/labtagLinks'
import { storeProduct, withoutShopLine, type StoreLabel } from '@/content/storeLabel'

const PROMPTS = [
  'What CryoSTUCK label fits a 1.5 ml tube?',
  'What CryoSTUCK label fits a 1.0 ml Matrix tube?',
  'What CryoSTUCK labels fit 15 ml tubes?',
  'What are cryogenic labels?',
  'Which DYMO labels are cryogenic?',
  'What autoclave labels are available?',
]

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
    if (!product) return part
    return (
      <a key={`${part}-${index}`} href={product.href} target="_blank" rel="noreferrer">
        {part}
      </a>
    )
  })
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
  const threadRef = useRef<HTMLDivElement>(null)
  const latestRef = useRef<HTMLLIElement>(null)
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
    const top = latest.getBoundingClientRect().top - thread.getBoundingClientRect().top + thread.scrollTop
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: 'auto' })
    thread.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }, [messages, pending])

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

  return (
    <article className={chatting ? 'tagi-page is-chatting' : 'tagi-page'}>
      <header className="tagi-hero">
        <div className="tagi-hero-row">
          <div>
            <p className="tagi-kicker">Ask Tagi</p>
            <h1>How can we help you?</h1>
          </div>
          {chatting ? (
            <button
              type="button"
              className="tagi-clear"
              onClick={() => {
                setMessages([])
                setDraft('')
                inputRef.current?.focus()
              }}
            >
              Clear chat
            </button>
          ) : null}
        </div>
        {chatting ? null : (
          <p>Ask about a label, printer, template, or order. Tagi answers from the LabTAG knowledge base.</p>
        )}
      </header>

      <div className="tagi-stage" ref={threadRef}>
      {chatting ? (
        <ol className="tagi-thread" aria-live="polite">
          {exchanges.map(({ question, answer }, index) => (
            <li
              key={question.id}
              className="tagi-exchange"
              ref={index === exchanges.length - 1 ? latestRef : undefined}
            >
              <h2 className="tagi-asked">{question.text}</h2>
              {answer ? (
                <>
                  <Answer text={answer.text} />
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
                  ) : (
                    <Link className="tagi-solution" to={CONTACT_PATH}>
                      Contact support
                    </Link>
                  )}
                  {answer.store ? (
                    <a className="tagi-solution" href={answer.store.href} target="_blank" rel="noreferrer">
                      Shop {answer.store.title}
                    </a>
                  ) : null}
                </>
              ) : (
                <p className="tagi-pending">Reading the knowledge base…</p>
              )}
            </li>
          ))}
        </ol>
      ) : (
        <section className="tagi-prompts" aria-label="Example questions">
          {PROMPTS.map((prompt) => (
            <button key={prompt} type="button" onClick={() => void submit(prompt)}>
              <Sparkle size={16} weight="fill" aria-hidden />
              {prompt}
            </button>
          ))}
        </section>
      )}
      </div>

      <div className="tagi-dock">
        <p className="tagi-note">
          Answers come from the knowledge base. Check the product page before you order. By using Ask Tagi, you agree to
          the{' '}
          <a href={LABTAG_PRIVACY_URL} target="_blank" rel="noreferrer">
            privacy policy
          </a>{' '}
          and{' '}
          <a href={LABTAG_TERMS_URL} target="_blank" rel="noreferrer">
            terms of use
          </a>
          .
        </p>
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
            placeholder="Temperature, container, printer, or order"
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                void submit(draft)
              }
            }}
          />
          <button type="submit" disabled={pending || !draft.trim()}>
            Ask
            <ArrowRight size={16} weight="bold" aria-hidden />
          </button>
        </form>
      </div>
    </article>
  )
}
