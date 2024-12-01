import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Build output directory for production
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://hyperbolic-ai-prompter.onrender.com', // Render backend URL
        changeOrigin: true,
        secure: false, // Use true if HTTPS is properly configured on your backend
      },
    },
  },
});
