import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // NACOS MAPOLY Design System
        nacos: {
          green: "#17b91d",        // Primary vibrant green — buttons, accents, active states
          "green-dark": "#0d5c10", // Deep forest green — footer, top bar, headings
          "green-mid": "#1a7a1e",  // Mid-range green — hover states
          "green-light": "#e8f5e9",// Mint light — badge backgrounds, highlights
          "green-glow": "rgba(23, 185, 29, 0.15)", // Soft green glow
          navy: "#0A1A1F",         // Deep teal-black — dark text, borders
          cream: "#f0ead8",        // Warm cream — section label backgrounds
          "off-white": "#f4f6f8",  // Off-white — page background
          "light-gray": "#f9fafb", // Lighter sections
        },
        // Semantic colors matching NACOS palette
        primary: {
          DEFAULT: "#17b91d",
          hover: "#14a319",
          dark: "#0d5c10",
          light: "#e8f5e9",
          glow: "rgba(23, 185, 29, 0.2)",
        },
        surface: {
          DEFAULT: "#ffffff",
          raised: "#f4f6f8",
          dark: "#0d3d10",
          "top-bar": "#1a5c1a",
        },
        ink: {
          DEFAULT: "#0A1A1F",
          muted: "#374151",
          light: "#6B7280",
          faint: "#9CA3AF",
        },
        border: {
          DEFAULT: "#E5E7EB",
          subtle: "#F3F4F6",
          green: "rgba(23, 185, 29, 0.3)",
        },
        status: {
          "success-bg": "#e8f5e9",
          "success-text": "#0d5c10",
          "warning-bg": "#FEF3C7",
          "warning-text": "#92400E",
          "error-bg": "#FEE2E2",
          "error-text": "#991B1B",
          "info-bg": "#EFF6FF",
          "info-text": "#1E40AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["'Courier New'", "monospace"],
      },
      boxShadow: {
        nacos: "0 4px 20px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
        "nacos-lg": "0 12px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
        "nacos-green": "0 4px 20px rgba(23, 185, 29, 0.2)",
        "card": "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 8px 30px rgba(0,0,0,0.10)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { opacity: "0", transform: "translateX(-8px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "pulse-green": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(23, 185, 29, 0)" },
          "50%": { boxShadow: "0 0 0 6px rgba(23, 185, 29, 0.15)" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out forwards",
        "slide-in": "slide-in 0.3s ease-out forwards",
        "pulse-green": "pulse-green 2s ease-in-out infinite",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
