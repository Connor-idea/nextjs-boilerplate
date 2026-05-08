import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        console: {
          bg: '#f5f7fa',
          surface: '#ffffff',
          'surface-alt': '#fafbfc',
          'surface-muted': '#f2f3f5',
          border: '#e5e6eb',
          'border-strong': '#d0d7e2',
          text: '#1f2329',
          muted: '#4e5969',
          subtle: '#86909c',
          neutral: '#c9cdd4',
          primary: '#4286fd',
          'primary-hover': '#2f73eb',
          'primary-soft': '#eaf3ff',
          success: '#146c2e',
          'success-soft': '#c4efcb',
          warning: '#8f4e00',
          'warning-soft': '#ffddb5',
          danger: '#ba1a1a',
          'danger-soft': '#ffdad6',
        },
      },
      fontFamily: {
        sans: [
          'Alibaba PuHuiTi 3.0',
          'Alibaba PuHuiTi',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          ...defaultTheme.fontFamily.sans,
        ],
      },
      borderRadius: {
        console: '6px',
        button: '4px',
      },
      boxShadow: {
        console: '0 1px 2px rgba(31, 35, 41, 0.04)',
        floating: '0 8px 24px rgba(31, 35, 41, 0.08)',
      },
      maxWidth: {
        console: '1560px',
        'console-xl': '1600px',
      },
    },
  },
  plugins: [],
}
