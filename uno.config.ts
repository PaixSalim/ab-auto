// uno.config.js
import { defineConfig, presetWind, transformerVariantGroup } from 'unocss'
import presetIcons from '@unocss/preset-icons'

export default defineConfig({
  presets: [presetWind(), presetIcons()],
  theme: {
    colors: {
      primary: '#BE1622',
      secondary: '#878787',
      title: '#FFF',
      description: '#C9BCBC',
      background: {
        primary: '#1a1b26',
        secondary: '#2a2b36',
        admin: '#232430',
      },
      button: {
        primary: '#BE1622',
        hover: '#BE1622',
      },
    },
    breakpoints: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },

  transformers: [transformerVariantGroup()],
  shortcuts: {
    'btn': 'py-2 px-4 font-semibold rounded-lg shadow-md transition-colors duration-300',
    'btn-primary': 'bg-primary text-white hover:bg-primary-dark',
    'input':
      'w-full bg-background-secondary focus:(ring-1 ring-primary outline-none) rounded-lg p-2 text-white',
  },
})
