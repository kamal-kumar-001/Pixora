import { readFile, writeFile } from 'node:fs/promises';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createServer } from 'vite';

// Render the same landing component at build time, not a second copy of its text.
// The editor remains client-side; this never loads images or calls an AI API.
const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom', optimizeDeps: { noDiscovery: true, entries: [] } });
try {
  const { LandingHero } = await vite.ssrLoadModule('/src/components/LandingHero.tsx');
  const landing = renderToString(React.createElement(LandingHero, { onNavigateToEditor: () => {} }));
  const file = new URL('../dist/index.html', import.meta.url);
  const template = await readFile(file, 'utf8');
  if (!template.includes('<div id="root"></div>')) throw new Error('Missing prerender root');
  await writeFile(file, template.replace('<div id="root"></div>', `<div id="root">${landing}</div>`));
} finally {
  await vite.close();
}
