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
      'bg-slate-500',
      'bg-gray-500',
      'bg-zinc-500',
      'bg-neutral-500',
      'bg-stone-500',
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-accent-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
      'bg-rose-500',
      'bg-slate-800',
      'bg-gray-800',
      'bg-zinc-800',
      'bg-neutral-800',
      'bg-stone-800',
      'bg-red-800',
      'bg-orange-800',
      'bg-amber-800',
      'bg-yellow-800',
      'bg-lime-800',
      'bg-green-800',
      'bg-emerald-800',
      'bg-teal-800',
      'bg-cyan-800',
      'bg-accent-800',
      'bg-blue-800',
      'bg-indigo-800',
      'bg-violet-800',
      'bg-purple-800',
      'bg-fuchsia-800',
      'bg-pink-800',
      'bg-rose-800',

      'bg-slate-700',
      'bg-gray-700',
      'bg-zinc-700',
      'bg-neutral-700',
      'bg-stone-700',
      'bg-red-700',
      'bg-orange-700',
      'bg-amber-700',
      'bg-yellow-700',
      'bg-lime-700',
      'bg-green-700',
      'bg-emerald-700',
      'bg-teal-700',
      'bg-cyan-700',
      'bg-accent-700',
      'bg-blue-700',
      'bg-indigo-700',
      'bg-violet-700',
      'bg-purple-700',
      'bg-fuchsia-700',
      'bg-pink-700',
      'bg-rose-700',

      'bg-gray-300',
      'bg-zinc-300',
      'bg-neutral-300',
      'bg-stone-300',
      'bg-red-300',
      'bg-orange-300',
      'bg-amber-300',
      'bg-yellow-300',
      'bg-lime-300',
      'bg-green-300',
      'bg-emerald-300',
      'bg-teal-300',
      'bg-cyan-300',
      'bg-sky-300',
      'bg-accent-300',
      'bg-blue-300',
      'bg-indigo-300',
      'bg-violet-300',
      'bg-purple-300',
      'bg-fuchsia-300',
      'bg-pink-300',
      'bg-rose-300',

      'text-gray-300',
      'text-slate-300',
      'text-zinc-300',
      'text-neutral-300',
      'text-stone-300',
      'text-red-300',
      'text-orange-300',
      'text-amber-300',
      'text-yellow-300',
      'text-lime-300',
      'text-green-300',
      'text-emerald-300',
      'text-teal-300',
      'text-cyan-300',
      'text-accent-300',
      'text-blue-300',
      'text-indigo-300',
      'text-violet-300',
      'text-purple-300',
      'text-fuchsia-300',
      'text-pink-300',
      'text-rose-300',

      'text-gray-200',
      'text-slate-200',
      'text-zinc-200',
      'text-neutral-200',
      'text-stone-200',
      'text-red-200',
      'text-orange-200',
      'text-amber-200',
      'text-yellow-200',
      'text-lime-200',
      'text-green-200',
      'text-emerald-200',
      'text-teal-200',
      'text-cyan-200',
      'text-accent-200',
      'text-blue-200',
      'text-indigo-200',
      'text-violet-200',
      'text-purple-200',
      'text-fuchsia-200',
      'text-pink-200',
      'text-rose-200',

      'bg-backdrop-0',
      'bg-backdrop-1',
      'bg-backdrop-2',
      'bg-backdrop-3',
      'text-text-0',
      'text-text-1',
      'text-text-2',
      'text-text-3',

    ],
    theme: {
      extend: {
        colors: {
          'accent': colors[process.env.ACCENT_COLOR] || colors.cyan,
          'backdrop': colors[process.env.BACKDROP_COLOR] || colors.slate,
          'backdrop-0': process.env.THEME === 'dark' ? 'var(--backdrop-0)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-0)' : 'var(--ultra-light-backdrop-0)'),
          'backdrop-1': process.env.THEME === 'dark' ? 'var(--backdrop-1)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-1)' : 'var(--ultra-light-backdrop-1)'),
          'backdrop-2': process.env.THEME === 'dark' ? 'var(--backdrop-2)' : 'var(--light-backdrop-2)',
          'backdrop-3': process.env.THEME === 'dark' ? 'var(--backdrop-3)' : 'var(--light-backdrop-3)',
          'text-0': process.env.THEME === 'dark' ? 'var(--text-text-0)' : (process.env.THEME === 'light' ? 'var(--light-text-0)' : 'var(--ultra-light-text-0)'),
          'text-1': process.env.THEME === 'dark' ? 'var(--text-text-1)' : (process.env.THEME === 'light' ? 'var(--light-text-1)' : 'var(--ultra-light-text-1)'),
          'text-2': process.env.THEME === 'dark' ? 'var(--text-text-2)' : 'var(--light-text-2)',
          'text-3': process.env.THEME === 'dark' ? 'var(--text-text-3)' : 'var(--light-text-3)',
        },
        backgroundColor: {
          'backdrop-0': process.env.THEME === 'dark' ? 'var(--backdrop-0)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-0)' : 'var(--ultra-light-backdrop-0)'),
          'backdrop-1': process.env.THEME === 'dark' ? 'var(--backdrop-1)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-1)' : 'var(--ultra-light-backdrop-1)'),
          'backdrop-2': process.env.THEME === 'dark' ? 'var(--backdrop-2)' : 'var(--light-backdrop-2)',
          'backdrop-3': process.env.THEME === 'dark' ? 'var(--backdrop-3)' : 'var(--light-backdrop-3)',
        },
        textColor: {
          'text-0': process.env.THEME === 'dark' ? 'var(--text-text-0)' : (process.env.THEME === 'light' ? 'var(--light-text-0)' : 'var(--ultra-light-text-0)'),
          'text-1': process.env.THEME === 'dark' ? 'var(--text-text-1)' : (process.env.THEME === 'light' ? 'var(--light-text-1)' : 'var(--ultra-light-text-1)'),
          'text-2': process.env.THEME === 'dark' ? 'var(--text-text-2)' : 'var(--light-text-2)',
          'text-3': process.env.THEME === 'dark' ? 'var(--text-text-3)' : 'var(--light-text-3)',
        },
        borderColor: {
          'backdrop-0': process.env.THEME === 'dark' ? 'var(--backdrop-0)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-0)' : 'var(--ultra-light-backdrop-0)'),
          'backdrop-1': process.env.THEME === 'dark' ? 'var(--backdrop-1)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-1)' : 'var(--ultra-light-backdrop-1)'),
          'backdrop-2': process.env.THEME === 'dark' ? 'var(--backdrop-2)' : 'var(--light-backdrop-2)',
          'backdrop-3': process.env.THEME === 'dark' ? 'var(--backdrop-3)' : 'var(--light-backdrop-3)',
          'text-0': process.env.THEME === 'dark' ? 'var(--text-text-0)' : (process.env.THEME === 'light' ? 'var(--light-text-0)' : 'var(--ultra-light-text-0)'),
          'text-1': process.env.THEME === 'dark' ? 'var(--text-text-1)' : (process.env.THEME === 'light' ? 'var(--light-text-1)' : 'var(--ultra-light-text-1)'),
          'text-2': process.env.THEME === 'dark' ? 'var(--text-text-2)' : 'var(--light-text-2)',
          'text-3': process.env.THEME === 'dark' ? 'var(--text-text-3)' : 'var(--light-text-3)',
        },
        ringColor: {
          'backdrop-0': process.env.THEME === 'dark' ? 'var(--backdrop-0)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-0)' : 'var(--ultra-light-backdrop-0)'),
          'backdrop-1': process.env.THEME === 'dark' ? 'var(--backdrop-1)' : (process.env.THEME === 'light' ? 'var(--light-backdrop-1)' : 'var(--ultra-light-backdrop-1)'),
          'backdrop-2': process.env.THEME === 'dark' ? 'var(--backdrop-2)' : 'var(--light-backdrop-2)',
          'backdrop-3': process.env.THEME === 'dark' ? 'var(--backdrop-3)' : 'var(--light-backdrop-3)',
          'text-0': process.env.THEME === 'dark' ? 'var(--text-text-0)' : (process.env.THEME === 'light' ? 'var(--light-text-0)' : 'var(--ultra-light-text-0)'),
          'text-1': process.env.THEME === 'dark' ? 'var(--text-text-1)' : (process.env.THEME === 'light' ? 'var(--light-text-1)' : 'var(--ultra-light-text-1)'),
          'text-2': process.env.THEME === 'dark' ? 'var(--text-text-2)' : 'var(--light-text-2)',
          'text-3': process.env.THEME === 'dark' ? 'var(--text-text-3)' : 'var(--light-text-3)',

        },
        fontFamily: {
          'sans': [process.env.FONT_SANS || 'sans-serif'],
          'serif': [process.env.FONT_SERIF || 'serif'],
          'san-serif': [process.env.FONT_SANS || 'sans-serif'],
          'FiraSans': ['Fira Sans', 'sans-serif'],
          'Lora': ['Lora', 'serif'],
          'Slabo': ['Slabo 13px', 'serif'],
          'MerriweatherSans': ['Merriweather Sans', 'sans-serif'],
          'Cairo': ['Cairo', 'sans-serif'],
          'Martel': ['Martel', 'serif'],
          'Titilium': ['Titilium Web', 'sans-serif'],
          'Anaheim': ['Anaheim', 'sans-serif'],
          'Maitree': ['Maitree', 'serif'],
          'Prompt': ['Prompt', 'sans-serif'],
          'Oswald': ['Oswald', 'sans-serif'],
          'CoromantGaramond': ['Cormorant Garamond', 'serif'],
          'LibreBaskerville': ['Libre Baskerville', 'serif'],
          'Glegoo': ['Glegoo', 'serif'],
          'Graduate': ['Graduate', 'serif'],
          'Besley': ['Besley', 'serif'],
          'Comfortaa': ['Comfortaa', 'sans-serif'],
          'Poppins': ['Poppins', 'sans-serif'],
          'Lato': ['Lato', 'sans-serif'],
          'Montserrat': ['Montserrat', 'sans-serif'],
          'CrimsonText': ['Crimson Text', 'serif'],
          'PlayfairDisplay': ['Playfair Display', 'serif'],
          'NunitoSans': ['Nunito Sans', 'sans-serif'],
          'Quattrocento': ['Quattrocento', 'serif'],
          'NoticiaText': ['Noticia Text', 'serif'],
          'Mulish': ['Mulish', 'sans-serif'],
          'Habibi': ['Habibi', 'serif'],
          'Gudea': ['Gudea', 'sans-serif'],
          'Figtree': ['Figtree', 'sans-serif'],
          'Economica': ['Economica', 'sans-serif'],
          'header': process.env.FONT_HEADER,
          'body': process.env.FONT_BODY,
        },
        borderRadius: process.env.ROUNDED === 'subtle' ? {
          'none': '0',
          'sm': '2px',
          DEFAULT: '4px',
          'md': '5px',
          'lg': '6px',
          'xl': '7px',
          'full': '10px',
        } : (process.env.ROUNDED === 'sharp' ? {
          'none': '0',
          'sm': '0',
          DEFAULT: '0',
          'md': '0',
          'lg': '0',
          'xl': '0',
          'full': '0',
        } : {
          'none': '0',
          'sm': '0.125rem',
          DEFAULT: '0.25rem',
          'md': '0.375rem',
          'lg': '0.5rem',
          'xl': '0.75rem',
          'full': '9999px',
        }),
      },
    },
    variants: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }