const { heroui } = require("@heroui/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    "bg-black",
  ],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
      colors: {
        sidebar: {
          DEFAULT: "#161923",
          hover: "#282b3a",
          active: "#334155",
        },
        /* Override slate to match landing page colors exactly */
        slate: {
          50: "#f0f2f5",
          100: "#e8eaef",
          200: "#dcdfe6",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e2130",
          900: "#0f1117",
          950: "#0a0c12",
        },
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      addCommonColors: true,
    }),
    function({ addBase }) {
      addBase({
        '*:focus-visible': {
          outline: 'none !important',
        },
      });
    },
  ],
};
