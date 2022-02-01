const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss/tailwind-config').TailwindConfig} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/react/**/*.{html,js,ts,tsx,jsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      mono: ['Jetbrains Mono', ...defaultTheme.fontFamily.mono],
    },
    extend: {
      padding: {
        0.75: '0.175rem',
      },
      animation: {
        'fade-in': 'fadeIn 250ms ease-in-out',
      },
    },
  },
  plugins: [
  ],
};
