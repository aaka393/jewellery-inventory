import React, { useState, useRef } from 'react';
import { Upload, File, CheckCircle, AlertCircle, X, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { TableData } from '../types';

interface FileUploadProps {
  onDataParsed: (data: TableData[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataParsed }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
      setError('Please upload a CSV or XLSX file');
      return;
    }

    setUploadedFile(file);
    setError(null);
    setSuccess(false);
  };

  const parseFile = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      let parsedData: any[] = [];

      if (uploadedFile.name.endsWith('.csv')) {
        // Parse CSV
        Papa.parse(uploadedFile, {
          header: true,
          complete: (results) => {
            parsedData = results.data;
            processData(parsedData);
          },
          error: (error) => {
            setError(`CSV parsing error: ${error.message}`);
            setIsLoading(false);
          }
        });
      } else {
        // Parse XLSX
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        parsedData = XLSX.utils.sheet_to_json(worksheet);
        processData(parsedData);
      }
    } catch (err) {
      setError('Failed to parse file. Please check the format.');
      setIsLoading(false);
    }
  };

  const processData = (data: any[]) => {
    try {
      const requiredColumns = ['description', 'price', 'availability', 'image'];
      
      if (data.length === 0) {
        setError('The file appears to be empty');
        setIsLoading(false);
        return;
      }

      // Check if required columns exist (case insensitive)
      const firstRow = data[0];
      const columnNames = Object.keys(firstRow).map(key => key.toLowerCase());
      
      const missingColumns = requiredColumns.filter(col => 
        !columnNames.some(name => name.includes(col))
      );

      if (missingColumns.length > 0) {
        setError(`Missing required columns: ${missingColumns.join(', ')}`);
        setIsLoading(false);
        return;
      }

      // Map data to consistent format
      const mappedData: TableData[] = data.map((row: any) => {
        const keys = Object.keys(row);
        return {
          id: '', // Will be set in App.tsx
          description: row[keys.find(key => key.toLowerCase().includes('description')) || ''] || '',
          price: row[keys.find(key => key.toLowerCase().includes('price')) || ''] || '',
          availability: row[keys.find(key => key.toLowerCase().includes('availability')) || ''] || '',
          image: row[keys.find(key => key.toLowerCase().includes('image')) || ''] || ''
        };
      }).filter(item => item.description && item.price); // Filter out empty rows

      onDataParsed(mappedData);
      setSuccess(true);
      setIsLoading(false);

      // Navigate to data page after 1.5 seconds
      setTimeout(() => {
        navigate('/data');
      }, 1500);

    } catch (err) {
      setError('Failed to process data. Please check your file format.');
      setIsLoading(false);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setError(null);
    setSuccess(false);
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
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
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
              className="text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Upload Error</h4>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
          <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-green-900">Upload Successful</h4>
            <p className="text-green-700 text-sm mt-1">File processed successfully. Redirecting to data view...</p>
          </div>
        </div>
      )}

      {/* Process Button */}
      {uploadedFile && !success && (
        <button
          onClick={parseFile}
          disabled={isLoading}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
        >
          {isLoading ? (
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