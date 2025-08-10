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
  options?: {
    arrayLength?: number;
    ipVersion?: 'IPv4' | 'IPv6';
    latLongType?: 'latitude' | 'longitude' | 'both';
    currencyType?: 'yen' | 'dollar';
    [key: string]: unknown;
  };
  fields?: FieldDefinition[]; // For type 'object'
  itemDefinition?: FieldDefinition; // For type 'array'
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
