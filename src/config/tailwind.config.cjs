/** @type {import('tailwindcss').Config} */
const content = [
  './src/views/**/*.{hbs,js}',
  './src/pug/*.pug',
  './src/html/*.html',
  './src/pages/*.js',
  './src/components/**/*.js'
];

const mode = 'jit';

const daisyui = {
  themes: ['dark', 'dracula', 'corporate', 'synthwave', 'retro']
};
const darkMode = 'class';
const theme = {
  extend: {
    screens: {
      sm: '576px', // Preserved from the first config
      md: '960px', // Preserved from the first config
      lg: '1440px', // Preserved from the first config
      xl: '1152px', // From the second config
    },
    colors: {
      current: 'currentColor',
      transparent: 'transparent',
      black: '#000',
      white: '#fff',
      gray: {
        50: '#F2F5FA',
        100: '#E6EAF1',
        200: '#DADFE9',
        300: '#C8CEDA',
        400: '#ACB4C4',
        500: '#838EA4',
        600: '#657084',
        700: '#374151',
        800: '#1f2937',
        900: '#0A2463'
      },
      red: {
        50: '#FFEBEE',
        100: '#ffd2da',
        200: '#ffa5b4',
        300: '#FF7088',
        400: '#FF4564',
        500: '#FF1F44',
        600: '#cc1936',
        700: '#991329',
        800: '#660c1b',
        900: '#33060e'
      },
      blue: {
        50: '#EBF8FF',
        100: '#ceefff',
        200: '#9ddeff',
        300: '#70CFFF',
        400: '#45C1FF',
        500: '#0AADFF',
        600: '#088acc',
        700: '#066899',
        800: '#044566',
        900: '#022333'
      },
      teal: {
        50: '#F0FAFA',
        100: '#d2dede',
        200: '#a6bdbd',
        300: '#369696',
        400: '#297373',
        500: '#205A5A',
        600: '#1a4848',
        700: '#133636',
        800: '#0d2424',
        900: '#061212'
      },
      orange: {
        50: '#FDF1ED',
        100: '#f7dad2',
        200: '#f0b6a4',
        300: '#EA7E5D',
        400: '#E4572E',
        500: '#D9481C',
        600: '#ae3a16',
        700: '#822b11',
        800: '#571d0b',
        900: '#2b0e06'
      },
      yellow: {
        50: '#FDFBED',
        100: '#faf6d7',
        200: '#f5edaf',
        300: '#EFE281',
        400: '#E9D758',
        500: '#E5D138',
        600: '#b7a72d',
        700: '#897d22',
        800: '#5c5416',
        900: '#2e2a0b'
      },
      green: {
        50: '#ecfdf5',
        100: '#d1fae5',
        200: '#a7f3d0',
        300: '#6ee7b7',
        400: '#34d399',
        500: '#10b981',
        600: '#059669',
        700: '#047857',
        800: '#065f46',
        900: '#064e3b'
      },
      indigo: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c3dafe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81'
      },
      purple: {
        50: '#f5f3ff',
        100: '#ede9fe',
        200: '#ddd6fe',
        300: '#c4b5fd',
        400: '#a78bfa',
        500: '#8b5cf6',
        600: '#7c3aed',
        700: '#6d28d9',
        800: '#5b21b6',
        900: '#4c1d95'
      },
      pink: {
        50: '#fdf2f8',
        100: '#fce7f3',
        200: '#fbcfe8',
        300: '#f9a8d4',
        400: '#f472b6',
        500: '#ec4899',
        600: '#db2777',
        700: '#be185d',
        800: '#9d174d',
        900: '#831843'
      }
    },
    fontFamily: {
      sans: ['Roboto', 'sans-serif'], // Preserved from the first config
      serif: ['Merriweather', 'serif'], // Preserved from the first config
      body: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"", // From the second config
      heading: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"", // From the second config
      mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace" // From the second config
    },
    spacing: {
      0: '0px',
      1: '0.25rem',
      2: '0.5rem',
      3: '0.75rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
      112: '28rem',
      128: '32rem',
      144: '36rem',
      px: '1px',
      0.5: '0.125rem',
      1.5: '0.375rem',
      2.5: '0.625rem',
      3.5: '0.875rem'
    },
    backgroundColor: theme => ({
      ...theme('colors'),
      body: '#fff'
    }),
    backgroundImage: {
      none: 'none',
      'gradient-to-t': 'linear-gradient(to top, var(--tw-gradient-stops))',
      'gradient-to-tr': 'linear-gradient(to top right, var(--tw-gradient-stops))',
      'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
      'gradient-to-br': 'linear-gradient(to bottom right, var(--tw-gradient-stops))',
      'gradient-to-b': 'linear-gradient(to bottom, var(--tw-gradient-stops))',
      'gradient-to-bl': 'linear-gradient(to bottom left, var(--tw-gradient-stops))',
      'gradient-to-l': 'linear-gradient(to left, var(--tw-gradient-stops))',
      'gradient-to-tl': 'linear-gradient(to top left, var(--tw-gradient-stops))'
    },
    backgroundOpacity: theme => theme('opacity'),
    backgroundPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top'
    },
    backgroundSize: {
      auto: 'auto',
      cover: 'cover',
      contain: 'contain'
    },
    borderColor: theme => ({
      ...theme('colors'),
      DEFAULT: '#E6EAF1'
    }),
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '5px',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px'
    },
    borderWidth: {
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
      DEFAULT: '1px'
    },
    boxShadow: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      DEFAULT: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0px 64px 128px rgba(7, 18, 99, 0.08)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      none: 'none'
    },
    container: [],
    cursor: {
      auto: 'auto',
      DEFAULT: 'default',
      pointer: 'pointer',
      wait: 'wait',
      text: 'text',
      move: 'move',
      'not-allowed': 'not-allowed'
    },
    fill: {
      current: 'currentColor'
    },
    flex: {
      1: '1 1 0%',
      auto: '1 1 auto',
      initial: '0 1 auto',
      none: 'none'
    },
    flexGrow: {
      0: '0',
      DEFAULT: '1'
    },
    flexShrink: {
      0: '0',
      DEFAULT: '1'
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.875rem' }],
      lg: ['1.125rem', { lineHeight: '1.875rem' }],
      xl: ['1.25rem', { lineHeight: '2.25rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['2.25rem', { lineHeight: '1.125' }],
      '4xl': ['3rem', { lineHeight: '1.125' }],
      '5xl': ['4rem', { lineHeight: '1.125' }],
      '6xl': ['5.5rem', { lineHeight: '1' }]
    },
    fontWeight: {
      hairline: '100',
      thin: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900'
    },
    height: theme => ({
      auto: 'auto',
      ...theme('spacing'),
      full: '100%',
      screen: '100vh'
    }),
    inset: (theme, { negative }) => ({
      auto: 'auto',
      ...theme('spacing'),
      ...negative(theme('spacing')),
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      full: '100%',
      '-1/2': '-50%',
      '-1/3': '-33.333333%',
      '-2/3': '-66.666667%',
      '-1/4': '-25%',
      '-2/4': '-50%',
      '-3/4': '-75%',
      '-full': '-100%'
    }),
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2'
    },
    listStyleType: {
      none: 'none',
      disc: 'disc',
      decimal: 'decimal'
    },
    margin: (theme, { negative }) => ({
      auto: 'auto',
      ...theme('spacing'),
      ...negative(theme('spacing'))
    }),
    maxHeight: {
      full: '100%',
      screen: '100vh'
    },
    maxWidth: {
      none: 'none',
      xs: '20rem',
      sm: '24rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem',
      full: '100%',
      min: 'min-content',
      max: 'max-content',
      prose: '65ch'
    },
    minHeight: {
      0: '0',
      full: '100%',
      screen: '100vh'
    },
    minWidth: {
      0: '0',
      full: '100%'
    },
    objectPosition: {
      bottom: 'bottom',
      center: 'center',
      left: 'left',
      'left-bottom': 'left bottom',
      'left-top': 'left top',
      right: 'right',
      'right-bottom': 'right bottom',
      'right-top': 'right top',
      top: 'top'
    },
    opacity: {
      0: '0',
      5: '0.05',
      10: '0.1',
      20: '0.2',
      25: '0.25',
      30: '0.3',
      40: '0.4',
      50: '0.5',
      60: '0.6',
      70: '0.7',
      75: '0.75',
      80: '0.8',
      90: '0.9',
      95: '0.95',
      100: '1'
    },
    order: {
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      10: '10',
      11: '11',
      12: '12',
      first: '-9999',
      last: '9999',
      none: '0'
    },
    padding: theme => theme('spacing'),
    placeholderColor: theme => theme('colors'),
    stroke: {
      current: 'currentColor'
    },
    textColor: theme => ({
      ...theme('colors'),
      body: '#0A2463'
    }),
    width: theme => ({
      auto: 'auto',
      ...theme('spacing'),
      '1/2': '50%',
      '1/3': '33.333333%',
      '2/3': '66.666667%',
      '1/4': '25%',
      '2/4': '50%',
      '3/4': '75%',
      '1/5': '20%',
      '2/5': '40%',
      '3/5': '60%',
      '4/5': '80%',
      '1/6': '16.666667%',
      '2/6': '33.333333%',
      '3/6': '50%',
      '4/6': '66.666667%',
      '5/6': '83.333333%',
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      '11/12': '91.666667%',
      full: '100%',
      screen: '100vw'
    }),
    zIndex: {
      0: '0',
      10: '10',
      20: '20',
      30: '30',
      40: '40',
      50: '50',
      auto: 'auto'
    }
  },
  screens: {
    sm: '576px', // Preserved from the first config
    md: '960px', // Preserved from the first config
    lg: '1440px' // Preserved from the first config
  }
};

const variants = {
  display: ['responsive', 'dropdown']
};

const plugins = [
  require('@tailwindcss/typography'),
  require('daisyui'),
  ({ addUtilities }) => {
    const newUtilities = {
      '.text-gradient-adaptive': {
        'background-image': 'var(--tw-gradient-text)',
        '-webkit-background-clip': 'text',
        'background-clip': 'text',
        'color': 'transparent',
        '--tw-gradient-text': `linear-gradient(
          to bottom,
          rgb(24 24 27) 0%,
          rgb(24 24 27) 70%,
          rgb(250 250 250) 70%,
          rgb(250 250 250) 100%
        )`
      },
      '.dark .text-gradient-adaptive': {
        '--tw-gradient-text': `linear-gradient(
          to bottom,
          rgb(244 244 245) 0%,
          rgb(244 244 245) 70%,
          rgb(39 39 42) 70%,
          rgb(39 39 42) 100%
        )`
      }
    };
    addUtilities(newUtilities);
  }
];

module.exports = {
  content,
  mode,
  daisyui,
  theme,
  variants,
  plugins,
  darkMode,
  output: {
    clean: false
  }
};

// src\config\tailwind.config.js
