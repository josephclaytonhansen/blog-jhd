const colors = require('tailwindcss/colors')

module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'], 
    safelist: [
      'bg-accent-100',
      'bg-accent-200',
      'bg-accent-300',
      'bg-accent-400',
      'bg-accent-500',
      'bg-accent-600',
      'bg-accent-700',
      'bg-accent-800',
      'bg-accent-900',
      'text-accent-100',
      'text-accent-200',
      'text-accent-300',
      'text-accent-400',
      'text-accent-500',
      'text-accent-600',
      'text-accent-700',
      'text-accent-800',
      'text-accent-900',
    ],
    theme: {
      extend: {
        colors: {
          'accent': colors[process.env.ACCENT_COLOR] || colors.cyan,
          'backdrop': colors[process.env.BACKDROP_COLOR] || colors.slate,
        },
        fontFamily: {
          'sans': [process.env.FONT_FAMILY || 'sans-serif'],
          'Fira Sans': ['Fira Sans', 'sans-serif'],
          'Lora': ['Lora', 'serif'],
          'Slabo': ['Slabo 13px', 'sans-serif'],
          'MerriweatherSans': ['Merriweather Sans', 'sans-serif'],
          'Cairo': ['Cairo', 'sans-serif'],
          'Martel': ['Martel', 'serif'],
          'Titilium': ['Titilium Web', 'sans-serif'],
          'Anaheim': ['Anaheim', 'sans-serif'],
          'Maitree': ['Maitree', 'serif'],
          'Prompt': ['Prompt', 'sans-serif'],
        },
        borderRadius: process.env.ROUNDED === 'false' ? {
          'none': '0',
          'sm': '0',
          DEFAULT: '0',
          'md': '0',
          'lg': '0',
          'full': '0',
        } : {},
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }