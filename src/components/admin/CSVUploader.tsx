import React, { useEffect, useState } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, X } from 'lucide-react';
import ProductDialog from './ProductDialog';
import { Category } from '../../types';
import { apiService } from '../../services/api';

interface CSVUploaderProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

interface ProcessingStatus {
  stage: 'idle' | 'uploading' | 'complete' | 'error';
  progress: number;
  message: string;
}

const CSVUploader: React.FC<CSVUploaderProps> = ({ onSuccess, onError }) => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>({
    stage: 'idle',
    progress: 0,
    message: 'Ready to upload'

  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/json'
      ];

      if (allowedTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.xlsx') || file.name.endsWith('.json')) {
        setSelectedFile(file);
        setStatus({
          stage: 'idle',
          progress: 0,
          message: `Selected: ${file.name}`
        });
      } else {
        onError('Please select a valid file (.csv, .xlsx, or .json)');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoryRes] = await Promise.all([
          apiService.getCategories(),
        ]);
        setCategories(categoryRes || []);
      } catch (error) {
        console.error('Error fetching categories or tags:', error);
      }
    };
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!selectedFile) {
      onError('Please select a file first');
      return;
    }

    try {
      setStatus({
        stage: 'uploading',
        progress: 50,
        message: 'Uploading file to server...'
      });

      // Create FormData to send file directly to backend
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Upload file directly to backend
      const response = await fetch('/api/admin/products/bulk-upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }

      const result = await response.json();

      setStatus({
        stage: 'complete',
        progress: 100,
        message: `Successfully uploaded! ${result.message || 'File processed by server.'}`
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
        message: `Error: ${error instanceof Error ? error.message : 'Upload failed'}`
      });
      onError(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setStatus({
      stage: 'idle',
      progress: 0,
      message: 'Ready to upload'
    });
    // Reset file input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const getStatusIcon = () => {
    switch (status.stage) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'uploading':
        return <Upload className="h-5 w-5 text-blue-600 animate-pulse" />;
      default:
        return <Upload className="h-5 w-5 text-blue-600" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Bulk Product Upload</h2>
        <div className="flex items-center gap-3">
          {status.stage !== 'idle' && (
            <button
              onClick={resetUploader}
              className="text-gray-500 hover:text-gray-700"
              title="Reset"
            >
              <X className="h-5 w-5" />
            </button>
          )}
          <button
            onClick={() => setAddDialogOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* File Format Guide */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">Supported File Formats:</h3>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>CSV Files:</strong> Comma-separated values with headers</p>
          <p><strong>Excel Files:</strong> .xlsx format with data in first sheet</p>
          <p><strong>JSON Files:</strong> Array of product objects</p>
          <p className="mt-2 text-blue-700">
            <strong>Note:</strong> The file will be processed directly by the server.
            Make sure your data follows the expected format.
          </p>
        </div>
      </div>

      {/* File Upload Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File *
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.xlsx,.json,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/json"
            onChange={handleFileChange}
            disabled={status.stage === 'uploading'}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 disabled:opacity-50"
          />
          {selectedFile && (
            <div className="mt-2 text-sm text-gray-600">
              <FileText className="h-4 w-4 inline mr-1" />
              {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </div>
          )}
        </div>
      </div>

      {/* Status Display */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3 mb-3">
          {getStatusIcon()}
          <span className="text-sm font-medium text-gray-700">{status.message}</span>
        </div>

        {status.stage === 'uploading' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${status.progress}%` }}
            />
          </div>
        )}

        {status.stage === 'complete' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-green-600 w-full" />
          </div>
        )}

        {status.stage === 'error' && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="h-2 rounded-full bg-red-600 w-full" />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          onClick={handleUpload}
          disabled={!selectedFile || status.stage === 'uploading'}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>{status.stage === 'uploading' ? 'Uploading...' : 'Upload File'}</span>
        </button>

        {status.stage === 'uploading' && (
          <button
            onClick={resetUploader}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
      </div>


      <ProductDialog
        isOpen={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={async (productData) => {
          try {
            await apiService.createProduct(productData);
            onSuccess();
            setAddDialogOpen(false);
          } catch (err) {
            onError(err instanceof Error ? err.message : 'Failed to add product');
          }
        }}
        product={null}
        mode="add"
        categories={categories.map((cat) => cat.name)}
        loading={false}
      />

    </div>
  );
};

export default CSVUploader;