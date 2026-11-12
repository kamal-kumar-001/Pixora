import { TextBlock } from '../types/editor';

/**
 * Cleanly patches a specific text region on a canvas using its sampled background color
 * with feathered edges, preserving all surrounding graphics and pixels.
 */
export function patchTextBlockOnCanvas(
  ctx: CanvasRenderingContext2D,
  block: TextBlock
): void {
  const pad = 3;
  const x = Math.max(0, Math.floor(block.x - pad));
  const y = Math.max(0, Math.floor(block.y - pad));
  const w = Math.min(ctx.canvas.width - x, Math.ceil(block.width + pad * 2));
  const h = Math.min(ctx.canvas.height - y, Math.ceil(block.height + pad * 2));

  if (w <= 0 || h <= 0) return;

  ctx.save();

  // Create smooth feathered background patch
  ctx.fillStyle = block.backgroundColor || '#12141c';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 2);
  ctx.fill();

  ctx.restore();
}
