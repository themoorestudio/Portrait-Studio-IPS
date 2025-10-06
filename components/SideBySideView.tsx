
import React from 'react';
import { UploadedImage } from '../types';

interface SideBySideViewProps {
  leftImage: UploadedImage;
  rightImage?: UploadedImage;
}

const SideBySideView: React.FC<SideBySideViewProps> = ({ leftImage, rightImage }) => {
  return (
    <div className="flex w-full h-full gap-2 p-2">
      <div className="w-1/2 h-full flex items-center justify-center bg-black">
        <img src={leftImage.dataUrl} alt={leftImage.name} className="max-w-full max-h-full object-contain" />
      </div>
      <div className="w-1/2 h-full flex items-center justify-center bg-black">
        {rightImage ? (
          <img src={rightImage.dataUrl} alt={rightImage.name} className="max-w-full max-h-full object-contain" />
        ) : (
          <div className="text-gray-500 text-2xl">End of gallery</div>
        )}
      </div>
    </div>
  );
};

export default SideBySideView;
