import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ManifestProvider, useManifest } from '@/lib/content/ManifestContext';
import RootLayout from '@/routes/RootLayout';
import HomePage from '@/routes/HomePage';
import SectionIndexPage from '@/routes/SectionIndexPage';
import ContentPage from '@/routes/ContentPage';

function AppRoutes() {
  const manifest = useManifest();
  const basename = manifest.basePath || undefined;

  return (
    <BrowserRouter basename={basename}>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path=":section" element={<SectionIndexPage />} />
          <Route path=":section/" element={<SectionIndexPage />} />
          <Route path=":section/:slug" element={<ContentPage />} />
          <Route path=":section/:slug/" element={<ContentPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <ManifestProvider>
      <AppRoutes />
    </ManifestProvider>
  );
}
