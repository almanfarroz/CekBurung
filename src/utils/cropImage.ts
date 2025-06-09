import { Area } from 'react-easy-crop';

const getCroppedImg = async (image: string, crop: Area): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) throw new Error('2D context tidak tersedia');

    const imageSrc = new Image();
    imageSrc.src = image;
    
    imageSrc.onload = function (){
      canvas.width = crop.width;
      canvas.height = crop.height;
      context.drawImage(
        imageSrc, 
        crop.x,
        crop.y,
        crop.width,
        crop.height,
        0,
        0,
        crop.width,
        crop.height
      );

    const croppedUrl = canvas.toDataURL('image/png');
    resolve(croppedUrl);
    };

    imageSrc.onerror = () => reject(new Error('Gagal memuat gambar'));
  });
};

export default getCroppedImg;