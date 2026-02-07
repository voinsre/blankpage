import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1A1A1A",
        paper: "#FAFAFA",
        muted: "#8A8A8A",
        faint: "#E5E5E5",
      },
      fontFamily: {
        body: [
          "var(--font-eb-garamond)",
          "Georgia",
          "'Times New Roman'",
          "serif",
        ],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1.125rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "2.75rem",
        "3xl": "3.5rem",
        "4xl": "4.5rem",
      },
      lineHeight: {
        body: "1.7",
        heading: "1.2",
      },
      letterSpacing: {
        heading: "-0.02em",
      },
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        md: "2rem",
        lg: "4rem",
        xl: "8rem",
        "2xl": "12rem",
        section: "16rem",
      },
      transitionTimingFunction: {
        default: "cubic-bezier(0.25, 0.1, 0.25, 1)",
        gentle: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        fast: "200ms",
        normal: "400ms",
        slow: "800ms",
        reveal: "1200ms",
        breath: "4000ms",
      },
      maxWidth: {
        prose: "640px",
      },
    },
  },
  plugins: [],
};
export default config;
