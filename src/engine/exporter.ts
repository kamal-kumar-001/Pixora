import { TextBlock } from '../types/editor';
import { ensureFontLoaded } from './fonts';
import { patchTextBlockOnCanvas } from './inpainter';

/**
 * Non-destructive high-resolution export:
 * Keeps 100% of the original image pristine and only patches/re-renders
 * the specific text blocks that the user actually edited or deleted!
 */
export async function exportEditedImage(
  backgroundImg: HTMLImageElement,
  textBlocks: TextBlock[],
  fileName: string = 'typeshift-edited-image.png'
): Promise<void> {
  // Ensure all fonts used by blocks are loaded in document
  const uniqueFonts = Array.from(new Set(textBlocks.map(b => b.fontFamily)));
  await Promise.all(uniqueFonts.map(f => ensureFontLoaded(f)));

  const canvas = document.createElement('canvas');
  canvas.width = backgroundImg.naturalWidth || backgroundImg.width;
  canvas.height = backgroundImg.naturalHeight || backgroundImg.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Draw 100% pristine original base image
  ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  // 2. Only modify blocks that the user actually changed or deleted
  for (const block of textBlocks) {
    if (block.isDeleted) {
      // User requested removing this text
      patchTextBlockOnCanvas(ctx, block);
      continue;
    }

    if (!block.isModified) {
      // Untouched by user: preserve 100% original pixels!
      continue;
    }

    // Block was modified: cleanly patch the background area first
    patchTextBlockOnCanvas(ctx, block);

    if (!block.text.trim()) continue;

    ctx.save();
    ctx.globalAlpha = block.opacity;

    // Build font string
    ctx.font = `${block.fontStyle} ${block.fontWeight} ${block.fontSize}px "${block.fontFamily}", sans-serif`;
    ctx.fillStyle = block.color;
    ctx.textBaseline = 'top';

    const lines = block.text.split('\n');
    const lineHeightPx = block.fontSize * block.lineHeight;

    lines.forEach((line, lineIdx) => {
      const lineY = block.y + lineIdx * lineHeightPx;
      let lineX = block.x;

      if (block.textAlign === 'center') {
        const metrics = ctx.measureText(line);
        lineX = block.x + (block.width - metrics.width) / 2;
      } else if (block.textAlign === 'right') {
        const metrics = ctx.measureText(line);
        lineX = block.x + (block.width - metrics.width);
      }

      // Handle letter spacing
      if (block.letterSpacing > 0) {
        let currentX = lineX;
        for (const char of line) {
          ctx.fillText(char, currentX, lineY);
          currentX += ctx.measureText(char).width + block.letterSpacing;
        }
      } else {
        ctx.fillText(line, lineX, lineY);
      }
    });

    ctx.restore();
  }

  // 3. Trigger download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName.replace(/\.[^/.]+$/, '') + '-edited.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 'image/png');
}
