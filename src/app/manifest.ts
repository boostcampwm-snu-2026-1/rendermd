import type { MetadataRoute } from 'next';

// Required for `output: 'export'` — tell Next to treat the manifest as a
// build-time static asset rather than a runtime route.
export const dynamic = 'force-static';

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'rendermd',
    short_name: 'rendermd',
    description: 'Realtime markdown preview and PDF export for cleaning up LLM-generated text.',
    start_url: `${BASE_PATH}/`,
    scope: `${BASE_PATH}/`,
    display: 'standalone',
    background_color: '#111111',
    theme_color: '#111111',
    icons: [
      {
        src: `${BASE_PATH}/icon.svg`,
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: `${BASE_PATH}/apple-icon.png`,
        sizes: '180x180',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  };
}
