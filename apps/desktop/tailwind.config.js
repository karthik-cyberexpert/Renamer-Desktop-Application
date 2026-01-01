/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme color system - flat structure
        'background': '#0f0f13',
        'surface': '#1a1a22',
        'surface-elevated': '#24242e',
        'surface-hover': '#2e2e3a',
        'primary': '#8b5cf6',
        'primary-hover': '#a78bfa',
        'primary-muted': 'rgba(139, 92, 246, 0.15)',
        'accent-cyan': '#06b6d4',
        'accent-pink': '#ec4899',
        'accent-green': '#10b981',
        'text-primary': '#f4f4f5',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        'border': 'rgba(255, 255, 255, 0.08)',
        'border-hover': 'rgba(255, 255, 255, 0.15)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-sm': '0 0 10px rgba(139, 92, 246, 0.2)',
        'elevated': '0 8px 32px rgba(0, 0, 0, 0.4)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
        'gradient-accent': 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)'
      }
    },
  },
  plugins: [],
}
