import { useParams } from 'react-router-dom';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import ShowcaseContentPage from '@/templates/showcase/views/ShowcaseContentPage';
import { useManifest } from '@/lib/content/ManifestContext';
import { getPageFromManifest } from '@/lib/routing/paths';

export default function ContentPage() {
  const { section = '', slug = '' } = useParams();
  const manifest = useManifest();
  const page = getPageFromManifest(
    manifest,
    decodeURIComponent(section),
    decodeURIComponent(slug)
  );

  if (!page) {
    return <p className="text-muted">Page not found.</p>;
  }

  const templateId = manifest.template ?? manifest.config.template ?? 'academic';

  if (templateId === 'showcase') {
    return <ShowcaseContentPage page={page} />;
  }

  return (
    <article>
      <p className="text-muted mb-2 text-sm uppercase tracking-wide">{page.section}</p>
      <h1 className="text-heading mb-6 text-3xl font-bold">{page.title}</h1>
      <MarkdownRenderer content={page.processedBody} />
    </article>
  );
}
