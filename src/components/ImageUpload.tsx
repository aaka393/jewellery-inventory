import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { validateImageFile, createImagePreview } from '../utils/imageUtils';
import Button from './ui/Button';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onImageRemove?: () => void;
  currentImage?: string;
  isLoading?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImageSelect,
  onImageRemove,
  currentImage,
  isLoading = false,
  className = "",
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateImageFile(file);

    if (!validation.isValid) {
      setError(validation.error || 'Invalid file');
      return;
    }

    setError(null);
    
    try {
      const previewUrl = await createImagePreview(file);
      setPreview(previewUrl);
      onImageSelect(file);
    } catch (err) {
      setError('Failed to process image');
    }
  }, [onImageSelect]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    onImageRemove?.();
  };

  return (
    <div className={`w-full ${className}`}>
      {preview ? (
        <div className="relative">
          <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <button
                onClick={handleRemove}
                className="opacity-0 hover:opacity-100 transition-opacity duration-200 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
            ${dragActive 
              ? 'border-purple-400 bg-purple-50' 
              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
            }
            ${error ? 'border-red-400 bg-red-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isLoading}
          />
          
          <div className="flex flex-col items-center">
            {error ? (
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
            ) : (
              <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            )}
            
            <h3 className={`text-lg font-semibold mb-2 ${error ? 'text-red-700' : 'text-gray-900'}`}>
              {error ? 'Upload Error' : 'Upload Your Photo'}
            </h3>
            
            <p className={`text-sm mb-4 ${error ? 'text-red-600' : 'text-gray-600'}`}>
              {error || 'Drag and drop your image here, or click to browse'}
            </p>
            
            {!error && (
              <Button
                variant="outline"
                leftIcon={<Upload className="h-4 w-4" />}
                isLoading={isLoading}
                disabled={isLoading}
              >
                Choose File
              </Button>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
      
      <p className="mt-2 text-xs text-gray-500">
        Supported formats: JPEG, PNG, WebP. Max size: 10MB
      </p>
    </div>
  );
};

export default ImageUpload;