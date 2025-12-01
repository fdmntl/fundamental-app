/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.{js,ts,tsx}', './app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-secondary': 'var(--color-primary-secondary)',
        secondary: 'var(--color-secondary)',
        'secondary-secondary': 'var(--color-secondary-secondary)',
        background: 'var(--color-background)',
        content: 'var(--color-content)',
        success: 'var(--color-success)',
        'success-secondary': 'var(--color-success-secondary)',
        warning: 'var(--color-warning)',
        'warning-secondary': 'var(--color-warning-secondary)',
        error: 'var(--color-error)',
        'error-secondary': 'var(--color-error-secondary)',
        info: 'var(--color-info)',
        'info-secondary': 'var(--color-info-secondary)',
        text: 'var(--color-text)',
        neutral: 'var(--color-neutral)',
      },
    },
  },
  plugins: [],
};
