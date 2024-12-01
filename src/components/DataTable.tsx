import React from 'react';
import { TableData } from '../types';
import { ExportButtons } from './ExportButtons';

interface DataTableProps {
  data: TableData[];
  title: string;
}

export const DataTable: React.FC<DataTableProps> = ({ data, title }) => {
  const groupedData = data.reduce((acc: { [key: string]: TableData[] }, row) => {
    const key = `${row.no}-${row.name}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(row);
    return acc;
  }, {});

  // Calculate grand total from unique totals per person
  const grandTotal = Object.values(groupedData).reduce((sum, group) => {
    // Take the total from the first row of each group since all rows in a group have the same total
    return sum + group[0].total;
  }, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title || 'Data Dokumen'}</h2>
            <p className="text-gray-600">
              Total: <span className="font-semibold">{grandTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</span>
            </p>
          </div>
          <ExportButtons data={data} title={title || 'Data Dokumen'} />
        </div>
        
        <div className="overflow-auto max-h-[calc(100vh-280px)] rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="group px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 shadow-sm">
                  <div className="flex items-center space-x-1">
                    <span>No</span>
                  </div>
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="group px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 shadow-sm">POH</th>
                <th className="group px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 shadow-sm">Tanggal Nota</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Keterangan
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 uppercase tracking-wider">
                  Nominal
                </th>
                <th className="group px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider bg-gray-50 shadow-sm">Total</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.values(groupedData).map((group) => {
                const firstRow = group[0];
                return group.map((row, index) => (
                  <tr key={`${row.no}-${index}`} className="hover:bg-gray-50 transition-colors">
                    {index === 0 ? (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50" rowSpan={group.length}>
                          <span className="text-sm font-medium text-gray-900">{row.no}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap bg-gray-50" rowSpan={group.length}>
                          <span className="text-sm font-medium text-gray-900">{row.name}</span>
                        </td>
                      </>
                    ) : null}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.poh}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.notaDate}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{row.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {row.nominal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                    </td>
                    {index === 0 ? (
                      <td className="px-6 py-4 whitespace-nowrap bg-gray-50" rowSpan={group.length}>
                        <span className="text-sm font-semibold text-gray-900">
                          {firstRow.total.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                        </span>
                      </td>
                    ) : null}
                  </tr>
                ));
              })}
              <tr className="bg-gray-100 font-bold">
                <td colSpan={6} className="px-6 py-4 text-right text-sm text-gray-900">
                  Grand Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                  {grandTotal.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};