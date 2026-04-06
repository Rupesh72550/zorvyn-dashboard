/**
 * Utility for exporting dashboard data to CSV and JSON formats.
 */

export const exportToCSV = (data, filename = 'transactions-export') => {
  if (!data || data.length === 0) return;

  const headers = ['Date', 'Category', 'Type', 'Amount', 'Description'];
  const csvContent = [
    headers.join(','),
    ...data.map(t => [
      t.date,
      `"${t.category}"`,
      t.type,
      t.amount,
      `"${t.description || ''}"`
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data, filename = 'transactions-export') => {
  if (!data || data.length === 0) return;

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
