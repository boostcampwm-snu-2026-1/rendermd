import type { Metadata, Viewport } from 'next';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import './globals.css';
import './themes.css';
import './print.css';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const SITE_NAME = 'rendermd';
const SITE_DESCRIPTION =
  'Realtime markdown preview and PDF export, built for cleaning up LLM-generated markdown.';

export const metadata: Metadata = {
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: 'jay20012024' }],
  keywords: ['markdown', 'pdf', 'preview', 'llm', 'editor', 'export'],
  openGraph: {
    type: 'website',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0d1117' },
  ],
};

// NOTE: storage key and theme literals are duplicated from
// src/contexts/ThemeContext.tsx because this script runs before React loads
// and cannot import TS modules. Keep them in sync.
const themeInitScript = `(function(){try{var t=localStorage.getItem('rendermd:theme');if(t==='light'||t==='dark'||t==='sepia'||t==='hc'){document.documentElement.setAttribute('data-theme',t);}}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        {/*
         * ErrorBoundary deliberately sits OUTSIDE ThemeProvider: if the
         * provider itself throws, the fallback still renders with sensible
         * colors because the inline script above has already applied
         * [data-theme] on <html> before React mounts. The fallback CSS vars
         * resolve against that.
         */}
        <ErrorBoundary>
          <ThemeProvider>{children}</ThemeProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
