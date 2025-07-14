import React, { useState } from 'react';
import { Upload, CheckCircle, AlertCircle, FileText, Database, Download } from 'lucide-react';
import { productService } from '../services/productService';
import { ImportResult } from '../types';
import Button from './ui/Button';

const BulkImport: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setValidationErrors(['Please upload a CSV or XLSX file']);
      return;
    }

    setSelectedFile(file);
    setImportResult(null);
    setValidationErrors([]);
  };

  const validateFile = async () => {
    if (!selectedFile) return;

    setIsValidating(true);
    setValidationErrors([]);

    try {
      const result = await productService.validateImportFile(selectedFile);
      if (!result.valid) {
        setValidationErrors(result.errors);
      }
    } catch (error) {
      setValidationErrors(['Failed to validate file. Please try again.']);
    } finally {
      setIsValidating(false);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setImportResult(null);

    try {
      const result = await productService.importProducts(selectedFile);
      setImportResult(result);
      
      if (result.success) {
        setSelectedFile(null);
      }
    } catch (error) {
      setImportResult({
        success: false,
        message: 'Import failed. Please try again.',
        imported: 0,
        failed: 0,
        errors: ['Network error or server unavailable']
      });
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `description,price,availability,image,category,specifications
"Diamond Solitaire Ring 1.5ct","₹299999","In Stock","https://images.pexels.com/photos/1232931/pexels-photo-1232931.jpeg","Diamond","18k White Gold, 1.5ct Diamond"
"Gold Pearl Necklace","₹89999","Limited Stock","https://images.pexels.com/photos/1454171/pexels-photo-1454171.jpeg","Gold","22k Gold, Freshwater Pearls"
"Silver Drop Earrings","₹12999","In Stock","https://images.pexels.com/photos/1454172/pexels-photo-1454172.jpeg","Silver","925 Sterling Silver, Cubic Zirconia"`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jewelry_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Bulk Product Import</h2>
        <p className="text-gray-600">Upload CSV or Excel files to import multiple products at once</p>
      </div>

      {/* Download Template */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-blue-900 mb-1">Download Template</h3>
            <p className="text-sm text-blue-700">Get the correct format for your import file</p>
          </div>
          <Button
            onClick={downloadTemplate}
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
          >
            Download CSV Template
          </Button>
        </div>
      </div>

      {/* File Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200
          ${dragActive 
            ? 'border-purple-400 bg-purple-50' 
            : selectedFile 
              ? 'border-green-400 bg-green-50' 
              : 'border-gray-300 hover:border-purple-400 hover:bg-purple-50'
          }
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />

        {selectedFile ? (
          <div className="space-y-4">
            <FileText className="h-12 w-12 text-green-600 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{selectedFile.name}</h3>
              <p className="text-gray-600">{(selectedFile.size / 1024).toFixed(1)} KB</p>
            </div>
            
            <div className="flex space-x-3 justify-center">
              <Button
                onClick={validateFile}
                variant="outline"
                isLoading={isValidating}
                disabled={isValidating}
              >
                Validate File
              </Button>
              <Button
                onClick={handleImport}
                isLoading={isUploading}
                disabled={isUploading || validationErrors.length > 0}
                leftIcon={<Database className="h-4 w-4" />}
              >
                Import Products
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="h-12 w-12 text-gray-400 mx-auto" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drop your file here, or click to browse
              </h3>
              <p className="text-gray-600 mb-4">Supports CSV and XLSX files</p>
              <label htmlFor="file-upload">
                <Button as="span" leftIcon={<Upload className="h-4 w-4" />}>
                  Choose File
                </Button>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 mb-2">Validation Errors</h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Import Result */}
      {importResult && (
        <div className={`mt-6 border rounded-lg p-4 ${
          importResult.success 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="flex items-start">
            {importResult.success ? (
              <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
            )}
            <div>
              <h4 className={`font-semibold mb-2 ${
                importResult.success ? 'text-green-900' : 'text-red-900'
              }`}>
                {importResult.success ? 'Import Successful!' : 'Import Failed'}
              </h4>
              <p className={`text-sm mb-2 ${
                importResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {importResult.message}
              </p>
              
              {(importResult.imported > 0 || importResult.failed > 0) && (
                <div className={`text-sm ${
                  importResult.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  <p>✓ Successfully imported: {importResult.imported} products</p>
                  {importResult.failed > 0 && (
                    <p>✗ Failed to import: {importResult.failed} products</p>
                  )}
                </div>
              )}

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-800 mb-1">Errors:</p>
                  <ul className="text-sm text-red-700 space-y-1">
                    {importResult.errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Required Format Info */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Required File Format</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Column</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Required</th>
                <th className="text-left py-2 px-3 font-semibold text-gray-700">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-gray-600">description</td>
                <td className="py-2 px-3 text-green-600">Yes</td>
                <td className="py-2 px-3 text-gray-600">Diamond Solitaire Ring 1.5ct</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-gray-600">price</td>
                <td className="py-2 px-3 text-green-600">Yes</td>
                <td className="py-2 px-3 text-gray-600">₹299999</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-gray-600">availability</td>
                <td className="py-2 px-3 text-green-600">Yes</td>
                <td className="py-2 px-3 text-gray-600">In Stock</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-gray-600">image</td>
                <td className="py-2 px-3 text-green-600">Yes</td>
                <td className="py-2 px-3 text-gray-600">https://example.com/image.jpg</td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-2 px-3 text-gray-600">category</td>
                <td className="py-2 px-3 text-yellow-600">Optional</td>
                <td className="py-2 px-3 text-gray-600">Diamond</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-gray-600">specifications</td>
                <td className="py-2 px-3 text-yellow-600">Optional</td>
                <td className="py-2 px-3 text-gray-600">18k White Gold, 1.5ct Diamond</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BulkImport;