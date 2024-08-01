import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class', // Use class-based dark mode
  theme: {
    extend: {
      colors: {
        background: {
          light: '#ffffff',
          dark: '#1a1a1a', // Greyish black
        },
        text: {
          light: '#000000',
          dark: '#ffffff',
        },
        'dark-background': '#1a1a1a', // Greyish black, can be used as an alias
        // Add other custom colors here
      },
    },
  },
  plugins: [],
};

export default config;
