/**
 * Compression d'image côté client avant envoi HTTP.
 * Réduit les gros fichiers JPEG/PNG (ex: 5-10 Mo) à quelques centaines de Ko en WebP
 * afin d'éviter l'erreur 413 "Request Entity Too Large" des reverse proxies (Nginx 1MB).
 */
export function compressImageClient(
  file: File,
  maxDimension = 2500,
  quality = 0.85
): Promise<File> {
  if (typeof window === 'undefined' || !file.type.startsWith('image/')) {
    return Promise.resolve(file);
  }

  // Ne pas compresser les SVG ou petits fichiers déjà optimisés (< 400 Ko)
  if (file.type === 'image/svg+xml' || file.size < 400 * 1024) {
    return Promise.resolve(file);
  }

  return new Promise((resolve): void => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = (): void => {
      URL.revokeObjectURL(url);

      let width = img.naturalWidth || img.width;
      let height = img.naturalHeight || img.height;

      if (!width || !height) {
        resolve(file);
        return;
      }

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
        resolve(file);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob): void => {
          if (!blob || blob.size >= file.size) {
            resolve(file);
            return;
          }

          const webpName = file.name.replace(/\.[^/.]+$/, '') + '.webp';
          const compressed = new File([blob], webpName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        'image/webp',
        quality
      );
    };

    img.onerror = (): void => {
      URL.revokeObjectURL(url);
      resolve(file);
    };

    img.src = url;
  });
}
