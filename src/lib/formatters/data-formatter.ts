import { OutputFormat } from '@/types/schema';
import yaml from 'js-yaml';
import Papa from 'papaparse';

export function formatOutput(data: Record<string, unknown>[], format: OutputFormat): string {
  switch (format) {
    case 'json':
      return JSON.stringify(data, null, 2);
    case 'yaml':
      return yaml.dump(data, {
        indent: 2,
        lineWidth: -1,
        skipInvalid: true,
        sortKeys: false
      });
    case 'csv': {
      const flatData: Record<string, string>[] = data.map(item => transformItem(item));
      return Papa.unparse(flatData, {
        header: true,
        skipEmptyLines: true
      });
    }
    default:
      return '';
  }
}

function transformItem(item: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(item).map(([k, v]) => {
      if (v instanceof Date) {
        return [k, v.toISOString()];
      }
      if (typeof v === 'object' && v !== null) {
        // 緯度経度のような { latitude, longitude } オブジェクトはカンマ区切りで出力
        if ('latitude' in v && 'longitude' in v && Object.keys(v).length === 2) {
          return [k, `${(v as { latitude: number, longitude: number }).latitude},${(v as { latitude: number, longitude: number }).longitude}`];
        }
        return [k, JSON.stringify(v)];
      }
      return [k, String(v)];
    })
  );
}
