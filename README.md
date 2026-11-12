# TypeShift AI — In-Place Image Text Editor

> **TypeShift AI** is a browser-native studio for direct in-place image text editing. Upload any screenshot, receipt, banner, or artwork, and edit text directly on the image with matched fonts, colors, and styling while preserving 100% of the image's original resolution, logos, and graphics.

---

## ✨ Key Features

- **Pristine Non-Destructive Base Layer**: Original image quality, logos (UPI, bank badges, icons, checkmarks), and backgrounds are 100% preserved.
- **Client-Side OCR**: Powered by `Tesseract.js` for fast, private, on-device text and layout detection.
- **Pixel-Level Style Analyzer**: Automatically extracts exact foreground text colors, local card background tones, font sizes, and weights.
- **Targeted Non-Destructive Inpainting**: Only patches the specific bounding box of text that you edit or delete; untouched regions remain pixel-perfect.
- **Live Typography Controls**: Real-time font family selection (Google Fonts preloaded: Inter, Roboto, Montserrat, Poppins, etc.), size, weight, letter spacing, alignment, and color picker.
- **Full-Resolution Export**: Seamlessly merges original graphics with edited typography into a high-res PNG download.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/typeshift-ai.git
cd typeshift-ai
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Lucide Icons
- **OCR Engine**: Tesseract.js (Client-Side WASM)
- **Design Philosophy**: Emil Kowalski Design Engineering Standards

---

## 📄 License
MIT License
