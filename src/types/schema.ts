export type DataType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'date'
  | 'email'
  | 'phone'
  | 'address'
  | 'fullName'
  | 'company'
  | 'department'
  | 'sales'
  | 'percentage'
  | 'productCode'
  | 'currency'
  | 'ipAddress'
  | 'url'
  | 'color'
  | 'creditCard'
  | 'latLong'
  | 'object'
  | 'array';

export interface FieldDefinition {
  id: string;
  name: string;
  type: DataType;
  options?: Record<string, unknown> & {
    ipVersion?: 'IPv4' | 'IPv6';
    latLongType?: 'latitude' | 'longitude' | 'both';
    currencyType?: 'yen' | 'dollar';
  };
  fields?: FieldDefinition[]; // For type 'object'
  itemType?: DataType; // For type 'array'
}

export interface DataSetDefinition {
  name: string;
  fields: FieldDefinition[];
}

export interface GeneratorOptions {
  itemCount: number;
  language: 'en' | 'ja';
}

export type OutputFormat = 'json' | 'yaml' | 'csv';

export type GeneratedData = Record<string, unknown>[];
