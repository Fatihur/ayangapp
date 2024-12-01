export const extractAmount = (text: string): number => {
  // Remove all spaces and convert to lowercase
  const cleanText = text.toLowerCase().replace(/\s+/g, '');
  
  // Extract numbers, dots, and commas
  const matches = cleanText.match(/[\d.,]+/g);
  if (!matches) return 0;
  
  // Get the last match and clean it
  const amount = matches[matches.length - 1].replace(/[.,]/g, '');
  return parseInt(amount, 10);
};

export const isDescription = (text: string): boolean => {
  const keywords = ['by', 'perjalanan', 'tiket', 'info', 'reaschedule', 'travel', 'penginapan'];
  return keywords.some(keyword => text.toLowerCase().includes(keyword));
};

export const isTitle = (text: string): boolean => {
  return text.toLowerCase().includes('perjalanan');
};

export const cleanDescription = (text: string): string => {
  return text.replace(/perjalanan/gi, '').trim();
};