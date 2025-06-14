module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        // Colors extracted from the provided theme
        primary: '#2a3b90', // Deep blue
        secondary: '#5068e2', // Medium blue
        accent: '#50e2d0', // Teal accent
        dark: '#1a1e2e', // Dark blue/almost black
        light: '#f8f9fc', // Very light blue/almost white
        text: '#333944', // Dark gray for text
        'text-light': '#767b84', // Light gray for secondary text
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
      animation: {
        morphing: 'morphing 15s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        morphing: {
          '0%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
          '25%': { borderRadius: '58% 42% 75% 25% / 76% 46% 54% 24%' },
          '50%': { borderRadius: '50% 50% 33% 67% / 55% 27% 73% 45%' },
          '75%': { borderRadius: '33% 67% 58% 42% / 63% 68% 32% 37%' },
          '100%': { borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' },
        },
        fadeInUp: {
          'from': { 
            opacity: '0',
            transform: 'translateY(20px)'
          },
          'to': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}