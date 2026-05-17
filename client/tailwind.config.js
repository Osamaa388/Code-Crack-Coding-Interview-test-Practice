export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      boxShadow: {
        glow: '0 20px 60px rgba(80, 70, 230, 0.18)'
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 28%), radial-gradient(circle at bottom right, rgba(59,130,246,0.28), transparent 32%)'
      }
    }
  },
  plugins: []
};
