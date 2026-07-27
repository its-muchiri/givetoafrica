/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        indigo: {
          DEFAULT: '#2B3A67',
          50: '#E8EBF0',
          100: '#D1D7E1',
          200: '#A3AFC3',
          300: '#7587A5',
          400: '#475F87',
          500: '#2B3A67',
          600: '#232E52',
          700: '#1A233D',
          800: '#121729',
          900: '#090C14',
        },
        ochre: {
          DEFAULT: '#C98A2C',
          50: '#FBF4E8',
          100: '#F7E9D1',
          200: '#EFD3A3',
          300: '#E7BD75',
          400: '#D9A34E',
          500: '#C98A2C',
          600: '#A16E23',
          700: '#79531A',
          800: '#513712',
          900: '#281C09',
        },
        savanna: {
          DEFAULT: '#4F6D4F',
          50: '#EDF2ED',
          100: '#DBE5DB',
          200: '#B7CBB7',
          300: '#93B193',
          400: '#6F8F6F',
          500: '#4F6D4F',
          600: '#3F573F',
          700: '#2F412F',
          800: '#1F2C1F',
          900: '#101610',
        },
        parchment: '#F6EEDD',
        ink: {
          DEFAULT: '#2A2420',
          soft: '#5B5248',
          muted: '#8A827A',
        },
        error: '#B3452C',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '2px',
        DEFAULT: '4px',
        md: '4px',
        lg: '8px',
        xl: '12px',
      },
      spacing: {
        '18': '72px',
        '22': '88px',
        '30': '120px',
        '36': '144px',
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      keyframes: {
        'ripple': {
          '0%': { transform: 'scale(1)', opacity: '0.6' },
          '100%': { transform: 'scale(2.4)', opacity: '0' },
        },
        'idle-pulse': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.5' },
        },
        'draw-check': {
          '0%': { strokeDashoffset: '24' },
          '100%': { strokeDashoffset: '0' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
        'underline-in': {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
      animation: {
        'ripple': 'ripple 2400ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'idle-pulse': 'idle-pulse 4s ease-in-out infinite',
        'draw-check': 'draw-check 200ms ease-out forwards',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'shake': 'shake 300ms ease-in-out',
        'underline-in': 'underline-in 150ms cubic-bezier(0.22, 1, 0.36, 1) forwards',
      },
    },
  },
  plugins: [],
}
