/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable dark mode with class strategy
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Futuristic Dark Mode Color Palette
      colors: {
        // Background Layers (Layered Blacks)
        'bg-primary': '#0A0A0F',
        'bg-secondary': '#12121A',
        'bg-elevated': '#1A1A26',
        'bg-overlay': '#242430',
        
        // Text Colors
        'text-primary': '#E8E8F0',
        'text-secondary': '#9999AA',
        'text-muted': '#666677',
        
        // Accent Colors
        'accent-start': '#6366F1',
        'accent-end': '#8B5CF6',
        'accent-glow': 'rgba(139, 92, 246, 0.3)',
        
        // Success (Desaturated)
        'success': '#10B981',
        'success-glow': 'rgba(16, 185, 129, 0.2)',
        
        // Glassmorphism
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-shadow': 'rgba(0, 0, 0, 0.37)',
        
        // Gradient Mesh
        'gradient-purple': '#8B5CF6',
        'gradient-blue': '#6366F1',
        'gradient-cyan': '#06B6D4',
      },
      
      // Typography
      fontFamily: {
        'serif': ['Zodiak', 'Recoleta', 'Georgia', 'serif'],
        'sans': ['Inter Variable', 'Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      
      fontSize: {
        'hero': 'clamp(3rem, 8vw, 6rem)',
        'hero-sub': 'clamp(1.25rem, 2vw, 1.5rem)',
      },
      
      letterSpacing: {
        'tight': '-0.02em',
        'wide': '0.05em',
      },
      
      // Spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Shadows (Glow Effects)
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2), 0 0 60px rgba(139, 92, 246, 0.1)',
        'glow-purple-lg': '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-elevated': '0 12px 40px 0 rgba(0, 0, 0, 0.5)',
      },
      
      // Backdrop Blur
      backdropBlur: {
        'glass': '10px',
        'glass-lg': '12px',
      },
      
      // Animations
      animation: {
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'gradient': 'gradient 8s linear infinite',
        'mesh-move': 'mesh-move 20s ease infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-in-up': 'fade-in-up 0.6s ease-out',
      },
      
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'mesh-move': {
          '0%, 100%': { 'background-position': '0% 0%, 100% 100%, 50% 50%' },
          '50%': { 'background-position': '100% 100%, 0% 0%, 50% 50%' },
        },
        'glow-pulse': {
          '0%, 100%': {
            'box-shadow': '0 0 20px rgba(139, 92, 246, 0.3), 0 0 40px rgba(139, 92, 246, 0.2)',
          },
          '50%': {
            'box-shadow': '0 0 30px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3), 0 0 80px rgba(139, 92, 246, 0.2)',
          },
        },
        'shimmer': {
          '0%': { 'background-position': '-1000px 0' },
          '100%': { 'background-position': '1000px 0' },
        },
        'fade-in-up': {
          '0%': { 'opacity': '0', 'transform': 'translateY(30px)' },
          '100%': { 'opacity': '1', 'transform': 'translateY(0)' },
        },
        'gradient': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
      },
      
      // 3D Transforms
      transform: {
        '3d': 'translateZ(0)',
      },
      
      // Gradients
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
        'gradient-accent-animated': 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #06B6D4 100%)',
        'gradient-mesh': 'radial-gradient(at 20% 30%, rgba(139, 92, 246, 0.15) 0px, transparent 50%), radial-gradient(at 80% 70%, rgba(99, 102, 241, 0.15) 0px, transparent 50%), radial-gradient(at 50% 50%, rgba(6, 182, 212, 0.1) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
