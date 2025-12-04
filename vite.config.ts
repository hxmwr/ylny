import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({command}) => {
  return {
    base: command == 'build' ? '/resource/App_a2c6295cf317ebf4c472e38cbe9e9b64/app/': '/',
    plugins: [react()],
    server: {
      proxy: {
        '/supide-app': {
          target: 'https://ylos.yulongpc.com.cn',
          changeOrigin: true,
          secure: false,
        },
        '/open-api': {
          target: 'https://ylos.yulongpc.com.cn',
          changeOrigin: true,
          secure: false,
        },
        '/inter-api': {
          target: 'https://ylos.yulongpc.com.cn',
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
