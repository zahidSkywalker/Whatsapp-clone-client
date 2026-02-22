/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // WhatsApp Brand Colors
        whatsapp: {
          teal: "#00a884",
          darkTeal: "#008069",
          lightTeal: "#25d366",
          // Dark Mode UI
          dark: {
            bg: "#111b21",
            sidebar: "#111b21",
            header: "#202c33",
            surface: "#202c33",
            input: "#2a3942",
            text: "#e9edef",
            textSecondary: "#8696a0",
            divider: "rgba(134, 150, 160, 0.15)",
            bubbleOut: "#005c4b",
            bubbleIn: "#202c33",
          },
          // Light Mode UI
          light: {
            bg: "#f0f2f5",
            sidebar: "#ffffff",
            header: "#f0f2f5",
            surface: "#ffffff",
            input: "#f0f2f5",
            text: "#111b21",
            textSecondary: "#667781",
            divider: "rgba(0, 0, 0, 0.08)",
            bubbleOut: "#d9fdd3",
            bubbleIn: "#ffffff",
          }
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', '"Fira Sans"', '"Droid Sans"', '"Helvetica Neue"', 'sans-serif'],
      },
      boxShadow: {
        'message': '0 1px 0.5px rgba(11,20,26,.13)',
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
