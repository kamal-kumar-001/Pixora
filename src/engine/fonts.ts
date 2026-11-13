export interface FontOption {
  family: string;
  category: 'sans-serif' | 'serif' | 'display' | 'monospace';
  weights: string[];
}

export const POPULAR_FONTS: FontOption[] = [
  { family: 'Manrope', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { family: 'Plus Jakarta Sans', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { family: 'Outfit', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { family: 'Inter', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { family: 'Roboto', category: 'sans-serif', weights: ['400', '500', '700', '900'] },
  { family: 'Poppins', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { family: 'Montserrat', category: 'sans-serif', weights: ['400', '500', '600', '700', '800'] },
  { family: 'Open Sans', category: 'sans-serif', weights: ['400', '600', '700'] },
  { family: 'Lato', category: 'sans-serif', weights: ['400', '700'] },
  { family: 'DM Sans', category: 'sans-serif', weights: ['400', '500', '700'] },
  { family: 'Playfair Display', category: 'serif', weights: ['600', '700', '800'] },
  { family: 'Merriweather', category: 'serif', weights: ['400', '700'] },
  { family: 'Lora', category: 'serif', weights: ['500', '600', '700'] },
  { family: 'Oswald', category: 'display', weights: ['500', '600', '700'] },
  { family: 'Bebas Neue', category: 'display', weights: ['400'] },
  { family: 'Space Grotesk', category: 'display', weights: ['500', '700'] },
];

/**
 * Dynamically loads a Google Font into document.head
 */
export function ensureFontLoaded(fontFamily: string): Promise<void> {
  return new Promise((resolve) => {
    if (!fontFamily) {
      resolve();
      return;
    }

    const cleanFamily = fontFamily.trim().replace(/^['"]|['"]$/g, '');

    // Check if font already exists in document fonts
    if (document.fonts && document.fonts.check(`16px "${cleanFamily}"`)) {
      resolve();
      return;
    }

    const id = `google-font-${cleanFamily.toLowerCase().replace(/\s+/g, '-')}`;
    if (document.getElementById(id)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFamily)}:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,700&display=swap`;
    link.onload = () => resolve();
    link.onerror = () => resolve(); // graceful fallback
    document.head.appendChild(link);
  });
}

export interface CalculatedTypographyMetrics {
  fontSize: number;
  letterSpacing: number;
  width: number;
  height: number;
}

/**
 * Calculates the exact CSS font size and letter spacing so that rendered vector text
 * matches the precise visual pixel height and width of the text in the original image.
 */
export function calculateExactFontSizeAndMetrics(
  text: string,
  fontFamily: string,
  fontWeight: string,
  targetWidth: number,
  targetHeight: number
): CalculatedTypographyMetrics {
  const cleanFamily = (fontFamily || 'Inter').trim().replace(/^['"]|['"]$/g, '');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx || !text || targetHeight <= 0) {
    const fallbackSize = Math.max(9, Math.round(targetHeight * 0.76));
    return {
      fontSize: fallbackSize,
      letterSpacing: 0,
      width: targetWidth,
      height: targetHeight,
    };
  }

  // 1. Measure at reference size (100px)
  ctx.font = `${fontWeight} 100px "${cleanFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const m100 = ctx.measureText(text);

  // actualBoundingBoxAscent + actualBoundingBoxDescent gives true pixel glyph height
  const ascent100 = m100.actualBoundingBoxAscent || 72;
  const descent100 = m100.actualBoundingBoxDescent || 16;
  const glyphHeight100 = Math.max(20, ascent100 + descent100);
  const glyphWidth100 = Math.max(20, m100.width);

  // 2. Primary target: match height perfectly
  let exactFontSize = Math.round((targetHeight / glyphHeight100) * 100);

  // Check if width overflows significantly at this font size (e.g. condensed headline vs regular font)
  const renderedWidth = (glyphWidth100 / 100) * exactFontSize;
  if (renderedWidth > targetWidth * 1.15 && targetWidth > 30) {
    // Font is wider than the original in image; scale size down slightly so it fits
    const widthConstrainedSize = Math.round((targetWidth / glyphWidth100) * 100);
    // Blend to keep optical balance
    exactFontSize = Math.round(exactFontSize * 0.4 + widthConstrainedSize * 0.6);
  }

  exactFontSize = Math.max(9, Math.min(240, exactFontSize));

  // 3. Measure at calibrated font size to determine letter-spacing
  ctx.font = `${fontWeight} ${exactFontSize}px "${cleanFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  const mFinal = ctx.measureText(text);
  const finalWidth = mFinal.width;

  let letterSpacing = 0;
  if (text.length > 1 && targetWidth > finalWidth) {
    const diff = targetWidth - finalWidth;
    const spacingPerChar = diff / (text.length - 1);
    // Only apply letter spacing if reasonable tracking (up to 4px per character)
    if (spacingPerChar > 0.3 && spacingPerChar <= 4) {
      letterSpacing = Math.round(spacingPerChar * 10) / 10;
    }
  }

  return {
    fontSize: exactFontSize,
    letterSpacing,
    width: Math.max(targetWidth, Math.round(finalWidth + letterSpacing * (text.length - 1))),
    height: Math.max(targetHeight, Math.round(exactFontSize * 1.1)),
  };
}
