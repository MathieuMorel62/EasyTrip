import path from "path"
import { fileURLToPath } from "url"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Configuration du serveur pour permettre l'accès réseau
  server: {
    host: '0.0.0.0', // Permet l'accès depuis l'extérieur (téléphone, etc.)
    port: 5173,      // Le port par défaut de Vite
  }
})
