/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "var(--color-primary)",
          text: "var(--color-primary-text)",
          light: "var(--color-primary-light)",
          lighter: "var(--color-primary-lighter)",
          extraLight: "var(--color-primary-extra-light)",
          dark: "var(--color-primary-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          text: "var(--color-secondary-text)",
          light: "var(--color-secondary-light)",
          dark: "var(--color-secondary-dark)",
        },
        tertiary: {
          DEFAULT: "var(--color-tertiary)",
          text: "var(--color-tertiary-text)",
          light: "var(--color-tertiary-light)",
          dark: "var(--color-tertiary-dark)",
        },
        quaternary: {
          DEFAULT: "var(--color-quaternary)",
          text: "var(--color-quaternary-text)",
          light: "var(--color-quaternary-light)",
          dark: "var(--color-quaternary-dark)",
        },
        quinary: {
          DEFAULT: "var(--color-quinary)",
          text: "var(--color-quinary-text)",
          light: "var(--color-quinary-light)",
          dark: "var(--color-quinary-dark)",
        },
        grey: {
          DEFAULT: "var(--color-grey)",
          text: "var(--color-grey-text)",
          light: "var(--color-grey-light)",
          dark: "var(--color-grey-dark)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          text: "var(--color-success-text)",
          light: "var(--color-success-light)",
          dark: "var(--color-success-dark)",
        },
        warning: {
          DEFAULT: "var(--color-warning)",
          text: "var(--color-warning-text)",
          light: "var(--color-warning-light)",
          dark: "var(--color-warning-dark)",
        },
        error: {
          DEFAULT: "var(--color-error)",
          text: "var(--color-error-text)",
          light: "var(--color-error-light)",
          dark: "var(--color-error-dark)",
        },
        info: {
          DEFAULT: "var(--color-info)",
          text: "var(--color-info-text)",
          light: "var(--color-info-light)",
          dark: "var(--color-info-dark)",
        },
        white: "var(--color-white)",
        black: "var(--color-black)",
      },
    },
  },
  plugins: [],
};
