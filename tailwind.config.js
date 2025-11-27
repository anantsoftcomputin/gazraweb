/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary color - Warm beige (#f5f0e7)
        primary: {
          DEFAULT: '#E6D7B9',
          50: '#FFFEFA',
          100: '#F5F0E7', // Original color
          200: '#EAE0D0',
          300: '#DFCFB9',
          400: '#E6D7B9',
          500: '#D1BCA0',
          600: '#BCA687',
          700: '#A89172',
          800: '#8D7A5E',
          900: '#72634C',
        },
        // Secondary color - Complementary earthy green
        secondary: {
          DEFAULT: '#5C7A64',
          50: '#EDF2EE',
          100: '#DBE5DD',
          200: '#B7CCBB',
          300: '#93B399',
          400: '#6F9977',
          500: '#5C7A64',
          600: '#4A6250',
          700: '#394B3C',
          800: '#273328',
          900: '#161C16',
        },
        // Neutral colors with warm undertones
        neutral: {
          DEFAULT: '#6B7067',
          50: '#F7F7F5',
          100: '#EEEFEC',
          200: '#DDDED9',
          300: '#CCCDC6',
          400: '#9A9C94',
          500: '#6B7067',
          600: '#555A52',
          700: '#40443E',
          800: '#2A2D29',
          900: '#151715',
        },
        // Accent colors - Muted natural palette
        accent: {
          terracotta: '#CB7762', // Warm earthy accent
          sage: '#88A096',      // Muted green
          ochre: '#D6A656',     // Warm yellow
          slate: '#5A6E7F',     // Blue-gray
        }
      },
      fontFamily: {
        sans: ['Inter var', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cabinet Grotesk', 'Inter var', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0px 2px 4px rgba(114, 99, 76, 0.04), 0px 4px 6px rgba(114, 99, 76, 0.05)',
        'medium': '0px 4px 6px rgba(114, 99, 76, 0.06), 0px 8px 16px rgba(114, 99, 76, 0.07)',
        'hard': '0px 10px 20px rgba(114, 99, 76, 0.07), 0px 20px 40px rgba(114, 99, 76, 0.1)',
        'inner': 'inset 0px 2px 4px rgba(114, 99, 76, 0.05)',
        'colored': '0px 4px 12px rgba(230, 215, 185, 0.15)', // Using primary color
        'glow': '0px 0px 20px rgba(230, 215, 185, 0.2)', // Subtle primary color glow
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