import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure build output directory
  },
  server: {
    // Make sure to use middleware to handle routing properly
    middlewareMode: false, 
  },
  preview: {
    // This helps when serving the build version locally
    port: 4173,
    strictPort: true,
    open: true,
  }
});
