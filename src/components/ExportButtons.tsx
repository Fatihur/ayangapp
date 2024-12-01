import React, { useState } from 'react';
import { FileSpreadsheet, FileDown, Loader2 } from 'lucide-react';
import { TableData } from '../types';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

interface ExportButtonsProps {
  data: TableData[];
  title: string;
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({ data, title }) => {
  const [isExportingExcel, setIsExportingExcel] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);

  const handleExcelExport = async () => {
    try {
      setIsExportingExcel(true);
      await exportToExcel(data, title);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export Excel file. Please try again.');
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handlePDFExport = async () => {
    try {
      setIsExportingPDF(true);
      await exportToPDF(data, title);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
      alert('Failed to export PDF file. Please try again.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleExcelExport}
        disabled={isExportingExcel || isExportingPDF}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors
          ${isExportingExcel 
            ? 'bg-emerald-50 text-emerald-700 opacity-70 cursor-not-allowed'
            : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
      >
        {isExportingExcel ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileSpreadsheet className="w-4 h-4" />
        )}
        {isExportingExcel ? 'Mengekspor...' : 'Ekspor Excel'}
      </button>
      <button
        onClick={handlePDFExport}
        disabled={isExportingExcel || isExportingPDF}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors
          ${isExportingPDF 
            ? 'bg-red-50 text-red-700 opacity-70 cursor-not-allowed'
            : 'bg-red-50 text-red-700 hover:bg-red-100'
          }`}
      >
        {isExportingPDF ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileDown className="w-4 h-4" />
        )}
        {isExportingPDF ? 'Mengekspor...' : 'Ekspor PDF'}
      </button>
    </div>
  );
};