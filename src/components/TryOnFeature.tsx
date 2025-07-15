import React, { useState, useRef } from 'react';
import { Upload, Camera, X } from 'lucide-react';

interface TryOnFeatureProps {
  productImage: string;
  productName: string;
}

const TryOnFeature: React.FC<TryOnFeatureProps> = ({ productImage, productName }) => {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [showTryOn, setShowTryOn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target?.result as string);
        setShowTryOn(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetTryOn = () => {
    setUserImage(null);
    setShowTryOn(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Check if this is neck jewelry (simplified check)
  const isNeckJewelry = productName.toLowerCase().includes('necklace') || 
                       productName.toLowerCase().includes('pendant') ||
                       productName.toLowerCase().includes('chain');

  if (!isNeckJewelry) {
    return null;
  }

  return (
    <div className="bg-purple-50 rounded-lg p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Camera className="h-5 w-5 mr-2 text-purple-600" />
        Try On This Necklace
      </h3>

      {!showTryOn ? (
        <div className="text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center mx-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Your Photo
          </button>
          <p className="text-sm text-gray-600 mt-2">
            Upload a photo to see how this necklace looks on you
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Virtual Try-On Preview</h4>
            <button
              onClick={resetTryOn}
              className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {userImage && (
              <div className="relative">
                <img
                  src={userImage}
                  alt="Your photo"
                  className="w-full h-64 object-cover"
                />
                {/* Mock overlay of jewelry - in a real app, this would use AR/ML */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-20 text-white px-3 py-1 rounded text-sm">
                    Virtual Try-On Preview
                  </div>
                </div>
                <img
                  src={productImage}
                  alt={productName}
                  className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-20 h-20 object-contain opacity-80"
                />
              </div>
            )}
          </div>
          
          <p className="text-xs text-gray-500 text-center">
            This is a mock preview. In a real implementation, this would use AR technology.
          </p>
        </div>
      )}
    </div>
  );
};

export default TryOnFeature;