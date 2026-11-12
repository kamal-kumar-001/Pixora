import { TextBlock } from '../types/editor';

/**
 * Cleanly patches a specific text region on a canvas.
 * It computes the union bounding box of the original text region and any user updates,
 * guaranteeing that the old text underneath is 100% covered with no ghost characters.
 */
export function patchTextBlockOnCanvas(
  ctx: CanvasRenderingContext2D,
  block: TextBlock
): void {
  if (block.showBackgroundPatch === false) return;

  const padX = block.patchPaddingX ?? 6;
  const padY = block.patchPaddingY ?? 4;

  const origX = block.originalX !== undefined ? block.originalX : block.x;
  const origY = block.originalY !== undefined ? block.originalY : block.y;
  const origW = block.originalWidth !== undefined ? block.originalWidth : block.width;
  const origH = block.originalHeight !== undefined ? block.originalHeight : block.height;

  // Union bounding box so both the original position and new position are fully covered
  const minX = Math.min(block.x, origX);
  const minY = Math.min(block.y, origY);
  const maxX = Math.max(block.x + block.width, origX + origW);
  const maxY = Math.max(block.y + block.height, origY + origH);

  const x = Math.max(0, Math.floor(minX - padX));
  const y = Math.max(0, Math.floor(minY - padY));
  const w = Math.min(ctx.canvas.width - x, Math.ceil((maxX - minX) + padX * 2));
  const h = Math.min(ctx.canvas.height - y, Math.ceil((maxY - minY) + padY * 2));

  if (w <= 0 || h <= 0) return;

  ctx.save();
  ctx.fillStyle = block.backgroundColor || '#12141c';
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}
