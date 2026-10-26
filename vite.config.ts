import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function databasePlugin(): Plugin {
  const dbDir = path.resolve(__dirname, 'database')
  const getFile = (file: string) => path.join(dbDir, file)

  const readJson = (file: string, def: any = []) => {
    try {
      const p = getFile(file)
      if (!fs.existsSync(p)) return def
      return JSON.parse(fs.readFileSync(p, 'utf-8'))
    } catch {
      return def
    }
  }

  const writeJson = (file: string, data: any) => {
    try {
      const p = getFile(file)
      if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })
      fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf-8')
      return true
    } catch (e) {
      console.error('[C-DART DB Plugin] Write error:', e)
      return false
    }
  }

  return {
    name: 'vite-database-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0] || ''

        const sendJson = (status: number, data: any) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        }

        const readBody = (callback: (body: any) => void) => {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              callback(body ? JSON.parse(body) : {})
            } catch {
              callback({})
            }
          })
        }

        // Cases API: GET /api/cases, POST /api/cases
        if (url === '/api/cases') {
          if (req.method === 'GET') {
            return sendJson(200, readJson('cases.json'))
          }
          if (req.method === 'POST') {
            return readBody(caseData => {
              const cases = readJson('cases.json')
              const existingIdx = cases.findIndex(
                (c: any) => c.id === caseData.id || c.caseId === caseData.caseId
              )
              const now = new Date().toISOString()
              const updated = {
                ...caseData,
                createdAt: caseData.createdAt || now,
                updatedAt: now,
              }
              if (existingIdx >= 0) {
                cases[existingIdx] = updated
              } else {
                cases.unshift(updated)
              }
              writeJson('cases.json', cases)
              return sendJson(200, updated)
            })
          }
        }

        // Notes API: GET /api/notes, POST /api/notes
        if (url === '/api/notes') {
          if (req.method === 'GET') {
            return sendJson(200, readJson('notes.json'))
          }
          if (req.method === 'POST') {
            return readBody(noteData => {
              const notes = readJson('notes.json')
              notes.unshift(noteData)
              writeJson('notes.json', notes)
              return sendJson(200, noteData)
            })
          }
        }

        // Audit Log API: GET /api/audit, POST /api/audit
        if (url === '/api/audit') {
          if (req.method === 'GET') {
            return sendJson(200, readJson('audit_log.json'))
          }
          if (req.method === 'POST') {
            return readBody(entry => {
              const logs = readJson('audit_log.json')
              logs.unshift(entry)
              writeJson('audit_log.json', logs)
              return sendJson(200, entry)
            })
          }
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    databasePlugin(),
  ],
})
