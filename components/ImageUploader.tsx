import React, { useState } from 'react';
import { UploadedImage } from '../types';
import { UploadIcon } from './Icon';

interface ImageUploaderProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    const uploadedImages: UploadedImage[] = [];

    const filePromises = Array.from(files).map((file: File) => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (typeof e.target?.result === 'string') {
            uploadedImages.push({
              id: `${file.name}-${Date.now()}`,
              name: file.name,
              dataUrl: e.target.result,
              isFavorite: false,
            });
          }
          resolve();
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(filePromises);
    onImagesUploaded(uploadedImages);
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="text-center p-10 border-2 border-dashed border-gray-600 rounded-lg">
        <h1 className="text-4xl font-bold mb-4 text-gray-100">Portrait IPS</h1>
        <p className="text-lg text-gray-400 mb-8">Select your client's images to begin the sales session.</p>
        <label
          htmlFor="file-upload"
          className="relative cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg inline-flex items-center transition-colors duration-300"
        >
          <UploadIcon className="w-6 h-6 mr-3" />
          <span>{isLoading ? 'Loading Images...' : 'Upload Images'}</span>
        </label>
        <input id="file-upload" name="file-upload" type="file" multiple accept="image/jpeg, image/png, image/webp" className="sr-only" onChange={handleFileChange} disabled={isLoading} />
        {isLoading && <div className="mt-4 text-gray-400">Processing... please wait.</div>}
      </div>
    </div>
  );
};

export default ImageUploader;