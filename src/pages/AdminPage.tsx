import React from 'react';
import { Upload, FileSpreadsheet, AlertCircle, Gem } from 'lucide-react';
import FileUpload from '../components/FileUpload';
import { TableData } from '../types';

interface AdminPageProps {
  onDataParsed: (data: TableData[]) => void;
}

const AdminPage: React.FC<AdminPageProps> = ({ onDataParsed }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-8 py-6">
          <div className="flex items-center">
            <Gem className="h-8 w-8 text-white mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-white">Jewelry Import</h1>
              <p className="text-purple-100 mt-1">Upload your CSV or Excel files to import jewelry inventory</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Info Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <div className="flex items-start">
                <FileSpreadsheet className="h-6 w-6 text-purple-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-purple-900 mb-2">Supported Formats</h3>
                  <p className="text-purple-700 text-sm">
                    Upload .CSV or .XLSX files with your jewelry inventory data
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-amber-600 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">Required Columns</h3>
                  <p className="text-amber-700 text-sm">
                    Description, Price, Availability, Image (jewelry photos)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Component */}
          <FileUpload onDataParsed={onDataParsed} />

          {/* Example Format */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Expected Jewelry Data Format</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-300">
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Description</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Price</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Availability</th>
                    <th className="text-left py-2 px-3 font-semibold text-gray-700">Image</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-2 px-3 text-gray-600">Diamond Solitaire Ring 1.5ct</td>
                    <td className="py-2 px-3 text-gray-600">$2,999.99</td>
                    <td className="py-2 px-3 text-gray-600">In Stock</td>
                    <td className="py-2 px-3 text-gray-600">https://example.com/diamond-ring.jpg</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-gray-600">Gold Pearl Necklace</td>
                    <td className="py-2 px-3 text-gray-600">$899.99</td>
                    <td className="py-2 px-3 text-gray-600">Limited Stock</td>
                    <td className="py-2 px-3 text-gray-600">https://example.com/pearl-necklace.jpg</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;