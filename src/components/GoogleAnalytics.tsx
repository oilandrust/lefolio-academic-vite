import { useEffect } from 'react';

/** GA4 measurement IDs look like G-XXXXXXXXXX */
const GA_MEASUREMENT_ID = /^G-[A-Z0-9]+$/i;

export function normalizeGoogleAnalyticsId(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const id = value.trim();
  return GA_MEASUREMENT_ID.test(id) ? id : null;
}

interface GoogleAnalyticsProps {
  measurementId: string;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Core GA4 loader — template-agnostic; only render when a valid id is configured. */
export default function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const id = normalizeGoogleAnalyticsId(measurementId);

  useEffect(() => {
    if (!id) return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
    window.gtag('js', new Date());
    window.gtag('config', id);

    return () => {
      script.remove();
    };
  }, [id]);

  if (!id) return null;
  return null;
}
