import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { resolveContentDir, readEngineMeta } from './scripts/resolve-paths.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MANIFEST_PATH = path.join(__dirname, '.content', 'manifest.json');

function normalizeBasePath(value) {
  if (!value || value === '/') return '';
  return String(value).replace(/\/$/, '');
}

function readBasePath() {
  const meta = readEngineMeta();
  if (meta?.basePath !== undefined) {
    return normalizeBasePath(meta.basePath);
  }
  try {
    const config = yaml.load(
      fs.readFileSync(path.join(resolveContentDir(), 'config.yaml'), 'utf8')
    );
    return normalizeBasePath(config?.site?.basePath);
  } catch {
    return '';
  }
}

function lefolioManifestPlugin(basePath) {
  const manifestPaths = new Set(
    ['/content-manifest.json', `${basePath}/content-manifest.json`].filter(
      (p) => p && p !== '/undefined/content-manifest.json'
    )
  );

  return {
    name: 'lefolio-manifest',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0];
        if (!url || !manifestPaths.has(url)) return next();
        try {
          const raw = fs.readFileSync(MANIFEST_PATH);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-store');
          res.end(raw);
        } catch {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'manifest missing — run sync first' }));
        }
      });

      server.watcher.add(MANIFEST_PATH);
      server.watcher.on('change', (file) => {
        if (file === MANIFEST_PATH || file.endsWith(`${path.sep}manifest.json`)) {
          server.ws.send({ type: 'full-reload', path: '*' });
        }
      });
    },
    closeBundle() {
      const distManifest = path.join(__dirname, 'dist', 'content-manifest.json');
      if (fs.existsSync(MANIFEST_PATH)) {
        fs.mkdirSync(path.dirname(distManifest), { recursive: true });
        fs.copyFileSync(MANIFEST_PATH, distManifest);
      }
    },
  };
}

const basePath = readBasePath();

export default defineConfig({
  base: basePath ? `${basePath}/` : '/',
  plugins: [react(), lefolioManifestPlugin(basePath)],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  optimizeDeps: {
    include: ['react-plotly.js', 'plotly.js-dist-min'],
  },
});
