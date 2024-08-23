/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      fontFamily: {
        mono: "Spline Sans Mono, monospace",
      },
      colors: {
        primary: "#fff",
        secondary: "#5B33FF",
        error: "#ff0050",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

