export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 0 25px var(--lux-accent-soft)",
      },
    },
  },
  plugins: [],
};
