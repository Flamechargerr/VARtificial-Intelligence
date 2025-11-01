import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      external: ['https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js'],
      output: {
        globals: {
          'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js': 'pyodide'
        }
      }
    }
  }
})