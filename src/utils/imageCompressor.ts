/**
 * Utility to compress images in-browser before upload (max width/height 1280px).
 * Reduces upload payload significantly for slow 3G/4G connections.
 */

export interface CompressionResult {
  dataUrl: string;
  originalSize: number;
  compressedSize: number;
  reductionPercentage: number;
}

export async function compressImageFile(file: File, maxDimension = 1280, quality = 0.82): Promise<CompressionResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Erreur lors de la lecture du fichier photo'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Erreur lors du décodage de l\'image'));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: e.target?.result as string,
            originalSize: file.size,
            compressedSize: file.size,
            reductionPercentage: 0,
          });
          return;
        }

        // Draw with smoothing for high fidelity
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        // Estimate size from base64 length
        const base64Length = compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
        const compressedSize = Math.round((base64Length * 3) / 4);
        const reduction = Math.max(0, Math.round(((file.size - compressedSize) / file.size) * 100));

        resolve({
          dataUrl: compressedDataUrl,
          originalSize: file.size,
          compressedSize,
          reductionPercentage: reduction,
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
