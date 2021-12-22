const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{html,js,ts,tsx,jsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      mono: ['Jetbrains Mono', ...defaultTheme.fontFamily.mono],
    },
  },
  plugins: [
  ],
};
