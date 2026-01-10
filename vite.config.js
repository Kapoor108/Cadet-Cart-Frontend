import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Custom plugin to handle SPA routing in development
const spaFallback = () => {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url && !req.url.startsWith('/api') && !req.url.includes('.') && req.url !== '/') {
          req.url = '/';
        }
        next();
      });
    }
  };
};

export default defineConfig({
  plugins: [react(), spaFallback()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  },
  define: {
    'process.env': {}
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
