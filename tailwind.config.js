/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
        backgroundImage: {
            'gradient': 'linear-gradient(to left top, #dd2476 20%, #ff512f 80%)',
        }
    },
  },
  plugins: [],
};
