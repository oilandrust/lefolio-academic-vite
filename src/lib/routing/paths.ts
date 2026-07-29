import type { ContentManifest, ManifestPage } from '@/lib/content/types';

/** Strip basePath prefix and trailing slash noise for route matching. */
export function normalizePathname(pathname: string, basePath = ''): string {
  let path = pathname || '/';
  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length) || '/';
  }
  if (!path.startsWith('/')) path = `/${path}`;
  // Keep trailing slash semantics except for root
  if (path.length > 1 && path.endsWith('/')) {
    // leave as-is for matching against manifest hrefs
  }
  return path;
}

export function stripTrailingSlash(path: string): string {
  if (path.length > 1 && path.endsWith('/')) return path.slice(0, -1);
  return path || '/';
}

export function getPageFromManifest(
  manifest: ContentManifest,
  section: string,
  slug: string
): ManifestPage | null {
  return (
    manifest.pages.find(
      (p) =>
        p.section === section &&
        (p.slug === slug || decodeURIComponent(p.slug) === decodeURIComponent(slug))
    ) ?? null
  );
}
