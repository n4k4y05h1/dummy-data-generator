export const dataTypeCategories = {
  personal: {
    labelKey: 'category_personal',
    types: [
      { value: 'fullName', labelKey: 'type_fullName' },
      { value: 'email', labelKey: 'type_email' },
      { value: 'phone', labelKey: 'type_phone' },
      { value: 'address', labelKey: 'type_address' },
    ],
  },
  business: {
    labelKey: 'category_business',
    types: [
      { value: 'company', labelKey: 'type_company' },
      { value: 'department', labelKey: 'type_department' },
      { value: 'sales', labelKey: 'type_sales' },
      { value: 'percentage', labelKey: 'type_percentage' },
      { value: 'productCode', labelKey: 'type_productCode' },
      { value: 'currency', labelKey: 'type_currency' },
    ],
  },
  basic: {
    labelKey: 'category_basic',
    types: [
      { value: 'string', labelKey: 'type_string' },
      { value: 'number', labelKey: 'type_number' },
      { value: 'boolean', labelKey: 'type_boolean' },
      { value: 'date', labelKey: 'type_date' },
      { value: 'object', labelKey: 'type_object' },
      { value: 'array', labelKey: 'type_array' },
    ],
  },
  other: {
    labelKey: 'category_other',
    types: [
      { value: 'ipAddress', labelKey: 'type_ipAddress' },
      { value: 'url', labelKey: 'type_url' },
      { value: 'color', labelKey: 'type_color' },
      { value: 'creditCard', labelKey: 'type_creditCard' },
      { value: 'latLong', labelKey: 'type_latLong' },
    ],
  },
} as const;