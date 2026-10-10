/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          dark: "#1e40af",
          light: "#dbeafe",
          50: "#f0f9ff",
          100: "#e0f2fe",
          600: "#2563eb",
          700: "#1d4ed8",
        },
        success: {
          DEFAULT: "#10b981",
          dark: "#047857",
          light: "#d1fae5",
        },
        danger: {
          DEFAULT: "#ef4444",
          dark: "#b91c1c",
          light: "#fee2e2",
        },
        warning: {
          DEFAULT: "#f59e0b",
          dark: "#b45309",
          light: "#fef3c7",
        },
        dark: {
          DEFAULT: "#0f172a",
          card: "#1e293b",
          border: "#334155",
        },
        slate: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "glass-gradient": "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)",
      },
      boxShadow: {
        "glass": "0 8px 32px 0 rgba(31, 38, 135, 0.07)",
        "glass-hover": "0 8px 32px 0 rgba(31, 38, 135, 0.15)",
        "premium": "0 20px 40px -15px rgba(0, 0, 0, 0.05)",
      },
      backdropBlur: {
        "glass": "12px",
      }
    },
  },
  plugins: [],
};
