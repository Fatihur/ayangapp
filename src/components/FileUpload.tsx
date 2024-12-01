import React from 'react';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-full max-w-md">
      <label className="group relative flex flex-col items-center px-6 py-8 bg-white rounded-xl shadow-lg cursor-pointer border-2 border-dashed border-gray-300 hover:border-blue-500 transition-all">
        <div className="flex flex-col items-center space-y-3">
          <div className="p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition-colors">
            <Upload className="w-8 h-8 text-blue-500 group-hover:text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 group-hover:text-blue-500">
              Upload Data Word
            </p>
            <p className="text-sm text-gray-500">
              Click to browse or drag and drop
            </p>
          </div>
        </div>
        <input
          type="file"
          className="hidden"
          accept=".doc,.docx"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};