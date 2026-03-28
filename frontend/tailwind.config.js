import tailwindcssAnimate from 'tailwindcss-animate'

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0d0d0d',
        surface: '#141414',
        'surface-elevated': '#1a1a1a',
        border: '#2a2a2a',
        'text-primary': '#e8e8e8',
        'text-secondary': '#9ca3af',
        accent: '#00D2BE',
        silver: '#C0C0C0',
        'silver-dim': 'rgba(192, 192, 192, 0.45)',
        'pit-now': '#FF1801',
        'next-lap': '#FFF200',
        monitor: '#00D2BE',
        unclear: '#6B7280',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
