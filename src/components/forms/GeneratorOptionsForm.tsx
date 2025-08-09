import { GeneratorOptions, OutputFormat } from '@/types/schema';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/i18n';

interface GeneratorOptionsFormProps {
  options: GeneratorOptions;
  format: OutputFormat;
  onUpdate: (options: GeneratorOptions) => void;
  onFormatChange: (format: OutputFormat) => void;
}
export function GeneratorOptionsForm({
  options,
  format,
  onUpdate,
  onFormatChange,
}: GeneratorOptionsFormProps) {
  const { language } = useLanguage();
  const handleChange = (key: keyof GeneratorOptions, value: string | number | boolean) => {
    onUpdate({ ...options, [key]: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{getTranslation(language, 'generation_settings')}</h2>
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-gray-700 font-medium">{getTranslation(language, 'format')}</label>
          <div className="flex items-center gap-4 mt-2">
            {(['json', 'yaml', 'csv'] as OutputFormat[]).map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="format"
                  value={f}
                  checked={format === f}
                  onChange={() => onFormatChange(f)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-gray-800">{f.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-gray-700 font-medium">{getTranslation(language, 'data_count')}</label>
          <input
            type="number"
            min="1"
            value={options.itemCount}
            onChange={(e) => handleChange('itemCount', parseInt(e.target.value))}
            className="w-24 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        
      </div>
    </div>
  );
}