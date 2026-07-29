#!/usr/bin/env node
/**
 * Copy dist/index.html → dist/404.html for GitHub Pages SPA fallback.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const index = path.join(dist, 'index.html');
const fallback = path.join(dist, '404.html');

if (!fs.existsSync(index)) {
  console.warn('[spa-fallback] dist/index.html missing — skip');
  process.exit(0);
}

fs.copyFileSync(index, fallback);
console.log('[spa-fallback] wrote dist/404.html');
