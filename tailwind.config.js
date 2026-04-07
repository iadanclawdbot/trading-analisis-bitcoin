/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        'btc-bg': '#020617',
        'btc-surface': '#0f172a',
        'btc-surface-2': '#1e293b',
        'btc-border': '#1e293b',
        'btc-border-2': '#334155',
        'btc-text': '#f8fafc',
        'btc-muted': '#94a3b8',
        'btc-orange': '#f97316',
        'btc-orange-dim': '#7c3f0a',
        'btc-green': '#22c55e',
        'btc-green-dim': '#14532d',
        'btc-red': '#ef4444',
        'btc-red-dim': '#7f1d1d',
        'btc-blue': '#3b82f6',
        'btc-blue-dim': '#1e3a5f',
        'btc-violet': '#8b5cf6',
        'btc-teal': '#14b8a6',
        'btc-amber': '#f59e0b',
        'btc-pink': '#ec4899',
        'btc-indigo': '#6366f1',
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px',
      },
      screens: {
        '2xl': '1400px',
      },
    },
  },
  plugins: [],
}
