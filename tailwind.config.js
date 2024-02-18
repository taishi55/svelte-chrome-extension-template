/** @type {import('tailwindcss').Config} */
export default {
  mode: "jit", // Enable Just-in-Time mode
  content: [
    "./src/**/*.html", // Scan all HTML files in the "src" directory
    "./src/**/*.svelte", // Scan all Svelte files in the "src" directory
    // Add any other file types or paths that contain Tailwind CSS classes
  ],
  darkMode: "class",
  theme: {
    extend: {},
  },
  plugins: [],
};
