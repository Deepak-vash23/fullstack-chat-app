import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        khargosh: {
          "primary": "#b19cd9",          // Darker lavender for current user chat boxes
          "secondary": "#db7093",        // Darker pink (PaleVioletRed) for other sender's chat boxes
          "base-100": "#2c2c2c",         // Gray background
          "base-200": "#1a1a1a",         // Slightly lighter black for contrast
          "base-300": "#262626",         // Even lighter black for borders
          "base-content": "#FFFFFF",     // White text color
          "neutral": "#121212",          // Lighter black for sidebar/navbar (previously pure black)
          "neutral-content": "#FFFFFF",  // White text on neutral background
          "accent": "#b19cd9",           // Darker lavender as accent
          "info": "#3ABFF8",            // Keep default info color
          "success": "#36D399",         // Keep default success color
          "warning": "#FBBD23",         // Keep default warning color
          "error": "#F87272",           // Keep default error color
        }
      },
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
};