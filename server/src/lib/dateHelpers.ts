/**
 * Utility functions for handling Date to string conversion in GraphQL resolvers
 */

export function convertDatesToStrings<T extends Record<string, any>>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertDatesToStrings) as unknown as T;
  }

  if (typeof obj === 'object') {
    const converted: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Date) {
        converted[key] = value.toISOString();
      } else if (typeof value === 'object' && value !== null) {
        converted[key] = convertDatesToStrings(value);
      } else {
        converted[key] = value;
      }
    }
    return converted as T;
  }

  return obj;
}

export function convertDateFields<T extends Record<string, any>>(
  obj: T,
  dateFields: string[]
): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  const converted: any = { ...obj };
  for (const field of dateFields) {
    if (field in converted && converted[field] instanceof Date) {
      converted[field] = converted[field].toISOString();
    }
  }
  return converted as T;
}
