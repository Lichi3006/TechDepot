import basicSsl from '@vitejs/plugin-basic-ssl'

/** @type {import('vite').UserConfig} */
export default {
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  plugins: [
    basicSsl()
  ]
}
