import { themeQuartz, type SingleRowSelectionOptions } from 'ag-grid-community';

export const gridTheme = themeQuartz.withParams({
  accentColor: '#1976d2',
  backgroundColor: '#ffffff',
  foregroundColor: '#263238',
  headerBackgroundColor: '#f8fafc',
  headerTextColor: '#607d8b',
  selectedRowBackgroundColor: '#e8f1fd',
  rowHoverColor: '#f5f9ff',
  rowBorder: { color: '#edf1f5' },
  wrapperBorder: false,
  fontFamily: 'Roboto, Arial, sans-serif',
  fontSize: 14,
  headerFontSize: 13,
  spacing: 6,
});

export const singleRowSelection: SingleRowSelectionOptions = {
  mode: 'singleRow',
  enableClickSelection: true,
  checkboxes: false,
};

export function formatDate(value?: string): string {
  return value ? value.split('-').reverse().join('.') : '';
}
