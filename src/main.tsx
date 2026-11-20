import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const root = document.getElementById('root')!;
const app = <React.StrictMode><App /></React.StrictMode>;
// Only the public landing has build-time HTML. Direct editor visits render the
// editor normally rather than trying to hydrate landing markup as editor UI.
if (root.hasChildNodes() && window.location.pathname === '/' && window.location.hash !== '#edit') {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}
