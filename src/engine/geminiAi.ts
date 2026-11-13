import { TextBlock, ProcessingProgress } from '../types/editor';
import { calculateExactFontSizeAndMetrics, ensureFontLoaded } from './fonts';

export function getGeminiApiKey(): string {
  // Read from .env via Vite environment variables or localStorage override
  return (
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.GEMINI_API_KEY ||
    localStorage.getItem('pixora_gemini_key') ||
    ''
  );
}

export function setGeminiApiKey(key: string): void {
  localStorage.setItem('pixora_gemini_key', key.trim());
}

interface GeminiDetectedItem {
  text: string;
  box_2d: [number, number, number, number]; // [ymin, xmin, ymax, xmax] 0-1000
  fontFamily?: string;
  fontWeight?: '400' | '500' | '600' | '700' | '800';
  textColor?: string;
  backgroundColor?: string;
  estimatedSoftness?: 'sharp' | 'slightly_soft' | 'scanned_receipt' | 'blurry';
}

/**
 * Uses Gemini 3.1 Flash Vision AI to accurately recognize all text,
 * bounding boxes, typography, colors, and background patches in the image.
 */
export async function detectTextWithGemini(
  canvas: HTMLCanvasElement,
  onProgress?: (p: ProcessingProgress) => void
): Promise<TextBlock[]> {
  onProgress?.({
    status: 'recognizing',
    progress: 25,
    message: 'Analyzing image with Gemini Vision AI...',
  });

  const apiKey = getGeminiApiKey();
  const b64Data = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];

  const prompt = `Analyze all readable text in this image for an in-place image text editor.
Identify the exact typography and visual style of each text piece.
Return a valid JSON array of objects with the exact structure:
[
  {
    "text": "exact text string (preserve currency symbols like ₹, $, €)",
    "box_2d": [ymin, xmin, ymax, xmax], // normalized coordinates from 0 to 1000 (tight bounding box around the glyphs)
    "fontFamily": "Manrope" | "Plus Jakarta Sans" | "Outfit" | "Inter" | "Roboto" | "Poppins" | "Montserrat" | "Open Sans" | "Playfair Display" | "Oswald" | "Bebas Neue",
    "fontWeight": "400" | "500" | "600" | "700" | "800",
    "textColor": "#hex color of the text (e.g. #FFFFFF or #1E293B)",
    "backgroundColor": "#hex color of the surface right behind this text",
    "estimatedSoftness": "sharp" | "slightly_soft" | "scanned_receipt" | "blurry"
  }
]
CRITICAL INSTRUCTIONS:
- Bounding Box: box_2d MUST be the tight enclosing box [ymin, xmin, ymax, xmax] of the visible letters/symbols from top edge to bottom edge.
- Font Family Classification:
  * For clean modern geometric sans (like Google Pay, payment apps, modern SaaS): choose "Manrope", "Plus Jakarta Sans", or "Outfit".
  * For standard neutral sans: choose "Roboto" or "Inter".
  * For friendly rounded/humanist sans: choose "Poppins" or "Montserrat".
  * For condensed bold display headlines: choose "Oswald" or "Bebas Neue".
  * For high-contrast serif headlines: choose "Playfair Display".
- Determine true fontWeight: '400' (regular), '500' (medium), '600' (semibold), '700' (bold), or '800' (extrabold).
- Do NOT detect icons, logos, bank logos, avatars, checkmarks, or status badges as text. Only detect actual alphanumeric copy and currency amounts.
- Return ONLY the JSON array without markdown formatting.`;

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: b64Data } }
        ]
      }
    ],
    generationConfig: {
      responseMimeType: 'application/json'
    }
  };

  // Try local proxy first to avoid any CORS issues, fallback to direct endpoint
  const urls = [
    `/api/gemini/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`,
  ];

  let rawJson = '';

  for (const url of urls) {
    try {
      onProgress?.({
        status: 'recognizing',
        progress: 60,
        message: 'Reconstructing typography and layout...',
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        console.warn(`Request to ${url} failed with status:`, res.status);
        continue;
      }

      const data = await res.json();
      rawJson = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (rawJson) break;
    } catch (e) {
      console.warn('Fetch error on url:', url, e);
    }
  }

  if (!rawJson) {
    throw new Error('Gemini Vision API did not return text content.');
  }

  onProgress?.({
    status: 'extracting_styles',
    progress: 85,
    message: 'Building interactive text layers...',
  });

  const parsed: GeminiDetectedItem[] = JSON.parse(rawJson);
  const blocks: TextBlock[] = [];
  const imgW = canvas.width;
  const imgH = canvas.height;

  for (let index = 0; index < parsed.length; index++) {
    const item = parsed[index];
    if (!item.text || !item.box_2d || item.box_2d.length !== 4) continue;

    const [ymin, xmin, ymax, xmax] = item.box_2d;
    const x = Math.round((xmin / 1000) * imgW);
    const y = Math.round((ymin / 1000) * imgH);
    const width = Math.max(20, Math.round(((xmax - xmin) / 1000) * imgW));
    const height = Math.max(12, Math.round(((ymax - ymin) / 1000) * imgH));

    const fontFamily = item.fontFamily || 'Manrope';
    const fontWeight = item.fontWeight || '700';

    // Ensure font is loaded into the browser document
    ensureFontLoaded(fontFamily);

    // Calculate exact font size and letter spacing matching the visual pixel dimensions
    const metrics = calculateExactFontSizeAndMetrics(
      item.text,
      fontFamily,
      fontWeight,
      width,
      height
    );

    // Configure initial blur and degradation based on image texture softness
    let initialBlur = 0.2;
    let initialDegradation = 8;

    if (item.estimatedSoftness === 'scanned_receipt') {
      initialBlur = 0.4;
      initialDegradation = 22;
    } else if (item.estimatedSoftness === 'blurry') {
      initialBlur = 1.2;
      initialDegradation = 30;
    } else if (item.estimatedSoftness === 'slightly_soft') {
      initialBlur = 0.3;
      initialDegradation = 12;
    } else if (item.estimatedSoftness === 'sharp') {
      initialBlur = 0;
      initialDegradation = 0;
    }

    blocks.push({
      id: `ai-block-${Date.now()}-${index}`,
      text: item.text,
      originalText: item.text,
      x,
      y,
      width: Math.max(width, metrics.width),
      height: Math.max(height, metrics.height),
      originalX: x,
      originalY: y,
      originalWidth: Math.max(width, metrics.width),
      originalHeight: Math.max(height, metrics.height),
      patchPaddingX: 6,
      patchPaddingY: 4,
      showBackgroundPatch: true,
      fontSize: metrics.fontSize,
      fontFamily,
      fontWeight,
      fontStyle: 'normal',
      color: item.textColor || '#ffffff',
      backgroundColor: item.backgroundColor || '#12141c',
      textAlign: 'left',
      letterSpacing: metrics.letterSpacing,
      lineHeight: 1,
      opacity: 1,
      blur: initialBlur,
      degradation: initialDegradation,
      confidence: 99,
      isModified: false,
      isDeleted: false,
    });
  }

  return blocks;
}

