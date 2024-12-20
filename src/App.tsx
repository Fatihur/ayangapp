import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { ProcessedData } from './types';
import mammoth from 'mammoth';
import { extractAmount, isDescription, isTitle, cleanDescription } from './utils/textProcessing';
import { RotateCcw, Upload, X, HelpCircle } from 'lucide-react';
import AnimatedBackground from './components/AnimatedBackground';
import { AuthModal } from './components/AuthModal';

function App() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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
      {!isAuthenticated ? (
        <AuthModal onAuth={setIsAuthenticated} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4 relative z-10">
              For My Beloved
            </h1>
            <p className="text-sm text-gray-500 mb-2">
              Dibuat khusus untuk <span className="font-medium text-indigo-600">Rizka Irjiba</span> untuk membantu merekap biaya perjalanan.
            </p>
            <p className="text-sm text-gray-500 italic">
              Aplikasi ini udah berulang kali Fatih uji, jadi insyaAllah bener yaa 😊
            </p>
            {!processedData && !showUpload && (
              <div className="max-w-xl mx-auto space-y-6 mt-8">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-xl">
                  <p className="text-gray-600 mb-6 italic">
                    "Semangat ya kerjanya cantik 💕"
                  </p>
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

          {/* Help Button */}
          <button
            onClick={() => setShowHelp(true)}
            className="fixed bottom-8 left-8 z-50 flex items-center gap-2 px-6 py-3 bg-indigo-600/90 backdrop-blur-sm hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all"
          >
            <HelpCircle className="w-5 h-5" />
            <span>Baca ini dulu ya</span>
          </button>

          {/* Help Modal */}
          {showHelp && (
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 max-w-2xl w-full mx-4 relative max-h-[90vh] flex flex-col">
                <button
                  onClick={() => setShowHelp(false)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
                
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Halo ayang 💕</h2>
                <p className="text-gray-600 mb-6">Begini cara pakenya ya:</p>
                
                <div className="space-y-8 overflow-y-auto flex-1 pr-2">
                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 mb-3">Cara Upload dan Lihat Data</h3>
                    <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                      <li>Upload file word nya (yang udah di kasi keterangan yaa)</li>
                      <li className="relative">
                        <p>Pastikan didalam file wordnya tidak ada :</p>
                        <div className="mt-2 mb-4">
                          <img 
                            src="/tabel.png" 
                            alt="Contoh format dokumen" 
                            className="max-w-md rounded-lg shadow-md border border-gray-200"
                          />
                          <p className="text-sm text-gray-500 mt-2">*Tabel Seperti ini</p>
                        </div>
                        <div className="mt-2 mb-4">
                          <img 
                            src="/nama.png" 
                            alt="Contoh format dokumen" 
                            className="max-w-md rounded-lg shadow-md border border-gray-200"
                          />
                          <p className="text-sm text-gray-500 mt-2">*Nama yang sama, hapus yang bawah</p>
                        </div>
                      </li>
                      <li>Tunggu...</li>
                      <li>Datanya terload</li>
                      <li>Tinggal export deh, bisa ke excel atau pdf</li>
                    </ol>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-indigo-600 mb-3">Cara Pakai File Excel</h3>
                    <ol className="list-decimal ml-6 space-y-2 text-gray-600">
                      <li>Buka file excel yang udah di download</li>
                      <li>Kalo muncul peringatan, klik yes</li>
                      <li>Tinggal rapikan dikit, tambah warna, border</li>
                    </ol>
                  </div>

                  <div className="text-center pt-4">
                    <p className="text-lg font-medium text-indigo-600">Selesaiiii~ 🎉</p>
                    <p className="text-sm text-gray-500 mt-2">Kalo ada yang bingung tanya aja ya 😊</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
