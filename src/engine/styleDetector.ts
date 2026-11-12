import { BoundingBox } from '../types/editor';

interface StyleDetectionResult {
  textColor: string;
  backgroundColor: string;
  fontSize: number;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  fontStyle: 'normal' | 'italic';
  suggestedFontFamily: string;
}

/**
 * Extracts accurate text and background styling from image canvas pixel data
 */
export function detectTextStyle(
  ctx: CanvasRenderingContext2D,
  bbox: BoundingBox,
  text: string
): StyleDetectionResult {
  const x = Math.max(0, Math.floor(bbox.x0));
  const y = Math.max(0, Math.floor(bbox.y0));
  const w = Math.max(1, Math.ceil(bbox.x1 - bbox.x0));
  const h = Math.max(1, Math.ceil(bbox.y1 - bbox.y0));

  // Get pixel data inside the bounding box
  const imgData = ctx.getImageData(x, y, w, h);
  const data = imgData.data;

  // Sample perimeter border pixels around the box to establish the background baseline
  const borderPixels: [number, number, number][] = [];
  const sampleBorderSize = 4;
  const bx0 = Math.max(0, x - sampleBorderSize);
  const by0 = Math.max(0, y - sampleBorderSize);
  const bw = Math.min(ctx.canvas.width - bx0, w + sampleBorderSize * 2);
  const bh = Math.min(ctx.canvas.height - by0, h + sampleBorderSize * 2);

  const borderImgData = ctx.getImageData(bx0, by0, bw, bh);
  const bData = borderImgData.data;

  // Sample top and bottom rows outside the text
  for (let col = 0; col < bw; col += 2) {
    // Top border
    let idx = (0 * bw + col) * 4;
    borderPixels.push([bData[idx], bData[idx + 1], bData[idx + 2]]);
    // Bottom border
    idx = ((bh - 1) * bw + col) * 4;
    borderPixels.push([bData[idx], bData[idx + 1], bData[idx + 2]]);
  }

  // Calculate median background color
  let bgR = 0, bgG = 0, bgB = 0;
  if (borderPixels.length > 0) {
    for (const [r, g, b] of borderPixels) {
      bgR += r;
      bgG += g;
      bgB += b;
    }
    bgR = Math.round(bgR / borderPixels.length);
    bgG = Math.round(bgG / borderPixels.length);
    bgB = Math.round(bgB / borderPixels.length);
  }

  // Find foreground pixels (pixels inside text box that contrast with background)
  const fgPixels: [number, number, number][] = [];
  let minDiff = 35; // color distance threshold

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue; // ignore transparent pixels

    // Euclidean distance in RGB space
    const dist = Math.sqrt(
      (r - bgR) ** 2 +
      (g - bgG) ** 2 +
      (b - bgB) ** 2
    );

    if (dist > minDiff) {
      fgPixels.push([r, g, b]);
    }
  }

  let textR = 255, textG = 255, textB = 255;
  let strokeRatio = 0.2;

  if (fgPixels.length > 5) {
    // We found distinct foreground text pixels
    strokeRatio = fgPixels.length / (w * h);

    // Calculate average of highest contrasting foreground pixels
    let sumR = 0, sumG = 0, sumB = 0;
    // Sort by contrast distance from background
    fgPixels.sort((p1, p2) => {
      const d1 = Math.sqrt((p1[0] - bgR)**2 + (p1[1] - bgG)**2 + (p1[2] - bgB)**2);
      const d2 = Math.sqrt((p2[0] - bgR)**2 + (p2[1] - bgG)**2 + (p2[2] - bgB)**2);
      return d2 - d1;
    });

    // Take top 60% of contrast pixels to avoid edge anti-aliasing halos
    const topCount = Math.max(1, Math.floor(fgPixels.length * 0.6));
    for (let i = 0; i < topCount; i++) {
      sumR += fgPixels[i][0];
      sumG += fgPixels[i][1];
      sumB += fgPixels[i][2];
    }
    textR = Math.round(sumR / topCount);
    textG = Math.round(sumG / topCount);
    textB = Math.round(sumB / topCount);
  } else {
    // If no strong contrast found, use inverted background
    const bgLuminance = (0.299 * bgR + 0.587 * bgG + 0.114 * bgB) / 255;
    if (bgLuminance > 0.5) {
      textR = 20; textG = 20; textB = 20;
    } else {
      textR = 255; textG = 255; textB = 255;
    }
  }

  const textColor = rgbToHex(textR, textG, textB);
  const backgroundColor = rgbToHex(bgR, bgG, bgB);

  // Estimate font size based on bounding box height
  // Cap-height in modern typefaces is roughly 70-75% of body font size
  const estimatedFontSize = Math.max(12, Math.round(h * 0.78));

  // Estimate weight based on stroke density
  let fontWeight: '400' | '500' | '600' | '700' | '800' = '500';
  if (strokeRatio > 0.35) {
    fontWeight = '800';
  } else if (strokeRatio > 0.25) {
    fontWeight = '700';
  } else if (strokeRatio > 0.15) {
    fontWeight = '600';
  } else {
    fontWeight = '400';
  }

  // Suggest font family:
  // If all caps and tall -> 'Oswald' or 'Montserrat'
  // If long sentence -> 'Inter'
  let suggestedFontFamily = 'Inter';
  const isAllCaps = text.length > 2 && text === text.toUpperCase();
  if (isAllCaps && h > 28) {
    suggestedFontFamily = 'Montserrat';
  } else if (h > 45) {
    suggestedFontFamily = 'Poppins';
  }

  return {
    textColor,
    backgroundColor,
    fontSize: estimatedFontSize,
    fontWeight,
    fontStyle: 'normal',
    suggestedFontFamily,
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.min(255, Math.max(0, n)).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
