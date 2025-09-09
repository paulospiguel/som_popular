/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "verde-suave": "#4caf50",
        "verde-claro": "#81c784",
        "verde-muito-suave": "#e8f5e8",
        "dourado-claro": "#fbc02d",
        "dourado-muito-claro": "#fffde7",
        "vermelho-suave": "#e57373",
        "vermelho-muito-suave": "#ffebee",
        "bege-claro": "#fff8e1",
        "cinza-chumbo": "#424242",
        terra: "#4e342e",
        "brand-pink": "#ff69b4",
        "brand-cyan": "#00bcd4",
        "brand-bg": "#0f172a",
      },
      fontFamily: {
        rye: ["Rye", "serif"],
        baloo: ["Baloo 2", "cursive"],
        "roboto-slab": ["Roboto Slab", "serif"],
        inter: ["Inter", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
      borderRadius: {
        festival: "1.5rem",
        button: "2rem",
      },
      boxShadow: {
        festival:
          "0 4px 6px -1px rgb(76 175 80 / 0.06), 0 2px 4px -1px rgb(76 175 80 / 0.03)",
        button: "0 2px 8px -2px rgb(76 175 80 / 0.15)",
      },
      backgroundImage: {
        "gradient-hero":
          "linear-gradient(135deg, #fff8e1 0%, #e8f5e8 50%, #fffde7 100%)",
      },
      animation: {
        "pulse-glow": "pulse-glow 1s ease-in-out infinite",
        "slide-in": "slide-in 0.5s ease-out",
        "fade-in": "fade-in 0.8s ease-out",
        "slide-up": "slide-up 0.6s ease-out",
        float: "float 3s ease-in-out infinite",
        marquee: "marquee var(--duration) infinite linear",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        "marquee-left": "marquee-left 30s linear infinite",
        "marquee-right": "marquee-right 25s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 15px rgba(6, 182, 212, 0.4)",
            opacity: "0.9",
          },
          "50%": {
            boxShadow: "0 0 30px rgba(6, 182, 212, 0.8)",
            opacity: "1",
          },
        },
        "slide-in": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-in": {
          from: {
            opacity: "0",
            transform: "translateY(20px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "slide-up": {
          from: {
            opacity: "0",
            transform: "translateY(30px)",
          },
          to: {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        float: {
          "0%, 100%": {
            transform: "translateY(0px)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        marquee: {
          from: {
            transform: "translateX(0)",
          },
          to: {
            transform: "translateX(calc(-100% - var(--gap)))",
          },
        },
        "marquee-vertical": {
          from: {
            transform: "translateY(0)",
          },
          to: {
            transform: "translateY(calc(-100% - var(--gap)))",
          },
        },
        "marquee-left": {
          "0%": {
            transform: "translateX(0%)",
          },
          "100%": {
            transform: "translateX(-100%)",
          },
        },
        "marquee-right": {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
      },
    },
  },
  plugins: [],
};
