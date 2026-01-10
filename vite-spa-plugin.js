import fs from 'fs';
import path from 'path';

export function spaFallback() {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // Skip API routes and static files
        if (req.url.startsWith('/api') || 
            req.url.includes('.') || 
            req.url === '/' ||
            req.url.startsWith('/@') ||
            req.url.startsWith('/node_modules')) {
          return next();
        }

        // For all other routes, serve index.html
        const indexPath = path.resolve('index.html');
        if (fs.existsSync(indexPath)) {
          req.url = '/';
        }
        next();
      });
    }
  };
}