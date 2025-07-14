import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Upload, RotateCw, Move, ZoomIn, ZoomOut, Download, Share2, Save } from 'lucide-react';
import { useImageStore } from '../stores/imageStore';
import { useProductStore } from '../stores/productStore';
import { useAuthStore } from '../stores/authStore';
import ImageUpload from '../components/ImageUpload';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal from '../components/ui/Modal';

const TryOnPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('product');

  const { isAuthenticated } = useAuthStore();
  const {
    selectedImage,
    currentTryOn,
    isLoading,
    error,
    setSelectedImage,
    uploadImage,
    fetchUserImages,
    createTryOn,
    updateTryOnAdjustments,
    saveTryOnResult,
    shareTryOnResult,
  } = useImageStore();

  const {
    selectedProduct,
    fetchProductById,
  } = useProductStore();

  const [step, setStep] = useState<'upload' | 'select-product' | 'adjust' | 'result'>('upload');
  const [adjustments, setAdjustments] = useState({
    scale: 1,
    rotation: 0,
    position: { x: 0, y: 0 },
  });
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { returnTo: '/try-on' } });
      return;
    }

    fetchUserImages();

    if (productId) {
      fetchProductById(productId);
      setStep('upload');
    }
  }, [isAuthenticated, productId]);

  const handleImageUpload = async (file: File) => {
    try {
      const uploadedImage = await uploadImage(file);
      setSelectedImage(uploadedImage);
      if (selectedProduct) {
        setStep('adjust');
        handleCreateTryOn();
      } else {
        setStep('select-product');
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const handleCreateTryOn = async () => {
    if (!selectedImage || !selectedProduct) return;

    try {
      const result = await createTryOn({
        userImageId: selectedImage.id,
        productId: selectedProduct.id,
        adjustments,
      });
      setStep('result');
    } catch (err) {
      console.error('Try-on failed:', err);
    }
  };

  const handleAdjustmentChange = async (newAdjustments: typeof adjustments) => {
    setAdjustments(newAdjustments);
    
    if (currentTryOn) {
      try {
        await updateTryOnAdjustments(currentTryOn.id, newAdjustments);
      } catch (err) {
        console.error('Failed to update adjustments:', err);
      }
    }
  };

  const handleSave = async () => {
    if (!currentTryOn) return;

    try {
      await saveTryOnResult(currentTryOn.id);
      // Show success message
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  const handleShare = async () => {
    if (!currentTryOn) return;

    try {
      const shareUrl = await shareTryOnResult(currentTryOn.id);
      setShowShareModal(true);
      
      if (navigator.share) {
        await navigator.share({
          title: 'Check out how this jewelry looks on me!',
          url: shareUrl,
        });
      }
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-purple-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back
            </button>
            
            <h1 className="text-2xl font-bold text-gray-900">Virtual Try-On</h1>
            
            <div className="w-20" /> {/* Spacer */}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {['Upload Photo', 'Select Product', 'Adjust Fit', 'View Result'].map((stepName, index) => {
              const stepNumber = index + 1;
              const isActive = 
                (step === 'upload' && stepNumber === 1) ||
                (step === 'select-product' && stepNumber === 2) ||
                (step === 'adjust' && stepNumber === 3) ||
                (step === 'result' && stepNumber === 4);
              const isCompleted = 
                (step !== 'upload' && stepNumber === 1) ||
                (step === 'adjust' || step === 'result') && stepNumber === 2 ||
                (step === 'result' && stepNumber === 3);

              return (
                <div key={stepName} className="flex items-center">
                  <div
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                      ${isActive 
                        ? 'bg-purple-600 text-white' 
                        : isCompleted 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }
                    `}
                  >
                    {stepNumber}
                  </div>
                  <span className={`ml-2 text-sm ${isActive ? 'text-purple-600 font-semibold' : 'text-gray-600'}`}>
                    {stepName}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Panel */}
          <div className="space-y-6">
            {step === 'upload' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Upload Your Photo</h2>
                <ImageUpload
                  onImageSelect={handleImageUpload}
                  isLoading={isLoading}
                />
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Tips for best results:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use a clear, well-lit photo</li>
                    <li>• Face the camera directly</li>
                    <li>• Keep your neck area visible</li>
                    <li>• Avoid wearing jewelry in the photo</li>
                  </ul>
                </div>
              </div>
            )}

            {step === 'select-product' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Jewelry</h2>
                {selectedProduct ? (
                  <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{selectedProduct.name}</h3>
                        <p className="text-gray-600">{selectedProduct.category}</p>
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateTryOn}
                      className="w-full mt-4"
                      isLoading={isLoading}
                    >
                      Try On This Jewelry
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No product selected</p>
                    <Button onClick={() => navigate('/')}>
                      Browse Jewelry
                    </Button>
                  </div>
                )}
              </div>
            )}

            {step === 'adjust' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Adjust Fit</h2>
                <div className="space-y-4">
                  {/* Scale Control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size: {Math.round(adjustments.scale * 100)}%
                    </label>
                    <div className="flex items-center space-x-2">
                      <ZoomOut className="h-4 w-4 text-gray-400" />
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={adjustments.scale}
                        onChange={(e) => handleAdjustmentChange({
                          ...adjustments,
                          scale: parseFloat(e.target.value)
                        })}
                        className="flex-1"
                      />
                      <ZoomIn className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Rotation Control */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rotation: {adjustments.rotation}°
                    </label>
                    <div className="flex items-center space-x-2">
                      <RotateCw className="h-4 w-4 text-gray-400" />
                      <input
                        type="range"
                        min="-45"
                        max="45"
                        step="1"
                        value={adjustments.rotation}
                        onChange={(e) => handleAdjustmentChange({
                          ...adjustments,
                          rotation: parseInt(e.target.value)
                        })}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  {/* Position Controls */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">Horizontal</label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={adjustments.position.x}
                          onChange={(e) => handleAdjustmentChange({
                            ...adjustments,
                            position: { ...adjustments.position, x: parseInt(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Vertical</label>
                        <input
                          type="range"
                          min="-50"
                          max="50"
                          value={adjustments.position.y}
                          onChange={(e) => handleAdjustmentChange({
                            ...adjustments,
                            position: { ...adjustments.position, y: parseInt(e.target.value) }
                          })}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep('result')}
                    className="w-full"
                  >
                    Apply Changes
                  </Button>
                </div>
              </div>
            )}

            {step === 'result' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Virtual Try-On</h2>
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <Button
                      onClick={handleSave}
                      leftIcon={<Save className="h-4 w-4" />}
                      className="flex-1"
                    >
                      Save
                    </Button>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      leftIcon={<Share2 className="h-4 w-4" />}
                      className="flex-1"
                    >
                      Share
                    </Button>
                  </div>
                  
                  <Button
                    onClick={() => setStep('adjust')}
                    variant="outline"
                    className="w-full"
                  >
                    Adjust Again
                  </Button>
                  
                  <Button
                    onClick={() => navigate('/cart')}
                    className="w-full"
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Preview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            
            {isLoading && (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {selectedImage && !isLoading && (
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={currentTryOn?.resultImageUrl || selectedImage.originalUrl}
                  alt="Try-on preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {!selectedImage && !isLoading && (
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Upload a photo to see preview</p>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Your Try-On"
      >
        <div className="p-6">
          <p className="text-gray-600 mb-4">
            Your try-on result has been shared! You can copy the link below:
          </p>
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <code className="text-sm text-gray-800">
              {currentTryOn && `${window.location.origin}/shared/${currentTryOn.id}`}
            </code>
          </div>
          <Button
            onClick={() => setShowShareModal(false)}
            className="w-full"
          >
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TryOnPage;