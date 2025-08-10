import { Faker, en, ja } from '@faker-js/faker';
import { FieldDefinition, GeneratorOptions } from '@/types/schema';

const fakerMap = {
  en: new Faker({ locale: [en] }),
  ja: new Faker({ locale: [ja, en] }),
};

export function generateDataSet(
  fields: FieldDefinition[],
  count: number,
  language: 'en' | 'ja' = 'ja'
): Record<string, unknown>[] {
  const fakerLib = fakerMap[language];
  return Array.from({ length: count }, () => {
    const item: Record<string, unknown> = {};
    fields.forEach((field) => {
      item[field.name] = generateFieldValue(field, fakerLib, language);
    });
    return item;
  });
}

export function generateFieldValue(
  field: FieldDefinition,
  fakerLib: Faker,
  language: 'en' | 'ja' = 'ja'
): unknown {
  const { type, options = {} } = field;

  switch (type) {
    case 'string':
      return fakerLib.string.sample();
    case 'number':
      return fakerLib.number.int(options.range as { min: number, max: number } || { min: 0, max: 1000 });
    case 'boolean':
      return fakerLib.datatype.boolean();
    case 'date':
      return fakerLib.date.between({
        from: options.startDate as string || '2020-01-01',
        to: options.endDate as string || '2025-12-31',
      });
    case 'email':
      return fakerLib.internet.email();
    case 'phone':
      return fakerLib.phone.number();
    case 'address':
      return `${fakerLib.location.state()}${fakerLib.location.city()}${fakerLib.location.streetAddress()}`;
    case 'fullName':
      return fakerLib.person.fullName();
    case 'company':
      return fakerLib.company.name();
    case 'department':
      return fakerLib.commerce.department();
    case 'sales':
      return fakerLib.number.int(options.range || { min: 10000, max: 1000000 });
    case 'percentage':
      return fakerLib.number.float({ min: 0, max: 100, fractionDigits: 2 });
    case 'productCode':
      return fakerLib.string.alphanumeric(8).toUpperCase();
    case 'currency':
      const currencyType = options.currencyType as 'yen' | 'dollar' || 'yen';
      let currencySymbol: string;
      if (currencyType === 'yen') {
        currencySymbol = '¥';
      } else {
        currencySymbol = '$';
      }
      return fakerLib.finance.amount({
        min: (options.min as number | undefined) || 1000,
        max: (options.max as number | undefined) || 1000000,
        dec: (options.decimals as number | undefined) || 0,
        symbol: (options.symbol as string | undefined) || currencySymbol,
        autoFormat: true,
      });
    case 'ipAddress':
      if (options.ipVersion === 'IPv6') {
        return fakerLib.internet.ipv6();
      } else if (options.ipVersion === 'IPv4') {
        return fakerLib.internet.ipv4();
      }
      return fakerLib.internet.ipv4();
    case 'url':
      return fakerLib.internet.url();
    case 'color':
      return fakerLib.internet.color();
    case 'creditCard':
      return fakerLib.finance.creditCardNumber();
    case 'latLong':
      const latLongType = options.latLongType as 'latitude' | 'longitude' | 'both' || 'both';
      if (latLongType === 'latitude') {
        return fakerLib.location.latitude();
      } else if (latLongType === 'longitude') {
        return fakerLib.location.longitude();
      }
      const latitude = fakerLib.location.latitude();
      const longitude = fakerLib.location.longitude();
      return `${latitude},${longitude}`;
    case 'object':
      if (!field.fields) return {};
      return generateDataSet(field.fields, 1, language)[0];
    case 'array':
      if (!field.itemDefinition) {
        return [];
      }
      const arrayLength = typeof field.options?.arrayLength === 'number' ? field.options.arrayLength : 1;
      return Array.from({ length: arrayLength }, () =>
        generateFieldValue(field.itemDefinition!, fakerLib, language)
      );
    default:
      return '';
  }
}

export function generateData(
  fields: FieldDefinition[],
  options: GeneratorOptions
): Record<string, unknown>[] {
  const { itemCount, language } = options;
  return generateDataSet(fields, itemCount, language);
}