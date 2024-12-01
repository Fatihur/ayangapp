export interface TableData {
  no: number;
  name: string;
  poh: string;
  notaDate: string;
  description: string;
  nominal: number;
  total: number;
}

export interface ProcessedData {
  title: string;
  data: TableData[];
}