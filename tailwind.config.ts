import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#102A43", brand: "#2878B8", teal: "#20B2AA",
        mist: "#F0F7FC", ink: "#263746", muted: "#64748B", line: "#E2E8F0",
      },
      fontFamily: { heading: ["Manrope", "system-ui", "sans-serif"], body: ["Inter", "system-ui", "sans-serif"] },
      borderRadius: { card: "14px" },
      boxShadow: { card: "0 2px 10px rgba(16,42,67,0.07)" },
    },
  },
  plugins: [],
};
export default config;
