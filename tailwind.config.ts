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
        // ---- Veirdo palette (sampled from veirdo.in live stylesheet) ----
        paper: "#FFFFFF",       // page background
        mist: "#F2F2F2",        // light gray panels / section bands
        cloud: "#EEEEEF",       // slightly deeper panel
        charcoal: "#131814",    // primary text / announcement bar / footer
        graphite: "#222527",    // secondary dark surface
        orange: "#016120",      // primary CTA (Veirdo's deep green)
        ember: "#00B53A",       // CTA hover / bright green
        gold: "#FFDF38",        // yellow sale badge
        sand: "#FFDEB2",        // warm cream badge background
        crimson: "#9D1325",     // multi-buy / offer badge
        navyv: "#133B5F",       // navy accent
        pine: "#008040",        // "lowest price" / in-stock accent
        muted: "#51575C",       // muted body text
        stroke: "#E5E5E5",      // hairline borders

        // ---- Legacy aliases: admin dashboard still uses the dark theme,
        //      so keep the original values for those screens. Storefront
        //      files were migrated to the light tokens above. ----
        ink: "#0A0C12",
        navy: "#0F1530",
        vyloom: "#1B2FA6",
        electric: "#3E5BFF",
        cream: "#F2ECDD",
        maroon: "#5C1420",
        plum: "#33203F",
      },
      fontFamily: {
        display: [
          "Archivo",
          "Helvetica Neue",
          "Arial Narrow",
          "Arial",
          "sans-serif",
        ],
        body: ["Inter", "Helvetica Neue", "Arial", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        widest2: "0.22em",
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        DEFAULT: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
        full: "9999px",
      },
      backgroundImage: {
        grain: "none",
      },
      keyframes: {
        "ann-rotate": {
          "0%, 28%": { transform: "translateY(0)" },
          "33%, 61%": { transform: "translateY(-100%)" },
          "66%, 94%": { transform: "translateY(-200%)" },
          "100%": { transform: "translateY(-300%)" },
        },
      },
      animation: {
        "ann-rotate": "ann-rotate 12s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
