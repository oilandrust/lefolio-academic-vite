# LeFolio Academic (Vite)

Clone of [lefolio-academic](https://github.com/oilandrust/lefolio-academic) with the **Next.js** engine replaced by **Vite + React Router**.

Content sync (`scripts/sync-content.mjs`) is unchanged. The UI is a client SPA that loads `.content/manifest.json` as `/content-manifest.json`.

## Quick start

```bash
cd lefolio-academic-vite
npm install
npm run dev
```

Open http://localhost:3000. Edit `Content/` — the watcher re-syncs and Vite full-reloads when the manifest changes.

## Routing (Next → Vite)

| Next App Router | Vite (React Router) |
|-----------------|---------------------|
| `app/layout.tsx` | `src/routes/RootLayout.tsx` + template `Shell` |
| `app/page.tsx` | `src/routes/HomePage.tsx` (`/`) |
| `app/[section]/page.tsx` | `src/routes/SectionIndexPage.tsx` (`/:section`) |
| `app/[section]/[slug]/page.tsx` | `src/routes/ContentPage.tsx` (`/:section/:slug`) |
| `next/link` / `usePathname` | `react-router-dom` `Link` / `useLocation` |
| `loadManifest()` via Node `fs` | `fetch('/content-manifest.json')` + `ManifestProvider` |
| `next build` → `out/` | `vite build` → `dist/` (+ `404.html` SPA fallback) |

Trailing-slash URLs from the content pipeline are supported.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run sync-content` | Sync vault → `.content/manifest.json` |
| `npm run dev` | Sync + watch content + Vite |
| `npm run build` | Sync + Vite production build |
| `npm run preview` | Preview `dist/` |

## External content

```bash
node scripts/lefolio.mjs dev --content ~/Documents/MySite
```

## Deploy notes

Static hosts need an SPA fallback (this repo writes `dist/404.html` for GitHub Pages). Set `site.basePath` in `config.yaml` the same way as the Next engine; Vite `base` and React Router `basename` follow it.
