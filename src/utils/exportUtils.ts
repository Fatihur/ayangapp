import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TableData } from '../types';

interface GroupedRow {
  no: number;
  name: string;
  descriptions: {
    poh: string;
    notaDate: string;
    description: string;
    nominal: number;
  }[];
  total: number;
}

const excelStyles = {
  headerFill: { fgColor: { rgb: "1E40AF" }, patternType: 'solid' }, // Darker blue header
  headerFont: { 
    bold: true, 
    color: { rgb: "FFFFFF" },
    sz: 12,
    name: 'Arial'
  },
  totalRowFill: { fgColor: { rgb: "DBEAFE" }, patternType: 'solid' }, // Light blue for total
  totalFont: { 
    bold: true,
    color: { rgb: "1E40AF" },
    sz: 11,
    name: 'Arial'
  },
  borders: {
    thin: {
      top: { style: "thin", color: { rgb: "94A3B8" } },
      bottom: { style: "thin", color: { rgb: "94A3B8" } },
      left: { style: "thin", color: { rgb: "94A3B8" } },
      right: { style: "thin", color: { rgb: "94A3B8" } }
    },
    thick: {
      top: { style: "medium", color: { rgb: "1E40AF" } },
      bottom: { style: "medium", color: { rgb: "1E40AF" } },
      left: { style: "medium", color: { rgb: "1E40AF" } },
      right: { style: "medium", color: { rgb: "1E40AF" } }
    }
  },
  numberFormat: '#,##0.00',
  alignment: {
    vertical: 'center',
    horizontal: 'center'
  }
};

export const groupDataForExport = (data: TableData[]): GroupedRow[] => {
  const groupedMap = new Map<string, GroupedRow>();

  data.forEach(row => {
    const key = `${row.no}-${row.name}`;
    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        no: row.no,
        name: row.name,
        descriptions: [],
        total: row.total
      });
    }
    
    const group = groupedMap.get(key)!;
    group.descriptions.push({
      poh: row.poh,
      notaDate: row.notaDate,
      description: row.description,
      nominal: row.nominal
    });
  });

  return Array.from(groupedMap.values());
};

export const exportToExcel = (data: TableData[], title: string) => {
  // Truncate sheet name to 31 characters and remove invalid characters
  const sanitizeSheetName = (name: string): string => {
    // Remove invalid characters for Excel sheet names
    const sanitized = name.replace(/[*?:/\\[\]]/g, '');
    // Truncate to 31 characters
    return sanitized.slice(0, 31);
  };

  const sheetName = sanitizeSheetName(title);
  const fileName = `${title}.xlsx`; // Keep full title for file name

  const groupedData = groupDataForExport(data);
  const rows: any[] = [];
  let currentRow = 1;

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([]);

  // Headers
  XLSX.utils.sheet_add_aoa(ws, [['No', 'Nama', 'POH', 'Tanggal Nota', 'Deskripsi', 'Nominal', 'Total']], { origin: 'A1' });

  // Apply header styles
  ['A1', 'B1', 'C1', 'D1', 'E1', 'F1', 'G1'].forEach(cell => {
    ws[cell].s = {
      fill: excelStyles.headerFill,
      font: excelStyles.headerFont,
      border: excelStyles.borders.thick,
      alignment: excelStyles.alignment
    };
  });

  let rowIndex = 2;
  groupedData.forEach(group => {
    const startRow = rowIndex;
    const descLength = group.descriptions.length;
    
    group.descriptions.forEach((desc, index) => {
      const row = [
        index === 0 ? group.no : '',
        index === 0 ? group.name : '',
        desc.poh,
        desc.notaDate,
        desc.description,
        desc.nominal,
        index === 0 ? { 
          f: `SUM(F${rowIndex}:F${rowIndex + descLength - 1})`,
          t: 'n',
          z: excelStyles.numberFormat
        } : ''
      ];

      XLSX.utils.sheet_add_aoa(ws, [row], { origin: `A${rowIndex}` });

      // Apply cell styles
      ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
        const cell = `${col}${rowIndex}`;
        ws[cell].s = {
          border: excelStyles.borders.thin,
          alignment: {
            ...excelStyles.alignment,
            horizontal: col === 'E' ? 'left' : 
                       (col === 'F' || col === 'G') ? 'right' : 
                       'center'
          }
        };

        // Apply number format to nominal and total columns
        if (col === 'F' || col === 'G') {
          ws[cell].z = excelStyles.numberFormat;
        }
      });

      rowIndex++;
    });

    // Merge cells for No and Name if multiple descriptions
    if (descLength > 1) {
      if (ws[`A${startRow}`].v) {
        ws['!merges'] = ws['!merges'] || [];
        ws['!merges'].push(
          { s: { r: startRow - 1, c: 0 }, e: { r: startRow + descLength - 2, c: 0 } },
          { s: { r: startRow - 1, c: 1 }, e: { r: startRow + descLength - 2, c: 1 } }
        );
      }
    }
  });

  // Add grand total row
  const grandTotalRow = [
    '', '', '', '', 'Grand Total', '',
    { f: `SUM(G2:G${rowIndex-1})`, t: 'n', z: excelStyles.numberFormat }
  ];
  XLSX.utils.sheet_add_aoa(ws, [grandTotalRow], { origin: `A${rowIndex}` });

  // Style grand total row
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
    const cell = `${col}${rowIndex}`;
    ws[cell].s = {
      fill: excelStyles.totalRowFill,
      font: excelStyles.totalFont,
      border: excelStyles.borders.thick,
      alignment: {
        ...excelStyles.alignment,
        horizontal: col === 'E' ? 'right' : 
                   (col === 'G') ? 'right' : 
                   'center'
      }
    };
  });

  // Set column widths
  ws['!cols'] = [
    { width: 8 },  // No
    { width: 20 }, // Nama
    { width: 15 }, // POH
    { width: 15 }, // Tanggal Nota
    { width: 40 }, // Deskripsi
    { width: 15 }, // Nominal
    { width: 15 }  // Total
  ];

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, fileName);
};

export const exportToPDF = (data: TableData[], title: string) => {
  const groupedData = groupDataForExport(data);
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 15);
  
  const tableRows = groupedData.flatMap(group => {
    return group.descriptions.map((desc, index) => [
      index === 0 ? group.no.toString() : '',
      index === 0 ? group.name : '',
      desc.poh,
      desc.notaDate,
      desc.description,
      desc.nominal.toLocaleString('id-ID', { minimumFractionDigits: 2 }),
      index === 0 ? group.total.toLocaleString('id-ID', { minimumFractionDigits: 2 }) : ''
    ]);
  });

  const grandTotal = groupedData.reduce((sum, group) => sum + group.total, 0);
  tableRows.push(['', '', '', '', 'Grand Total', '', 
    grandTotal.toLocaleString('id-ID', { minimumFractionDigits: 2 })
  ]);

  autoTable(doc, {
    head: [['No', 'Nama', 'POH', 'Tanggal Nota', 'Deskripsi', 'Nominal', 'Total']],
    body: tableRows,
    startY: 25,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [75, 85, 99],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
    columnStyles: {
      0: { cellWidth: 15 },
      1: { cellWidth: 30 },
      2: { cellWidth: 20 },
      3: { cellWidth: 25 },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 30, halign: 'right' },
      6: { cellWidth: 30, halign: 'right' },
    },
    didParseCell: (data) => {
      if (data.row.index === tableRows.length - 1) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [229, 231, 235];
      }
    },
  });

  doc.save(`${title}.pdf`);
};