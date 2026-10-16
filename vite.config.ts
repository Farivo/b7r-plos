import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  return {
  plugins: [react()],
  define: {
    'import.meta.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN': JSON.stringify(env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || env.SHOPIFY_STORE_DOMAIN),
    'import.meta.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN': JSON.stringify(env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || env.SHOPIFY_STOREFRONT_ACCESS_TOKEN),
  },
    server: {
      allowedHosts: true,
    },
  }
})
