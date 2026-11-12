export interface BoundingBox {
  x0: number; // left
  y0: number; // top
  x1: number; // right
  y1: number; // bottom
}

export interface TextBlock {
  id: string;
  text: string;
  originalText: string;
  x: number;
  y: number;
  width: number;
  height: number;
  originalX: number;
  originalY: number;
  originalWidth: number;
  originalHeight: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: '400' | '500' | '600' | '700' | '800';
  fontStyle: 'normal' | 'italic';
  color: string;
  backgroundColor: string;
  patchPaddingX: number; // in px
  patchPaddingY: number; // in px
  showBackgroundPatch: boolean;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number; // in px
  lineHeight: number; // multiplier e.g. 1.2
  opacity: number;
  confidence: number;
  isModified: boolean;
  isDeleted?: boolean;
}

export interface EditorImageState {
  originalUrl: string;
  width: number;
  height: number;
  fileName: string;
}

export interface ProcessingProgress {
  status: 'idle' | 'uploading' | 'recognizing' | 'extracting_styles' | 'ready';
  progress: number; // 0 to 100
  message: string;
}
