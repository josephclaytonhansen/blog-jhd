module.exports = {
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}', {
      safelist: ['bg-cyan-400', 'bg-cyan-500', 'bg-cyan-600', 'bg-cyan-700'],
    }], 
    options: {
      safelist: [
        'bg-cyan-400',
        'bg-cyan-500',
        'bg-cyan-600',
        'bg-cyan-700',
      ],
    },
    theme: {
      extend: {
        fontFamily: {
          'sans': ['Fira Sans', 'sans-serif'],
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
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }