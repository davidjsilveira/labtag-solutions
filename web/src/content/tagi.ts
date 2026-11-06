import { HELP_ARTICLES } from './helpArticles.js'
import { HELP_PATH } from './labtagLinks.js'
import {
  asksForContainer,
  directFitAnswer,
  findStoreLabel,
  focusContainer,
  shopLine,
  type StoreLabel,
} from './storeLabel.js'

const STOP = new Set([
  'the',
  'and',
  'for',
  'with',
  'that',
  'this',
  'from',
  'are',
  'you',
  'your',
  'how',
  'what',
  'can',
  'does',
  'not',
  'have',
  'when',
  'where',
  'why',
  'who',
])

export type TagiSource = {
  id: string
  question: string
  category: string
  href: string
  score: number
  answer: string
}

export type TagiTurn = {
  role: 'user' | 'assistant'
  text: string
}

export type TagiAnswer = {
  answer: string
  sources: TagiSource[]
  engine: 'llm' | 'knowledge-base'
  store?: StoreLabel
}

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+.-]+/)
    .filter((token) => token.length > 2 && !STOP.has(token))
}

function sameToken(queryToken: string, articleToken: string) {
  if (articleToken === queryToken) return true
  if (queryToken.length >= 4 && (articleToken === `${queryToken}s` || queryToken === `${articleToken}s`)) {
    return true
  }
  return (
    queryToken.length >= 4 &&
    articleToken.startsWith(queryToken) &&
    articleToken.length >= queryToken.length + 3
  )
}

function shoppingAdjust(question: string, id: string, score: number) {
  const q = question.toLowerCase()
  const cold = /(?:−|-)\s*80\b|(?:−|-)\s*196\b|liquid nitrogen|dry ice|\bfreezer\b/.test(q)
  const steril = /autoclave|steril/.test(q)
  if (cold && !steril) {
    if (id === 'cryogenic-labels') score += 4
    if (id === 'autoclave-labels' || id === 'apply-cryostuck' || id === 'core-size') score -= 4
  }
  if (/xylene|chemical/.test(q) && !steril) {
    if (id === 'direct-thermal-chemicals') score += 4
    if (id === 'autoclave-labels') score -= 4
  }
  return score
}

export function retrieveTagi(question: string, limit = 4): TagiSource[] {
  const queryTokens = [...new Set(tokens(question))]
  if (queryTokens.length === 0) return []
  const phrase = question.trim().toLowerCase()

  return HELP_ARTICLES.map((article) => {
    const questionTokens = tokens(article.question)
    const answerTokens = tokens(article.answer)
    let score = 0
    for (const token of queryTokens) {
      if (questionTokens.some((articleToken) => sameToken(token, articleToken))) score += 4
      if (answerTokens.some((articleToken) => sameToken(token, articleToken))) score += 1
    }
    if (phrase.length > 8 && article.question.toLowerCase().includes(phrase)) score += 8
    score = shoppingAdjust(question, article.id, score)
    return {
      id: article.id,
      question: article.question,
      category: article.category,
      href: `${HELP_PATH}#${article.id}`,
      score,
      answer: article.answer,
    }
  })
    .filter((article) => article.score >= 3)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      const overview = (item: TagiSource) => (item.question.toLowerCase().startsWith('what ') ? 1 : 0)
      return overview(b) - overview(a)
    })
    .slice(0, limit)
}

function continues(paragraphs: string[], chosen: string[]) {
  if (chosen.length !== 1) return chosen
  const next = paragraphs[paragraphs.indexOf(chosen[0]) + 1]
  if (!next || next.startsWith('•') || next.includes('• ') || /contact support/i.test(next)) return chosen
  return [...chosen, next]
}

function relevantParagraphs(answer: string, queryTokens: string[], question: string) {
  const paragraphs = answer.split(/\n\n+/).map((part) => part.trim()).filter(Boolean)
  const questionTokens = tokens(question)
  const extra = queryTokens.filter((token) => !questionTokens.includes(token))
  if (extra.length > 0) {
    const focused = paragraphs.filter((paragraph) =>
      extra.some((token) => paragraph.toLowerCase().includes(token)),
    )
    if (focused.length > 0) {
      const intro = paragraphs[0]
      if (intro && !focused.includes(intro) && intro.length < 180) return continues(paragraphs, [intro, ...focused])
      return continues(paragraphs, focused)
    }
  }
  const overlap = questionTokens.filter((token) => queryTokens.includes(token)).length
  const askedTheArticle = overlap >= Math.min(3, Math.max(questionTokens.length, 1))
  if (askedTheArticle || queryTokens.length === 0) return paragraphs

  const matched = paragraphs.filter((paragraph) =>
    queryTokens.some((token) => paragraph.toLowerCase().includes(token)),
  )
  if (matched.length === 0) return paragraphs
  const intro = paragraphs[0]
  if (intro && !matched.includes(intro) && intro.length < 180 && !intro.startsWith('•')) {
    return continues(paragraphs, [intro, ...matched])
  }
  return continues(paragraphs, matched)
}

function withStore(question: string, answer: TagiAnswer, basis = answer.answer): TagiAnswer {
  const store = answer.store ?? findStoreLabel(question, basis)
  if (!store) return answer
  const line = shopLine(store)
  const text = answer.answer.includes(store.href) ? answer.answer : `${answer.answer}\n\n${line}`
  return { ...answer, answer: text, store }
}

export function composeTagiAnswer(question: string): TagiAnswer {
  const sources = retrieveTagi(question)
  if (sources.length === 0) {
    const store = findStoreLabel(question)
    if (store) {
      return withStore(question, {
        answer: `${store.title} is in the LabTAG store.`,
        sources: [],
        engine: 'knowledge-base',
        store,
      })
    }
    return {
      answer:
        'I could not find that in the LabTAG knowledge base. Contact support with the printer model, container, or order number.',
      sources: [],
      engine: 'knowledge-base',
    }
  }

  const queryTokens = [...new Set(tokens(question))]
  const cryo = sources.find((source) => source.id === 'cryostuck-sizing')
  const table = sources.find((source) => source.id === 'label-size-table')
  const sized = asksForContainer(question)
    ? cryo && directFitAnswer(question, cryo.answer)
      ? cryo
      : table
    : undefined
  const ranked = sized ? [sized] : sources
  const top = ranked[0]
  const parts = relevantParagraphs(top.answer, queryTokens, top.question)
  const second = ranked[1]
  const includeSecond = second && second.score >= top.score * 0.75 && second.score >= 4
  const body = [parts.join('\n\n')]
  if (includeSecond) {
    body.push(`${second.question}\n\n${relevantParagraphs(second.answer, queryTokens, second.question).join('\n\n')}`)
  }

  const focused = focusContainer(body.join('\n\n'), question)
  return withStore(
    question,
    {
      answer: directFitAnswer(question, focused) ?? focused,
      sources: includeSecond ? ranked.slice(0, 2) : ranked.slice(0, 1),
      engine: 'knowledge-base',
    },
    focused,
  )
}

export function tagiContext(sources: TagiSource[]) {
  return sources
    .map((source) => `[${source.category}] ${source.question}\n${source.answer}`)
    .join('\n\n')
}

export const TAGI_SYSTEM_PROMPT = `You are Tagi, the LabTAG support assistant. Answer only from the knowledge base excerpts in the user message. Use sentence case. Be direct and concise. If the excerpts do not contain the answer, say you do not have it in the knowledge base and tell the person to contact support. Keep product codes that the excerpts name, such as L2FX-401. Do not invent temperatures, SKUs, policies, prices, or steps. Do not mention that you were given excerpts.`
