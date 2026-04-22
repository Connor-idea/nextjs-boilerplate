import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function leadEnrichmentMockPlugin() {
  return {
    name: 'lead-enrichment-mock-plugin',
    configureServer(server) {
      server.middlewares.use('/api/leads/enrich', (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk.toString()
        })

        req.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {}
            const requestId = parsed?.requestId || `req-${Date.now()}`
            const records = Array.isArray(parsed?.records) ? parsed.records : []

            const enriched = records.map((record, index) => {
              const companyName = String(record.companyName || '').trim()
              const normalizedCompany = companyName
                .replace(/\s+/g, '')
                .replace(/[（(].*?[）)]/g, '')
                .replace(/有限公司|集团|科技|股份/g, '')
              const domain = normalizedCompany ? normalizedCompany.toLowerCase() : `company${record.id}`
              const confidence = 75 + ((index * 7) % 20)

              return {
                id: record.id,
                name: record.name || '',
                companyName: record.companyName || '',
                position: record.position || '待确认',
                phone: record.phone || `13${String(100000000 + Number(record.id || index + 1)).slice(-9)}`,
                email: record.email || `lead${record.id || index + 1}@example.com`,
                industry: record.industry || '企业服务',
                companyId: `CMP-${String(record.id || index + 1).padStart(6, '0')}`,
                website: `https://www.${domain}.com`,
                crawlTraceId: `TRACE-${Date.now()}-${record.id || index + 1}`,
                source: '爬虫服务(mock)',
                confidence
              }
            })

            const response = {
              requestId,
              schemaVersion: '2026-04-16',
              records: enriched
            }

            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify(response))
          } catch (error) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json; charset=utf-8')
            res.end(JSON.stringify({
              message: 'invalid request payload',
              detail: error?.message || 'unknown error'
            }))
          }
        })
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), leadEnrichmentMockPlugin()],
  server: {
    port: 3000,
    open: true,
    host: '127.0.0.1'
  },
  build: {
    chunkSizeWarningLimit: 1000
  }
})
