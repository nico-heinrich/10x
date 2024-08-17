/** @type {import("tailwindcss").Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        primary: "#fff",
        secondary: "#7c5cff",
      },
      spacing: {
        "h-screen": "100svh",
      },
    },
  },
  plugins: [],
}

