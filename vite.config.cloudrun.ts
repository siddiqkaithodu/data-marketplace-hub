import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import { resolve } from 'path'

// =============================================================================
// Cloud Run Production Vite Config
// =============================================================================
// This config strips the GitHub Spark plugins (sparkPlugin, createIconImportProxy)
// which depend on the Spark hosting environment (/_spark/* endpoints, iframe proxy).
// Used by Dockerfile.cloudrun for production builds.
// =============================================================================

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(projectRoot, 'src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  }
});
