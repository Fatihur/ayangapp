import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, [onFileUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative cursor-pointer rounded-xl border-2 border-dashed p-8
        transition-all duration-200 ease-in-out
        ${isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-blue-400'
        }
      `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center gap-3">
        <div className={`
          p-3 rounded-full 
          ${isDragActive 
            ? 'bg-blue-100 text-blue-600' 
            : 'bg-blue-50 text-blue-500'
          }
        `}>
          <Upload className="w-6 h-6" />
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-gray-700">
            {isDragActive ? 'Drop your file here' : 'Upload Word Document'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Supports .doc and .docx files
          </p>
        </div>
      </div>
    </div>
  );
};