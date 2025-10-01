/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: [
      './pages/**/*.{js,jsx}',
      './components/**/*.{js,jsx}',
      './app/**/*.{js,jsx}',
      './src/**/*.{js,jsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          border: "var(--color-border)", // slate-200
          input: "var(--color-input)", // white
          ring: "var(--color-ring)", // blue-600
          background: "var(--color-background)", // slate-50
          foreground: "var(--color-foreground)", // slate-800
          primary: {
            DEFAULT: "var(--color-primary)", // blue-600
            foreground: "var(--color-primary-foreground)", // white
          },
          secondary: {
            DEFAULT: "var(--color-secondary)", // slate-500
            foreground: "var(--color-secondary-foreground)", // white
          },
          destructive: {
            DEFAULT: "var(--color-destructive)", // red-600
            foreground: "var(--color-destructive-foreground)", // white
          },
          muted: {
            DEFAULT: "var(--color-muted)", // slate-100
            foreground: "var(--color-muted-foreground)", // slate-500
          },
          accent: {
            DEFAULT: "var(--color-accent)", // sky-500
            foreground: "var(--color-accent-foreground)", // white
          },
          popover: {
            DEFAULT: "var(--color-popover)", // white
            foreground: "var(--color-popover-foreground)", // slate-800
          },
          card: {
            DEFAULT: "var(--color-card)", // white
            foreground: "var(--color-card-foreground)", // slate-800
          },
          success: {
            DEFAULT: "var(--color-success)", // emerald-600
            foreground: "var(--color-success-foreground)", // white
          },
          warning: {
            DEFAULT: "var(--color-warning)", // amber-600
            foreground: "var(--color-warning-foreground)", // white
          },
          error: {
            DEFAULT: "var(--color-error)", // red-600
            foreground: "var(--color-error-foreground)", // white
          },
        },
        borderRadius: {
          lg: "8px",
          md: "6px",
          sm: "4px",
        },
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
          mono: ['JetBrains Mono', 'monospace'],
        },
        fontSize: {
          'xs': ['0.75rem', { lineHeight: '1rem' }],
          'sm': ['0.875rem', { lineHeight: '1.25rem' }],
          'base': ['1rem', { lineHeight: '1.5rem' }],
          'lg': ['1.125rem', { lineHeight: '1.75rem' }],
          'xl': ['1.25rem', { lineHeight: '1.75rem' }],
          '2xl': ['1.5rem', { lineHeight: '2rem' }],
          '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
          '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        },
        boxShadow: {
          'restaurant-sm': '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
          'restaurant-md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
          'restaurant-lg': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
          'restaurant-xl': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
          'restaurant-modal': '0 25px 50px rgba(0, 0, 0, 0.25)',
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
          "fade-in": "fade-in 0.2s ease-out",
          "fade-out": "fade-out 0.2s ease-out",
          "slide-in": "slide-in 0.2s ease-out",
          "slide-out": "slide-out 0.2s ease-out",
          "shimmer": "shimmer 2s linear infinite",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
          "fade-in": {
            from: { opacity: "0" },
            to: { opacity: "1" },
          },
          "fade-out": {
            from: { opacity: "1" },
            to: { opacity: "0" },
          },
          "slide-in": {
            from: { transform: "translateX(-100%)" },
            to: { transform: "translateX(0)" },
          },
          "slide-out": {
            from: { transform: "translateX(0)" },
            to: { transform: "translateX(-100%)" },
          },
          "shimmer": {
            "0%": { transform: "translateX(-100%)" },
            "100%": { transform: "translateX(100%)" },
          },
        },
        transitionTimingFunction: {
          'restaurant': 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        backdropBlur: {
          'restaurant': '8px',
        },
        minHeight: {
          'touch': '44px',
        },
        minWidth: {
          'touch': '44px',
        },
      },
    },
    plugins: [
      require("tailwindcss-animate"),
    ],
  }