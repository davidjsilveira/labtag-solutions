import { findStoreLabel, shopLine } from './storeLabel.js'
import { composeTagiAnswer, TAGI_SYSTEM_PROMPT, tagiContext, type TagiAnswer, type TagiTurn } from './tagi.js'

export type { TagiTurn }

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }

function envValue(name: string) {
  const runtime = globalThis as { process?: { env?: Record<string, string | undefined> } }
  return runtime.process?.env?.[name]
}

async function complete(messages: ChatMessage[]) {
  const ollama = envValue('TAGI_OLLAMA_URL')?.replace(/\/$/, '')
  const key = envValue('TAGI_API_KEY') || envValue('OPENAI_API_KEY')
  const model = envValue('TAGI_MODEL') || (ollama ? 'llama3.2' : 'gpt-4o-mini')

  if (ollama) {
    const response = await fetch(`${ollama}/v1/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ model, messages, temperature: 0.2 }),
    })
    if (!response.ok) throw new Error(`Ollama ${response.status}`)
    const data = (await response.json()) as { choices?: { message?: { content?: string } }[] }
    return data.choices?.[0]?.message?.content?.trim() || ''
  }

  if (!key) return ''

  const base = (envValue('TAGI_API_BASE') || 'https://api.openai.com/v1').replace(/\/$/, '')
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({ model, messages, temperature: 0.2 }),
  })
  if (!response.ok) throw new Error(`Tagi model ${response.status}`)
  const data = (await response.json()) as { choices?: { message?: { content?: string } }[] }
  return data.choices?.[0]?.message?.content?.trim() || ''
}

export async function answerTagi(question: string, history: TagiTurn[]): Promise<TagiAnswer> {
  const composed = composeTagiAnswer(question)
  if (composed.sources.length === 0) return composed

  const messages: ChatMessage[] = [
    { role: 'system', content: TAGI_SYSTEM_PROMPT },
    ...history.slice(-6).map((turn) => ({ role: turn.role, content: turn.text })),
    {
      role: 'user',
      content: `Knowledge base:\n${tagiContext(composed.sources)}\n\nQuestion: ${question}`,
    },
  ]

  try {
    const answer = await complete(messages)
    if (!answer) return composed
    const store = composed.store ?? findStoreLabel(question, composed.answer)
    const line = store ? shopLine(store) : ''
    const text = store && !answer.includes(store.href) ? `${answer}\n\n${line}` : answer
    return { ...composed, answer: text, store, engine: 'llm' }
  } catch {
    return composed
  }
}
