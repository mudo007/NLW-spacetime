/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // modifications necessary to use google fonts as defined on layout.tsx
      fontFamily: {
        sans: 'var(--font-roboto)',
        alt: 'var(--font-bai-jamjuree)',
      },
      colors: {
        gray: {
          50: '#eaeaea',
          100: '#bebebf',
          200: '#9e9ea0',
          300: '#727275',
          400: '#56565a',
          500: '#2c2c31',
          600: '#28282d',
          700: '#1f1f23',
          800: '#18181b',
          900: '#121215',
        },
        green: {
          50: '#e6fbef',
          100: '#b1f1ce',
          200: '#8cebb6',
          300: '#57e295',
          400: '#36dc81',
          500: '#04d361',
          600: '#04c058',
          700: '#039645',
          800: '#027435',
          900: '#025929',
        },
        purple: {
          50: '#f3eefc',
          100: '#d8cbf7',
          200: '#c6b2f3',
          300: '#ab8eee',
          400: '#9b79ea',
          500: '#8257e5',
          600: '#764fd0',
          700: '#5c3ea3',
          800: '#48307e',
          900: '#372560',
        },
      },
      blur: {
        full: '194px',
      },
      backgroundImage: {
        // little hack to make the left-side stripes with css
        // every 1/8th of the div will have a white stripe, and teh remaining 7/8 will be transparent, creating the stripes pattern
        stripes:
          'linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 12.5%, transparent 12.5%, transparent)',
      },
      // must have same property names as the backgroundImage object
      backgroundSize: {
        // specifies that the div will habe 8px heigth
        stripes: '100% 8px',
      },
      fontSize: {
        // para que o font-size 5xl seja 40 px (2.5*16)
        '5xl': '2.5rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
