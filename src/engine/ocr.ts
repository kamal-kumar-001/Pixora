import { createWorker, Line } from 'tesseract.js';
import { TextBlock, ProcessingProgress } from '../types/editor';
import { detectTextStyle } from './styleDetector';

/**
 * Normalizes common OCR artifacts in digital UI and receipts:
 * - Fixes quote marks inside numbers: "5 ' 3 0, 4" -> "5,304"
 * - Fixes excessive spaces between digits: "5 3 0" -> "530"
 * - Cleans stray punctuation
 */
function cleanRecognizedText(raw: string): string {
  let s = raw.trim();

  // If text looks like a number with broken punctuation:
  // e.g. "35,304" or "5 ' 3 0, 4"
  s = s.replace(/(\d)\s*['`´]\s*(\d)/g, '$1,$2');
  s = s.replace(/(\d)\s+(\d)/g, '$1$2');

  // Strip leading/trailing quote noise
  s = s.replace(/^[«‹'"`\-_.]\s*/, '');
  s = s.replace(/\s*[»›'"`\-_.]+$/, '');

  // If text is "HEH) Hore Bankasss v" -> clean up weird icon noise
  s = s.replace(/^[HEH|(|\]|\[)]+\s*/, '');

  return s.trim();
}

/**
 * Runs Tesseract OCR on an image canvas, detects text blocks with exact coordinates,
 * and extracts typography styles for each block.
 */
export async function runOcrAndExtractStyles(
  canvas: HTMLCanvasElement,
  onProgress?: (p: ProcessingProgress) => void
): Promise<TextBlock[]> {
  onProgress?.({
    status: 'recognizing',
    progress: 15,
    message: 'Initializing AI OCR Engine...',
  });

  const worker = await createWorker('eng', 1, {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        onProgress?.({
          status: 'recognizing',
          progress: Math.round(20 + (m.progress || 0) * 60),
          message: `Analyzing text & typography (${Math.round((m.progress || 0) * 100)}%)...`,
        });
      }
    }
  });

  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) {
    await worker.terminate();
    return [];
  }

  // Request layout blocks & line-level bounding boxes
  const ret = await worker.recognize(canvas, {}, { blocks: true, text: true });
  
  onProgress?.({
    status: 'extracting_styles',
    progress: 85,
    message: 'Extracting typography, colors & layout positions...',
  });

  const blocks: TextBlock[] = [];
  const lines: Line[] = [];

  // Extract all lines hierarchically from blocks -> paragraphs -> lines
  if (ret.data.blocks && ret.data.blocks.length > 0) {
    for (const block of ret.data.blocks) {
      if (block.paragraphs) {
        for (const para of block.paragraphs) {
          if (para.lines) {
            for (const line of para.lines) {
              lines.push(line);
            }
          }
        }
      }
    }
  }

  // Fallback: if lines array directly exists
  if (lines.length === 0 && (ret.data as any).lines) {
    lines.push(...(ret.data as any).lines);
  }

  lines.forEach((line, index) => {
    const rawClean = cleanRecognizedText(line.text);
    // Ignore empty lines or single symbol noise
    if (!rawClean || rawClean.length < 2) return;

    const bbox = line.bbox;
    const width = bbox.x1 - bbox.x0;
    const height = bbox.y1 - bbox.y0;

    // Filter tiny 1-pixel noise artifacts or logos mistaken as tiny text
    if (width < 12 || height < 8) return;

    // Analyze pixel colors and typography style
    const style = detectTextStyle(ctx, bbox, rawClean);

    blocks.push({
      id: `text-block-${Date.now()}-${index}`,
      text: rawClean,
      originalText: rawClean,
      x: bbox.x0,
      y: bbox.y0,
      width: Math.max(width, 30),
      height: Math.max(height, 16),
      originalX: bbox.x0,
      originalY: bbox.y0,
      originalWidth: Math.max(width, 30),
      originalHeight: Math.max(height, 16),
      patchPaddingX: 6,
      patchPaddingY: 4,
      showBackgroundPatch: true,
      fontSize: style.fontSize,
      fontFamily: style.suggestedFontFamily,
      fontWeight: style.fontWeight,
      fontStyle: style.fontStyle,
      color: style.textColor,
      backgroundColor: style.backgroundColor,
      textAlign: 'left',
      letterSpacing: 0,
      lineHeight: 1.15,
      opacity: 1,
      confidence: Math.round(line.confidence),
      isModified: false,
      isDeleted: false,
    });
  });

  await worker.terminate();

  onProgress?.({
    status: 'ready',
    progress: 100,
    message: `Ready! Click any text on the image to edit.`,
  });

  return blocks;
}
