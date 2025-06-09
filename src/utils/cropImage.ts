import { Area } from 'react-easy-crop';

const getCroppedImg = async (imageSrc: string, crop: Area): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = 'anonymous'; // Untuk menghindari masalah CORS

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('2D context tidak tersedia'));

      ctx.drawImage(
        image,
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

      const base64Image = canvas.toDataURL('image/png');
      resolve(base64Image);
    };

    image.onerror = () => reject(new Error('Gagal memuat gambar'));
  });
};

export default getCroppedImg;