const colors = require('tailwindcss/colors')

module.exports = {
  content: ['./layouts/**/*.vue', './components/**/*.vue', './pages/**/*.vue'],
  theme: {
    colors: {
      ...colors,
      primary: '#102B6A', // 主色调
      secondary: '#426AB3', // 次颜色
      success: '#1D953F',
      danger: '#ED1941',
      warning: '#FFC20E',
      info: '#4e72b8',
      light: '#999D9C',
      dark: '#130c0e'
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
