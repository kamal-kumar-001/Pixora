# Pixora — Next-Gen AI In-Place Image Text Editor

> **Pixora** is a high-performance studio for direct in-place image text editing with zero quality loss. Powered by Google Gemini Vision AI and precision canvas compositing, Pixora detects typography, colors, and spatial bounding boxes to replace text directly in place without blurring backgrounds or destroying logos.

---

## ✨ Key Features

- **Pristine Non-Destructive Base Layer**: Original image quality, logos (UPI, bank badges, icons, checkmarks), and backgrounds are 100% preserved.
- **Multimodal Vision Intelligence**: Powered by Google Gemini 3.1 Flash Vision AI with Tesseract.js local fallback.
- **Pixel-Level Style Analyzer**: Automatically extracts exact foreground text colors, local card background tones, font sizes, and weights.
- **Targeted Non-Destructive Inpainting**: Only patches the union bounding box of modified text blocks with customizable background color, padding, and positioning.
- **Live Typography Controls**: Real-time font family selection (Manrope, Inter, Roboto, Montserrat, Poppins, etc.), size, weight, letter spacing, alignment, and color picker with EyeDropper API.
- **Full-Resolution Export**: Seamlessly merges original graphics with edited typography into a high-res PNG download.
- **Modern Landing Page**: Premium light-theme landing page with 3D interactive hero, designed for UI/UX excellence.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/<your-username>/pixora.git
cd pixora
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
