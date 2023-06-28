/** @type {import('tailwindcss').Config} */
const content = ['./src/views/**/*.{hbs,js}']
const mode = 'jit'
const daisyui = {
  themes: ['light', 'dark', 'dracula', 'corporate', 'synthwave', 'retro']
}
const theme = {
  fontFamily: {
    sans: ['Roboto', 'sans-serif'],
    serif: ['Merriweather', 'serif']
  },
  screens: {
    sm: '576px',
    md: '960px',
    lg: '1440px'
  },
  extend: {}
}
const variants = { display: ['responsive', 'dropdown'] }

const plugins = [require('@tailwindcss/typography'), require('daisyui')]

export default { content, daisyui, theme, plugins, variants, mode }
