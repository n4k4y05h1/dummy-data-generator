'use client';

import { useState, useEffect } from 'react';
import { FieldDefinition, GeneratorOptions, OutputFormat, DataType } from '../types/schema';
import { generateData } from '../lib/generators/data-generator';
import { formatOutput } from '../lib/formatters/data-formatter';
import { DataTypeForm } from '../components/forms/DataTypeForm';
import { DataPreview } from '../components/preview/DataPreview';
import { GeneratorOptionsForm } from '../components/forms/GeneratorOptionsForm';
import FileDropzone from '../components/forms/FileDropzone'; // Import FileDropzone
import { Clipboard, Download } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/i18n';

export default function Page() {
  const { language } = useLanguage();
  const [fields, setFields] = useState<FieldDefinition[]>(() => [
    { id: 'default-name', name: 'name', type: 'fullName' },
    { id: 'default-email', name: 'email', type: 'email' },
  ]);
  const [format, setFormat] = useState<OutputFormat>('json');
  const [options, setOptions] = useState<GeneratorOptions>({
    itemCount: 5,
    language: language, // Use language from context
  });
  const [generatedData, setGeneratedData] = useState<string>('');

  // Update options.language when context language changes
  useEffect(() => {
    setOptions(prevOptions => ({ ...prevOptions, language }));
  }, [language]);

  // 初期表示時にデフォルトデータを自動生成
  useEffect(() => {
    const data = generateData(fields, options);
    const formatted = formatOutput(data, format);
    setGeneratedData(formatted);
    
  }, [fields, options, format]); // Add options and format to dependencies

  const handleFieldUpdate = (fields: FieldDefinition[]) => {
    setFields(fields);
  };

  const inferDataType = (value: unknown): DataType => {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) return 'object';
    return 'string'; // Default or unknown type
  };

  const extractSchema = (data: Record<string, unknown>): FieldDefinition[] => {
    return Object.entries(data).map(([key, value]) => {
      const type = inferDataType(value);
      const field: FieldDefinition = {
        id: `${key}-${Date.now()}`, // Simple unique ID
        name: key,
        type: type,
      };

      if (type === 'object' && value !== null) {
        field.fields = extractSchema(value as Record<string, unknown>);
      } else if (type === 'array' && Array.isArray(value) && value.length > 0) {
        // Try to infer item type from the first element
        field.itemType = inferDataType(value[0]);
        // If array of objects, recursively extract schema for items
        if (field.itemType === 'object' && value[0] !== null) {
          field.fields = extractSchema(value[0] as Record<string, unknown>);
        }
      }
      return field;
    });
  };

  const handleFileParsed = (parsedData: unknown) => {
    if (typeof parsedData === 'object' && parsedData !== null) {
      // If the parsed data is an array, take the first element to infer schema
      const dataToInfer = Array.isArray(parsedData) && parsedData.length > 0 ? parsedData[0] : parsedData;
      
      if (typeof dataToInfer === 'object' && dataToInfer !== null) {
        const newFields = extractSchema(dataToInfer as Record<string, unknown>);
        setFields(newFields);
      } else {
        console.error('Parsed data is not an object or array of objects:', parsedData);
        // Optionally, set an error state or clear fields
      }
    } else {
      console.error('Parsed data is not a valid object for schema inference:', parsedData);
      // Optionally, set an error state or clear fields
    }
  };

  return (
    <main className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-4">
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">{getTranslation(language, 'upload_data_definition')}</h2>
            <FileDropzone onFileParsed={handleFileParsed} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">{getTranslation(language, 'data_definition')}</h2>
            <DataTypeForm fields={fields} onUpdate={handleFieldUpdate} />
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <GeneratorOptionsForm
              options={options}
              format={format}
              onUpdate={setOptions}
              onFormatChange={setFormat}
            />
          </div>
        </div>
        <div>
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{getTranslation(language, 'dummy_data')}</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigator.clipboard.writeText(generatedData)}
                  className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                  title={getTranslation(language, 'copy')}
                >
                  <Clipboard className="w-5 h-5 text-gray-700" />
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([generatedData], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `dummy-data.${format}`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="bg-gray-100 p-2 rounded hover:bg-gray-200"
                  title={getTranslation(language, 'download')}
                >
                  <Download className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            </div>
            <DataPreview data={generatedData} format={format} />
          </div>
        </div>
      </div>
    </main>
  );
}
