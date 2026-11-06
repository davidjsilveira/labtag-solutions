import { answerTagi, type TagiTurn } from '../src/content/tagiServer'

const MAX_BODY = 32_000

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    },
  })
}

async function readBody(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) return ''
  const chunks: Uint8Array[] = []
  let size = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    size += value.byteLength
    if (size > MAX_BODY) {
      await reader.cancel()
      throw new Error('too large')
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(size)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.byteLength
  }
  return new TextDecoder().decode(bytes)
}

async function ask(request: Request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'POST, OPTIONS',
        'access-control-allow-headers': 'content-type',
      },
    })
  }
  if (request.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  let raw = ''
  try {
    raw = await readBody(request)
  } catch {
    return json({ error: 'Tagi request is too large' }, 413)
  }

  let body: { question?: string; history?: TagiTurn[] }
  try {
    body = JSON.parse(raw || '{}') as { question?: string; history?: TagiTurn[] }
  } catch {
    return json({ error: 'Question required' }, 400)
  }

  const question = body.question?.trim() ?? ''
  if (!question) return json({ error: 'Question required' }, 400)

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (turn): turn is TagiTurn =>
            !!turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.text === 'string',
        )
        .slice(-6)
    : []

  try {
    return json(await answerTagi(question, history))
  } catch (error) {
    console.error(
      JSON.stringify({
        message: 'tagi failed',
        error: error instanceof Error ? error.message : 'unknown',
      }),
    )
    return json({ error: 'Tagi could not answer' }, 500)
  }
}

export default {
  async fetch(request): Promise<Response> {
    const url = new URL(request.url)
    if (url.pathname === '/api/tagi') return ask(request)
    return json({ error: 'Not found' }, 404)
  },
} satisfies ExportedHandler
