import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { ProcessedData } from './types';
import mammoth from 'mammoth';
import { extractAmount, isDescription, isTitle, cleanDescription } from './utils/textProcessing';
import { Upload, X, RotateCcw } from 'lucide-react';
import AnimatedBackground from './components/AnimatedBackground';

function App() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const processWordDocument = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      const lines = result.value.split('\n').filter(line => line.trim());

      let title = 'Hasil';
      const groupedData: { [key: string]: any } = {};
      let currentName = '';
      let no = 1;

      for (const line of lines) {
        if (isTitle(line)) {
          title = cleanDescription(line);
          continue;
        }

        if (!isDescription(line)) {
          currentName = line.trim();
          if (!groupedData[currentName]) {
            groupedData[currentName] = {
              no: no++,
              descriptions: []
            };
          }
        } else if (currentName) {
          const nominal = extractAmount(line);
          groupedData[currentName].descriptions.push({
            description: cleanDescription(line),
            nominal,
            poh: '', 
            notaDate: ''
          });
        }
      }

      const data = Object.entries(groupedData).flatMap(([name, group]: [string, any]) => {
        const total = group.descriptions.reduce((sum: number, desc: any) => sum + desc.nominal, 0);
        return group.descriptions.map((desc: any) => ({
          no: group.no,
          name,
          poh: desc.poh,
          notaDate: desc.notaDate,
          description: desc.description,
          nominal: desc.nominal,
          total
        }));
      });

      setProcessedData({ title, data });
      setShowUpload(false);
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Error processing document. Please try again.');
    }
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setProcessedData(null);
    setShowUpload(false);
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 relative z-10">
            For My Lovely
          </h1>
            <p className="text-sm text-gray-500 mb-2">
              Dibuat khusus untuk <span className="font-medium text-indigo-600">Rizka Irjiba</span> untuk membantu merekap biaya perjalanan.
            </p>
        
          {!processedData && !showUpload && (
            <div className="max-w-xl mx-auto space-y-6 mt-8">
              <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl">
                <FileUpload onFileUpload={processWordDocument} />
                <p className="text-sm text-gray-500 mt-4">
                  Tarik, tempel file, atau klik untuk mengunggah
                </p>
              </div>
            </div>
          )}
        </div>

        {processedData && (
          <>
            <div className="fixed bottom-8 right-8 z-50 flex gap-4">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-6 py-3 bg-gray-600/90 backdrop-blur-sm hover:bg-gray-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset</span>
              </button>
              <button
                onClick={() => setShowUpload(true)}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600/90 backdrop-blur-sm hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                <Upload className="w-5 h-5" />
                <span>Unggah Baru</span>
              </button>
            </div>
            <div className="backdrop-blur-sm bg-white/70 rounded-2xl shadow-xl">
              <DataTable data={processedData.data} title={processedData.title} />
            </div>
          </>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-md w-full mx-4 relative">
              <div className="mb-6 text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Konfirmasi Reset</h2>
                <p className="text-gray-600">
                  Apakah Anda yakin ingin mereset? Ini akan menghapus semua data saat ini.
                </p>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmReset}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600/90 backdrop-blur-sm hover:bg-red-700 rounded-lg transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-md rounded-2xl p-6 max-w-xl w-full mx-4 relative">
              <button
                onClick={() => setShowUpload(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Unggah Dokumen Baru</h2>
                <p className="text-gray-600">Pilih atau tarik dokumen Word baru untuk diproses</p>
              </div>
              <FileUpload onFileUpload={processWordDocument} />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 p-4 text-center bg-gradient-to-t from-white/50 to-transparent backdrop-blur-sm">
        <p className="text-gray-600 text-sm">
          Dibuat dengan <span className="text-red-500 animate-pulse">❤️</span> oleh{' '}
          <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Fatih
          </span>
          {' '}untuk{' '}
          <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
            Rizka Irjiba
          </span>
        </p>
      </div>
    </div>
  );
}

export default App;
