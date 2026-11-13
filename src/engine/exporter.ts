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
  fileName: string = 'pixora-edited-image.png'
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

  // 2. Only modify blocks that were actually changed or deleted
  for (const block of textBlocks) {
    const isChanged = block.isModified || block.text !== block.originalText || block.isDeleted;

    if (!isChanged) {
      // Untouched by user: preserve 100% original pixels!
      continue;
    }

    // Always patch the original text bounding box first
    patchTextBlockOnCanvas(ctx, block);

    if (block.isDeleted || !block.text.trim()) {
      continue;
    }

    ctx.save();
    ctx.globalAlpha = block.opacity;

    // Use robust font stack so special unicode characters (like ₹) always render cleanly
    ctx.font = `${block.fontStyle} ${block.fontWeight} ${block.fontSize}px "${block.fontFamily}", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`;
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

    // Apply authentic pixel degradation / grain to match original compressed image texture
    if (block.degradation && block.degradation > 0) {
      const boxX = Math.max(0, Math.floor(block.x - 2));
      const boxY = Math.max(0, Math.floor(block.y - 2));
      const boxW = Math.min(canvas.width - boxX, Math.ceil(block.width + 4));
      const boxH = Math.min(canvas.height - boxY, Math.ceil(block.height + 4));

      if (boxW > 0 && boxH > 0) {
        const patchData = ctx.getImageData(boxX, boxY, boxW, boxH);
        const data = patchData.data;
        const noiseFactor = (block.degradation / 100) * 36;

        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 20) {
            const noise = (Math.random() - 0.5) * noiseFactor;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
          }
        }
        ctx.putImageData(patchData, boxX, boxY);
      }
    }
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
