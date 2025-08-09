import { OutputFormat } from '@/types/schema';
import { ChangeEvent } from 'react';

interface FormatSelectorProps {
  format: OutputFormat;
  onFormatChange: (format: OutputFormat) => void;
}

export function FormatSelector({ format, onFormatChange }: FormatSelectorProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFormatChange(e.target.value as OutputFormat);
  };

  return (
    <select
      value={format}
      onChange={handleChange}
      className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="json">JSON</option>
      <option value="yaml">YAML</option>
      <option value="csv">CSV</option>
    </select>
  );
}
