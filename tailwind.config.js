/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color - marigold / aged brass from the Gazra newspaper reference
        primary: {
          DEFAULT: '#B8792C',
          50: '#FFF8E8',
          100: '#F6E7C4',
          200: '#EACB88',
          300: '#DDAA56',
          400: '#C98A34',
          500: '#B8792C',
          600: '#9E5D22',
          700: '#7B421C',
          800: '#5E321A',
          900: '#3E2314',
        },
        // Secondary color - heritage green accent
        secondary: {
          DEFAULT: '#2F6B45',
          50: '#EDF7EF',
          100: '#D5EAD8',
          200: '#A8D0AE',
          300: '#75B381',
          400: '#4E905E',
          500: '#2F6B45',
          600: '#28573B',
          700: '#214630',
          800: '#1B3527',
          900: '#13241B',
        },
        // Neutral colors - warm paper through letterpress ink
        neutral: {
          DEFAULT: '#6D604F',
          50: '#FBF4E7',
          100: '#F1E4CB',
          200: '#DECBA7',
          300: '#C7AD7F',
          400: '#A3865E',
          500: '#6D604F',
          600: '#574B3E',
          700: '#41372E',
          800: '#29231E',
          900: '#171311',
        },
        // Accent colors - textile red, leafy green, marigold, and printed ink
        accent: {
          terracotta: '#9F2F28',
          sage: '#4E7A45',
          ochre: '#D9A13A',
          slate: '#28312B',
          indigo: '#25405D',
          rose: '#B5483A',
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter var', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0px 2px 4px rgba(62, 35, 20, 0.05), 0px 4px 6px rgba(62, 35, 20, 0.06)',
        'medium': '0px 4px 6px rgba(62, 35, 20, 0.07), 0px 8px 16px rgba(62, 35, 20, 0.08)',
        'hard': '0px 10px 20px rgba(62, 35, 20, 0.08), 0px 20px 40px rgba(62, 35, 20, 0.12)',
        'inner': 'inset 0px 2px 4px rgba(62, 35, 20, 0.06)',
        'colored': '0px 4px 14px rgba(184, 121, 44, 0.2)',
        'glow': '0px 0px 24px rgba(217, 161, 58, 0.24)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        'bubble': '999px',
      },
      spacing: {
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-in': 'slideIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale': 'scale 0.5s ease-out',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scale: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(-2%)' },
          '50%': { transform: 'translateY(0)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'var(--tw-prose-body)',
            lineHeight: '1.75',
            a: {
              color: 'var(--tw-prose-links)',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            strong: {
              color: 'var(--tw-prose-bold)',
              fontWeight: '600',
            },
            'ul > li': {
              paddingLeft: '1.5em',
            },
            'ul > li::before': {
              backgroundColor: 'var(--tw-prose-bullets)',
            },
            'ol > li': {
              paddingLeft: '1.5em',
            },
            'h1, h2, h3, h4': {
              color: 'var(--tw-prose-headings)',
              fontWeight: '700',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
