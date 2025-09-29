import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        serviceWorker: resolve(__dirname, 'src/serviceWorker.js'),
      },
      output: {
        entryFileNames: (assetInfo) => {
          return assetInfo.name === 'serviceWorker' ? '[name].js' : 'assets/[name]-[hash].js';
        },
      },
    },
  },
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
