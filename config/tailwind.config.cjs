/** @type {import('tailwindcss').Config} */
module.exports = {
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#374151",
          "secondary": "#be123c",
          "accent": "#1d4ed8",
          "neutral": "#111827",
          "base-100": "#2A303C",
          "info": "#3ABFF8",
          "success": "#36D399",
          "warning": "#fde047",
          "error": "#F87272",
        },
      },
    ],
  },
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
}
