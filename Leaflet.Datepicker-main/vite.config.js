import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  define: {
    '__VERSION__': JSON.stringify(process.env.npm_package_version),
    'process.env': {}
  },
  server: {
    port: 3000
  },
  preview: {
    port: 3008
  },
  build: {
    lib: {
      entry:'src/leaflet-datepicker.js',
      name: 'leafletDatepicker',
      formats: ['umd']
    }
  }

})
