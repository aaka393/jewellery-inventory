import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { TableData } from '../types';
import { useAdminStore } from '../stores/adminStore';

const FileUpload: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const {
    uploadParsedProductData,
    isUploading,
    successMessage,
    errorMessage,
    clearMessages,
  } = useAdminStore();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      alert('Please upload a valid CSV or XLSX file.');
      return;
    }

    setUploadedFile(file);
  };

  const parseFile = async () => {
    if (!uploadedFile) return;

    if (uploadedFile.name.endsWith('.csv')) {
      Papa.parse(uploadedFile, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const mapped = mapData(results.data);
          await uploadAndRedirect(mapped);
        },
        error: (error) => {
          alert(`CSV parsing error: ${error.message}`);
        }
      });
    } else {
      const buffer = await uploadedFile.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const parsedData = XLSX.utils.sheet_to_json(worksheet);
      const mapped = mapData(parsedData);
      await uploadAndRedirect(mapped);
    }
  };

  const mapData = (data: any[]): TableData[] => {
    return data.map((row: any) => ({
      id: '', // backend will generate
      name: row['name'] || '',
      category: row['category'] || '',
      description: row['description'] || '',
      price: Number(row['price']) || 0,
      images: [row['image url'] || ''],
      inStock: row['availability']?.toLowerCase() === 'in stock',
      preorderAvailable: false,
      specifications: {
        material: row['material'] || '',
        weight: row['weight'] || '',
        dimensions: row['dimensions'] || '',
        gemstone: row['gemstone'] || '',
      },
      rating: 0,
      reviews: 0,
      featured: false,
    })).filter(item => item.name && item.description && item.price);
  };

  const uploadAndRedirect = async (data: TableData[]) => {
    try {
      await uploadParsedProductData(data);
      setTimeout(() => {
        clearMessages();
        navigate('/data');
      }, 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    clearMessages();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : uploadedFile
            ? 'border-green-300 bg-green-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          className="hidden"
        />

        {!uploadedFile ? (
          <>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Drop your file here, or click to browse
            </h3>
            <p className="text-gray-600 mb-4">Supports CSV and XLSX files with jewelry data</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
            >
              Choose File
            </button>
          </>
        ) : (
          <div className="flex items-center justify-center space-x-4">
            <File className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <p className="font-semibold text-gray-900">{uploadedFile.name}</p>
              <p className="text-sm text-gray-600">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={removeFile}
              className="text-red-600 hover:text-red-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Error */}
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Upload Error</h4>
            <p className="text-red-700 text-sm mt-1">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Success */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Upload Successful</h4>
            <p className="text-green-700 text-sm mt-1">{successMessage}</p>
          </div>
        </div>
      )}

      {/* Process Button */}
      {uploadedFile && (
        <button
          onClick={parseFile}
          disabled={isUploading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center"
        >
          {isUploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Database className="h-4 w-4 mr-2" />
              Import Data
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
