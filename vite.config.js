import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true, // Allow external connections
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable sourcemaps in production for security
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          ui: ['@headlessui/react', '@heroicons/react', 'framer-motion']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    // Define global constants
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'appwrite']
  }
});
