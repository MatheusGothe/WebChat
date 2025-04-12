import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}', // Caso use o diretório `app` (Next.js App Router)
  ],
  theme: {
    extend: {
      height: {
        header: 'var(--header-height)',
        app: 'var(--app-height)',
      }
    },
  },
  plugins: [],
}

export default config
