import type { ContentManifest } from './types';

/**
 * Browser builds load the manifest via ManifestContext (fetch /content-manifest.json).
 * These helpers mirror the Next load-manifest API for shared call sites.
 */

let cached: ContentManifest | null = null;

export function setManifestCache(manifest: ContentManifest) {
  cached = manifest;
}

export function loadManifest(): ContentManifest {
  if (!cached) {
    throw new Error('Manifest not loaded — use ManifestProvider / useManifest in the Vite app');
  }
  return cached;
}

export function getPage(section: string, slug: string) {
  const manifest = loadManifest();
  return manifest.pages.find((p) => p.section === section && p.slug === slug) ?? null;
}

export function getAllPageParams() {
  const manifest = loadManifest();
  return manifest.pages.map((p) => ({ section: p.section, slug: p.slug }));
}

export function getSections() {
  const manifest = loadManifest();
  return manifest.sections.map((s) => s.name);
}

export function getSectionRoutes() {
  const manifest = loadManifest();
  return manifest.sectionRoutes;
}
