/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      screens: {
        'sxs':'300px',
        'xs': '480px',    // Extra small screens
        'sm': '640px',    // Small screens (default)
        'md': '768px',    // Medium screens (default)
        'lg': '1024px',   // Large screens (default)
        'xl': '1280px',   // Extra large screens (default)
        '2xl': '1536px',  // Double extra large screens (default)
        // Add your custom breakpoints below
        '3xl': '1600px',
        '4k': '2560px',
      },
    },
  },
  plugins: [],
};
