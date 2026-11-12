export interface FontOption {
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
  weights: string[];
}

export const POPULAR_FONTS: FontOption[] = [
  { family: 'Inter', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { family: 'Roboto', category: 'sans-serif', weights: ['400', '500', '700'] },
  { family: 'Montserrat', category: 'sans-serif', weights: ['400', '600', '700', '800'] },
  { family: 'Poppins', category: 'sans-serif', weights: ['400', '600', '700', '800'] },
  { family: 'Open Sans', category: 'sans-serif', weights: ['400', '600', '700'] },
  { family: 'Playfair Display', category: 'serif', weights: ['600', '700'] },
  { family: 'Merriweather', category: 'serif', weights: ['400', '700'] },
  { family: 'Lora', category: 'serif', weights: ['500', '700'] },
  { family: 'Oswald', category: 'display', weights: ['500', '700'] },
  { family: 'Bebas Neue', category: 'display', weights: ['400'] },
];

/**
 * Dynamically loads a Google Font if not already present in the document
 */
export function ensureFontLoaded(fontFamily: string): Promise<void> {
  return new Promise((resolve) => {
    // Check if font already exists in document fonts
    if (document.fonts && document.fonts.check(`16px "${fontFamily}"`)) {
      resolve();
      return;
    }

    const id = `google-font-${fontFamily.toLowerCase().replace(/\s+/g, '-')}`;
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&display=swap`;
    link.onload = () => resolve();
    link.onerror = () => resolve(); // fallback gracefully
    document.head.appendChild(link);
  });
}
