import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_BASE_URL': JSON.stringify(env.BASE_URL),
    },
    server: {
      port: 5174,
      proxy: {
        '/api': {
          target: env.BASE_URL,
          changeOrigin: true,
          secure: false,
        },
        '/admin': {
          target: env.BASE_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
