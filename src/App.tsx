import React, { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { DataTable } from './components/DataTable';
import { ProcessedData } from './types';
import mammoth from 'mammoth';
import { extractAmount, isDescription, isTitle, cleanDescription } from './utils/textProcessing';

function App() {
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);

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
            poh: '', // You'll need to implement POH extraction
            notaDate: '' // You'll need to implement date extraction
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
    } catch (error) {
      console.error('Error processing document:', error);
      alert('Error processing document. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
            Aplikasi Olah Data Ms Word
          </h1>
          <p className="text-gray-600 text-lg">
            Upload dokumen Word Anda untuk mengolah data dengan mudah dan cepat
          </p>
        </div>
        
        <div className="flex justify-center">
          <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8 transition-transform hover:scale-[1.02]">
            <FileUpload onFileUpload={processWordDocument} />
          </div>
        </div>

        {processedData && (
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 ease-in-out">
            <DataTable data={processedData.data} title={processedData.title} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="text-gray-600 text-sm">
          Made with <span className="text-red-500">❤️</span> by{' '}
          <span className="font-semibold text-indigo-600">Fatih</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
