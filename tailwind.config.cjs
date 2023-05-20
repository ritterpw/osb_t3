/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        gray: {
          900: "#202225",
          800: "#2f3136",
          700: "#36393f",
          600: "#4f545c",
          400: "#d4d7dc",
          300: "#e3e5e8",
          200: "#ebedef",
          100: "#f2f3f5",
        },
        vercel: {
          1000: "#000",
          950: "#0A0808",
          900: "#111",
          800: "#333",
          700: "#444",
          600: "#666",
          500: "#888",
          400: "#999",
          300: "#eaeaea",
        },
      },
      spacing: {
        88: "22rem",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out",
      },
      backgroundImage: {
        piccy: "url('/bg-2.jpg')",
        piccytwo: "url('/bg.jpg')",
      },
    },
  },
  plugins: [],
};
