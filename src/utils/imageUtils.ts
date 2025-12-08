import { RGB } from './colorUtils';

/**
 * Processes an image file and returns pixel data resized to target dimensions.
 */
export const processImage = (
  imageUrl: string,
  targetWidth: number,
  targetHeight: number
): Promise<RGB[]> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Use high quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw and resize image
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
      const pixels = imageData.data;
      const rgbPixels: RGB[] = [];

      for (let i = 0; i < pixels.length; i += 4) {
        rgbPixels.push({
          r: pixels[i],
          g: pixels[i + 1],
          b: pixels[i + 2],
          // Alpha channel ignored for now, assuming opaque bricks
        });
      }

      resolve(rgbPixels);
    };

    img.onerror = (err) => reject(err);
  });
};

/**
 * Creates a cropped image from a source URL and crop area.
 */
export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Canvas is empty'));
            return;
          }
          resolve(window.URL.createObjectURL(blob));
        },
        'image/jpeg'
      );
    };

    image.onerror = (error) => reject(error);
  });
};
