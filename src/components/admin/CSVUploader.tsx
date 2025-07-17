import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import { uploadService } from '../../services/uploadService';
import { apiService } from '../../services/api';
import { Product } from '../../types';

interface CSVUploaderProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface ProcessingStatus {
  stage: 'idle' | 'parsing' | 'uploading-images' | 'creating-products' | 'complete' | 'error';
  progress: number;
  message: string;
  processedCount?: number;
  totalCount?: number;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onSuccess, onError }) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>({
    stage: 'idle',
    progress: 0,
    message: 'Ready to upload'
  });
  const [showPreview, setShowPreview] = useState(false);
  const [parsedProducts, setParsedProducts] = useState<Partial<Product>[]>([]);

  const handleCSVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      onError('Please select a valid CSV file');
    }
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImageFiles(files);
  };

  const parseCSV = async (file: File): Promise<Partial<Product>[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          const products: Partial<Product>[] = lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const product: any = {
              id: `temp_${index}`,
              specifications: {},
              variants: {},
              tags: [],
              images: []
            };
            
            headers.forEach((header, i) => {
              const value = values[i] || '';
              
              switch (header) {
                case 'name':
                  product.name = value;
                  product.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                  break;
                case 'category':
                  product.category = value;
                  break;
                case 'description':
                  product.description = value;
                  break;
                case 'price':
                  product.price = parseFloat(value) || 0;
                  break;
                case 'compare_price':
                  product.comparePrice = parseFloat(value) || undefined;
                  break;
                case 'images':
                  product.images = value ? value.split('|').map(img => img.trim()) : [];
                  break;
                case 'tags':
                  product.tags = value ? value.split('|').map(tag => tag.trim()) : [];
                  break;
                case 'instock':
                  product.inStock = value.toLowerCase() === 'true';
                  break;
                case 'featured':
                  product.featured = value.toLowerCase() === 'true';
                  break;
                case 'noofproducts':
                case 'stock_quantity':
                  product.noOfProducts = parseInt(value) || 0;
                  break;
                case 'weight':
                  product.specifications.weight = value;
                  break;
                case 'material':
                  product.specifications.material = value;
                  break;
                case 'dimensions':
                  product.specifications.dimensions = value;
                  break;
                case 'gemstone':
                  product.specifications.gemstone = value;
                  break;
                case 'metal_type':
                  product.variants.metal = value;
                  break;
                case 'size':
                  product.variants.size = value;
                  break;
                case 'stone_type':
                  product.variants.stone = value;
                  break;
                default:
                  if (header.startsWith('spec_')) {
                    const specKey = header.replace('spec_', '');
                    product.specifications[specKey] = value;
                  }
              }
            });
            
            return product;
          }).filter(p => p.name);
          
          resolve(products);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  };

  const uploadImages = async (imageNames: string[]): Promise<{ [key: string]: string }> => {
    const imageMap: { [key: string]: string } = {};
    
    for (let i = 0; i < imageNames.length; i++) {
      const imageName = imageNames[i];
      const imageFile = imageFiles.find(f => f.name === imageName);
      
      if (imageFile) {
        try {
          const response = await uploadService.uploadFile(imageFile);
          imageMap[imageName] = response.result.url;
          
          setStatus(prev => ({
            ...prev,
            progress: ((i + 1) / imageNames.length) * 50 + 25, // 25-75% for image upload
            message: `Uploading images... ${i + 1}/${imageNames.length}`,
            processedCount: i + 1,
            totalCount: imageNames.length
          }));
        } catch (error) {
          console.warn(`Failed to upload image ${imageName}:`, error);
        }
      }
    }
    
    return imageMap;
  };

  const processUpload = async () => {
    if (!csvFile) {
      onError('Please select a CSV file');
      return;
    }

    try {
      // Stage 1: Parse CSV
      setStatus({
        stage: 'parsing',
        progress: 10,
        message: 'Parsing CSV file...'
      });

      const products = await parseCSV(csvFile);
      setParsedProducts(products);

      // Stage 2: Upload Images
      setStatus({
        stage: 'uploading-images',
        progress: 25,
        message: 'Uploading product images...'
      });

      const allImageNames = products.flatMap(p => p.images || []);
      const uniqueImageNames = [...new Set(allImageNames)];
      const imageMap = await uploadImages(uniqueImageNames);

      // Stage 3: Update products with image URLs
      const productsWithImages = products.map(product => ({
        ...product,
        images: (product.images || []).map(imageName => imageMap[imageName] || imageName)
      }));

      // Stage 4: Create products
      setStatus({
        stage: 'creating-products',
        progress: 75,
        message: 'Creating products in database...'
      });

      await apiService.importProducts(productsWithImages);

      setStatus({
        stage: 'complete',
        progress: 100,
        message: `Successfully imported ${products.length} products!`
      });

      setTimeout(() => {
        onSuccess();
        resetUploader();
      }, 2000);

    } catch (error) {
      console.error('Upload error:', error);
      setStatus({
        stage: 'error',
        progress: 0,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      onError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const resetUploader = () => {
    setCsvFile(null);
    setImageFiles([]);
    setParsedProducts([]);
    setShowPreview(false);
    setStatus({
      stage: 'idle',
      progress: 0,
      message: 'Ready to upload'
    });
  };

  const getStatusIcon = () => {
    switch (status.stage) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Upload className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Bulk Product Upload</h2>
        {status.stage !== 'idle' && (
          <button
            onClick={resetUploader}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* CSV Format Guide */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">CSV Format Requirements:</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Required columns:</strong> name, category, description, price, images, instock</p>
          <p><strong>Optional columns:</strong> tags, featured, noofproducts, weight, material, dimensions, gemstone, compare_price</p>
          <p><strong>Images:</strong> Use | to separate multiple image filenames (e.g., "image1.jpg|image2.jpg")</p>
          <p><strong>Tags:</strong> Use | to separate multiple tags (e.g., "bestseller|trending|new")</p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CSV File *
          </label>
          <input
            type="file"
            accept=".csv"
            onChange={handleCSVChange}
            disabled={status.stage !== 'idle'}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImagesChange}
            disabled={status.stage !== 'idle'}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
          />
          {imageFiles.length > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {imageFiles.length} image(s) selected
            </p>
          )}
        </div>
      </div>

      {/* Status Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">{status.message}</span>
        </div>
        
        {status.stage !== 'idle' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status.stage === 'error' ? 'bg-red-600' : 
                status.stage === 'complete' ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${status.progress}%` }}
            />
          </div>
        )}
        
        {status.processedCount && status.totalCount && (
          <p className="text-xs text-gray-500 mt-2">
            {status.processedCount} of {status.totalCount} processed
          </p>
        )}
      </div>

      {/* Preview Button */}
      {csvFile && parsedProducts.length > 0 && status.stage === 'idle' && (
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="mt-4 text-sm text-purple-600 hover:text-purple-700"
        >
          {showPreview ? 'Hide' : 'Show'} Preview ({parsedProducts.length} products)
        </button>
      )}

      {/* Preview Table */}
      {showPreview && parsedProducts.length > 0 && (
        <div className="mt-4 max-h-64 overflow-y-auto border rounded-lg">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left">Name</th>
                <th className="px-3 py-2 text-left">Category</th>
                <th className="px-3 py-2 text-left">Price</th>
                <th className="px-3 py-2 text-left">Images</th>
                <th className="px-3 py-2 text-left">Tags</th>
              </tr>
            </thead>
            <tbody>
              {parsedProducts.slice(0, 10).map((product, index) => (
                <tr key={index} className="border-t">
                  <td className="px-3 py-2">{product.name}</td>
                  <td className="px-3 py-2">{product.category}</td>
                  <td className="px-3 py-2">₹{product.price}</td>
                  <td className="px-3 py-2">{(product.images || []).length} images</td>
                  <td className="px-3 py-2">{(product.tags || []).join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {parsedProducts.length > 10 && (
            <div className="p-2 text-center text-gray-500 text-xs">
              ... and {parsedProducts.length - 10} more products
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={processUpload}
          disabled={!csvFile || status.stage !== 'idle'}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Products</span>
        </button>
        
        {status.stage !== 'idle' && status.stage !== 'complete' && (
          <button
            onClick={resetUploader}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default CSVUploader;