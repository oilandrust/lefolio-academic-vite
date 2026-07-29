import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { ContentManifest } from '@/lib/content/types';

interface ManifestContextValue {
  manifest: ContentManifest;
  reload: () => Promise<void>;
}

const ManifestContext = createContext<ManifestContextValue | null>(null);

async function fetchManifest(): Promise<ContentManifest> {
  const base = import.meta.env.BASE_URL || '/';
  const url = `${base.replace(/\/?$/, '/') }content-manifest.json`;
  const res = await fetch(`${url}?t=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(
      `Failed to load content-manifest.json (${res.status}). Run: npm run sync-content`
    );
  }
  return (await res.json()) as ContentManifest;
}

export function ManifestProvider({ children }: { children: ReactNode }) {
  const [manifest, setManifest] = useState<ContentManifest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    const next = await fetchManifest();
    const { setManifestCache } = await import('@/lib/content/load-manifest');
    setManifestCache(next);
    setManifest(next);
    setError(null);
  }, []);

  useEffect(() => {
    void reload().catch((err: unknown) => {
      setError(err instanceof Error ? err.message : String(err));
    });
  }, [reload]);

  const value = useMemo(
    () => (manifest ? { manifest, reload } : null),
    [manifest, reload]
  );

  if (error) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Content not ready</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!value) {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui', color: '#666' }}>
        Loading site…
      </div>
    );
  }

  return <ManifestContext.Provider value={value}>{children}</ManifestContext.Provider>;
}

export function useManifest(): ContentManifest {
  const ctx = useContext(ManifestContext);
  if (!ctx) throw new Error('useManifest must be used within ManifestProvider');
  return ctx.manifest;
}
