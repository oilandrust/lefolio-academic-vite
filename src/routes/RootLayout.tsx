import { Outlet } from 'react-router-dom';
import GoogleAnalytics, {
  normalizeGoogleAnalyticsId,
} from '@/components/GoogleAnalytics';
import { ThemeProvider } from '@/components/ThemeProvider';
import { useManifest } from '@/lib/content/ManifestContext';
import { getTemplate } from '@/lib/templates/registry';
import { themeOverrideStyle } from '@/lib/theme/resolve-theme';
import { useEffect } from 'react';

export default function RootLayout() {
  const manifest = useManifest();
  const template = getTemplate(manifest.template ?? manifest.config.template ?? 'academic');
  const { Shell } = template;
  const templateId = manifest.template ?? manifest.config.template ?? 'academic';
  const themeId = manifest.theme;
  const themeStyle = themeOverrideStyle(manifest.config.theme);
  const googleAnalyticsId = normalizeGoogleAnalyticsId(manifest.config.analytics?.google);

  useEffect(() => {
    document.title = manifest.config.site.title;
    const root = document.documentElement;
    root.dataset.template = templateId;
    root.dataset.theme = themeId;
    if (themeStyle) {
      for (const [key, value] of Object.entries(themeStyle)) {
        if (typeof value === 'string') root.style.setProperty(key, value);
      }
    }
  }, [manifest, templateId, themeId, themeStyle]);

  return (
    <ThemeProvider themeId={themeId}>
      {googleAnalyticsId ? <GoogleAnalytics measurementId={googleAnalyticsId} /> : null}
      <Shell manifest={manifest}>
        <Outlet />
      </Shell>
    </ThemeProvider>
  );
}
