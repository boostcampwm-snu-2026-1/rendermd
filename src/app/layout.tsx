import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import './globals.css';
import './themes.css';
import { ThemeProvider } from '@/contexts/ThemeContext';

export const metadata: Metadata = {
  title: 'rendermd',
  description:
    'Realtime markdown preview and PDF export, built for cleaning up LLM-generated markdown.',
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
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
