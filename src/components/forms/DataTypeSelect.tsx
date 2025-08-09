import { DataType } from '@/types/schema';
import { ChangeEvent } from 'react';
import { dataTypeCategories } from '@/lib/constants';
import { useLanguage } from '@/context/LanguageContext';
import { getTranslation } from '@/lib/i18n';

interface DataTypeSelectProps {
  value: DataType;
  onChange: (value: DataType) => void;
  allowNestedTypes?: boolean; // New prop
}

export function DataTypeSelect({ value, onChange, allowNestedTypes = true }: DataTypeSelectProps) {
  const { language } = useLanguage();
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value as DataType);
  };

  return (
    <select
      value={value}
      onChange={handleChange}
      className="w-full p-2 border rounded"
    >
      {Object.entries(dataTypeCategories).map(([category, { labelKey, types }]) => (
        <optgroup key={category} label={getTranslation(language, labelKey)}>
          {types
            .filter(type => allowNestedTypes || (type.value !== 'object' && type.value !== 'array'))
            .map((type) => (
              <option key={type.value} value={type.value}>
                {getTranslation(language, type.labelKey)}
              </option>
            ))}
        </optgroup>
      ))}
    </select>
  );
}
