import react from '@vitejs/plugin-react'
import type { IncomingMessage } from 'node:http'
import path from 'node:path'
import { defineConfig, type Connect, type Plugin } from 'vite'
import { answerTagi, type TagiTurn } from './src/content/tagiServer.ts'

const root = import.meta.dirname

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    let size = 0
    req.on('data', (chunk: Buffer) => {
      size += chunk.length
      if (size > 32_000) {
        reject(new Error('Tagi request is too large'))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function tagiApi(): Plugin {
  const handle: Connect.NextHandleFunction = async (req, res, next) => {
    const url = req.url?.split('?')[0]
    if (url !== '/api/tagi') return next()
    if (req.method !== 'POST') {
      res.statusCode = 405
      res.end('Method not allowed')
      return
    }
    try {
      const raw = await readBody(req)
      const body = JSON.parse(raw || '{}') as { question?: string; history?: TagiTurn[] }
      const question = body.question?.trim() ?? ''
      if (!question) {
        res.statusCode = 400
        res.setHeader('content-type', 'application/json')
        res.end(JSON.stringify({ error: 'Question required' }))
        return
      }
      const history = Array.isArray(body.history)
        ? body.history.filter(
            (turn): turn is TagiTurn =>
              !!turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.text === 'string',
          )
        : []
      const result = await answerTagi(question, history.slice(-6))
      res.statusCode = 200
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify(result))
    } catch {
      res.statusCode = 500
      res.setHeader('content-type', 'application/json')
      res.end(JSON.stringify({ error: 'Tagi could not answer' }))
    }
  }

  const attach = (middlewares: Connect.Server) => {
    middlewares.use(handle)
  }

  return {
    name: 'tagi-api',
    configureServer(server) {
      attach(server.middlewares)
    },
    configurePreviewServer(server) {
      attach(server.middlewares)
    },
  }
}

export default defineConfig({
  base: '/',
  plugins: [react(), tagiApi()],
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
      '@pages': path.resolve(root, '../pages'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(root, '..')],
    },
  },
})
