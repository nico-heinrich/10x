/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#fff",
        secondary: "#7c5cff",
        error: "#ff0050",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

