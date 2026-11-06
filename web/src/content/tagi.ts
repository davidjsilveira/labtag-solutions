import { HELP_ARTICLES } from './helpArticles.js'
import { HELP_PATH } from './labtagLinks.js'

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
}

function tokens(text: string) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9+.-]+/)
    .filter((token) => token.length > 2 && !STOP.has(token))
}

export function retrieveTagi(question: string, limit = 4): TagiSource[] {
  const queryTokens = [...new Set(tokens(question))]
  if (queryTokens.length === 0) return []
  const phrase = question.trim().toLowerCase()

  return HELP_ARTICLES.map((article) => {
    const questionTokens = tokens(article.question)
    const answerTokens = new Set(tokens(article.answer))
    let score = 0
    for (const token of queryTokens) {
      if (questionTokens.includes(token)) score += 4
      if (answerTokens.has(token)) score += 1
    }
    if (phrase.length > 8 && article.question.toLowerCase().includes(phrase)) score += 8
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
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
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
      if (intro && !focused.includes(intro) && intro.length < 180) return [intro, ...focused]
      return focused
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
    return [intro, ...matched]
  }
  return matched
}

export function composeTagiAnswer(question: string): TagiAnswer {
  const sources = retrieveTagi(question)
  if (sources.length === 0) {
    return {
      answer:
        'I could not find that in the LabTAG knowledge base. Contact support with the printer model, container, or order number.',
      sources: [],
      engine: 'knowledge-base',
    }
  }

  const queryTokens = [...new Set(tokens(question))]
  const top = sources[0]
  const parts = relevantParagraphs(top.answer, queryTokens, top.question)
  const second = sources[1]
  const includeSecond = second && second.score >= top.score * 0.75 && second.score >= 4
  const body = [parts.join('\n\n')]
  if (includeSecond) {
    body.push(`${second.question}\n\n${relevantParagraphs(second.answer, queryTokens, second.question).join('\n\n')}`)
  }

  return {
    answer: body.join('\n\n'),
    sources: includeSecond ? sources.slice(0, 2) : sources.slice(0, 1),
    engine: 'knowledge-base',
  }
}

export function tagiContext(sources: TagiSource[]) {
  return sources
    .map((source) => `[${source.category}] ${source.question}\n${source.answer}`)
    .join('\n\n')
}

export const TAGI_SYSTEM_PROMPT = `You are Tagi, the LabTAG support assistant. Answer only from the knowledge base excerpts in the user message. Use sentence case. Be direct and concise. If the excerpts do not contain the answer, say you do not have it in the knowledge base and tell the person to contact support. Do not invent temperatures, SKUs, policies, prices, or steps. Do not mention that you were given excerpts.`
