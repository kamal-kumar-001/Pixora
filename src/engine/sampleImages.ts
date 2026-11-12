export interface SampleImage {
  id: string;
  name: string;
  description: string;
  url?: string;
  generateDataUrl: () => string;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'gpay-receipt',
    name: 'GPay Receipt (Your Upload)',
    description: 'UPI payment receipt with ₹5,304, HDFC bank and transaction IDs',
    url: '/samples/gpay_receipt.jpg',
    generateDataUrl: () => '/samples/gpay_receipt.jpg'
  },
  {
    id: 'sale-banner',
    name: 'Mega Sale Banner',
    description: 'Vibrant e-commerce discount promo with distinct typography',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 500;
      const ctx = canvas.getContext('2d')!;

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, 800, 500);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 500);

      // Subtle decorative geometric shapes
      ctx.fillStyle = 'rgba(99, 102, 241, 0.15)';
      ctx.beginPath();
      ctx.arc(700, 100, 160, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(236, 72, 153, 0.12)';
      ctx.beginPath();
      ctx.arc(100, 400, 180, 0, Math.PI * 2);
      ctx.fill();

      // Top Tag
      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(80, 60, 150, 36);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Montserrat", sans-serif';
      ctx.fillText('LIMITED OFFER', 95, 84);

      // Main Headline
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px "Poppins", sans-serif';
      ctx.fillText('SUMMER SALE', 80, 170);

      // Subhead
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 38px "Inter", sans-serif';
      ctx.fillText('UP TO 50% OFF', 80, 230);

      // Body copy
      ctx.fillStyle = '#94a3b8';
      ctx.font = '500 20px "Inter", sans-serif';
      ctx.fillText('Upgrade your creative workflow today.', 80, 280);

      // Button
      ctx.fillStyle = '#4f46e5';
      ctx.beginPath();
      ctx.roundRect(80, 330, 200, 56, 12);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px "Inter", sans-serif';
      ctx.fillText('SHOP NOW', 125, 365);

      return canvas.toDataURL('image/png');
    }
  },
  {
    id: 'quote-card',
    name: 'Minimalist Poster',
    description: 'Editorial serif quote on warm aesthetic background',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 700;
      canvas.height = 600;
      const ctx = canvas.getContext('2d')!;

      // Background
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, 700, 600);

      // Accent border
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1;
      ctx.strokeRect(40, 40, 620, 520);

      // Category
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 14px "Oswald", sans-serif';
      ctx.fillText('DESIGN PHILOSOPHY', 80, 110);

      // Quote Title
      ctx.fillStyle = '#fafafa';
      ctx.font = 'bold 36px "Playfair Display", serif';
      ctx.fillText('Simplicity is the keynote', 80, 190);
      ctx.fillText('of all true elegance.', 80, 240);

      // Author
      ctx.fillStyle = '#a1a1aa';
      ctx.font = 'italic 20px "Lora", serif';
      ctx.fillText('— Coco Chanel', 80, 310);

      // Footer note
      ctx.fillStyle = '#71717a';
      ctx.font = '500 16px "Inter", sans-serif';
      ctx.fillText('Curated Edition • Issue 42', 80, 480);

      return canvas.toDataURL('image/png');
    }
  },
  {
    id: 'badge-card',
    name: 'Product Tech Badge',
    description: 'Clean SaaS badge with prices and version tags',
    generateDataUrl: () => {
      const canvas = document.createElement('canvas');
      canvas.width = 650;
      canvas.height = 450;
      const ctx = canvas.getContext('2d')!;

      // Gradient background
      const grad = ctx.createLinearGradient(0, 0, 650, 450);
      grad.addColorStop(0, '#090d16');
      grad.addColorStop(1, '#0e1726');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 650, 450);

      // Card container
      ctx.fillStyle = '#172033';
      ctx.beginPath();
      ctx.roundRect(60, 50, 530, 350, 16);
      ctx.fill();
      ctx.strokeStyle = '#22304d';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Product Title
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 32px "Inter", sans-serif';
      ctx.fillText('PRO SUBSCRIPTION', 100, 120);

      // Price Tag
      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 50px "Inter", sans-serif';
      ctx.fillText('$29 / month', 100, 190);

      // Detail
      ctx.fillStyle = '#94a3b8';
      ctx.font = '400 18px "Inter", sans-serif';
      ctx.fillText('Unlimited AI Image Text Edits', 100, 245);
      ctx.fillText('Full High-Resolution Export', 100, 275);

      // Badge button
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(100, 315, 180, 46, 8);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px "Inter", sans-serif';
      ctx.fillText('GET STARTED', 135, 344);

      return canvas.toDataURL('image/png');
    }
  }
];