/**
 * AI Assistant that modifies text layers based on a natural language instruction
 * (e.g. "Change the payment amount to ₹15,000", "Change date to today", "Translate to Hindi")
 */
export async function applyAiRewritePrompt(
  instruction: string,
  blocks: TextBlock[]
): Promise<TextBlock[]> {
  const apiKey = getGeminiApiKey();
  const summary = blocks
    .filter(b => !b.isDeleted)
    .map(b => ({ id: b.id, text: b.text }));

  const prompt = `You are an AI image text editor.
User instruction: "${instruction}"

Current active text layers in the image:
${JSON.stringify(summary, null, 2)}

Return a JSON array of the layers that need to be changed:
[
  {
    "id": "exact block id",
    "newText": "the replacement text"
  }
]
Only return layers that should be modified according to the instruction. Return ONLY valid JSON array.`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { responseMimeType: 'application/json' }
  };

  const url = `/api/gemini/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error('AI prompt request failed');
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) return blocks;

  const updates: { id: string; newText: string }[] = JSON.parse(text);
  const updateMap = new Map(updates.map(u => [u.id, u.newText]));

  return blocks.map(b => {
    if (updateMap.has(b.id)) {
      return {
        ...b,
        text: updateMap.get(b.id)!,
        isModified: true,
      };
    }
    return b;
  });
}
