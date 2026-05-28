import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github.css';
import './globals.css';

export const metadata: Metadata = {
  title: 'rendermd',
  description:
    'Realtime markdown preview and PDF export, built for cleaning up LLM-generated markdown.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
