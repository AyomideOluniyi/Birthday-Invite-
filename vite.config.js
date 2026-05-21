import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const sheetUrl = env.VITE_SHEET_URL || ''

  let proxy = {}
  if (sheetUrl) {
    try {
      const parsed = new URL(sheetUrl)
      proxy['/api/guests'] = {
        target: parsed.origin,
        changeOrigin: true,
        rewrite: () => `${parsed.pathname}?action=read`,
      }
    } catch {}
  }

  return {
    plugins: [react()],
    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
    },
    server: { proxy },
  }
})
