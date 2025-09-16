import { scalarType } from 'nexus';
import { GraphQLScalarType, Kind } from 'graphql';
import { asNexusMethod } from 'nexus';
import { GraphQLDateTime } from 'graphql-scalars';

// DateTime scalar type for proper timestamp handling
// export const DateTime = scalarType({
//   name: 'DateTime',
//   description: 'A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the date-time format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.',
//   serialize: (value: Date | string) => {
//     if (value instanceof Date) {
//       return value.toISOString();
//     }
//     if (typeof value === 'string') {
//       return value;
//     }
//     throw new Error('Value is not an instance of Date or string');
//   },
//   parseValue: (value: string) => {
//     if (typeof value !== 'string') {
//       throw new Error('Value is not a string');
//     }
//     const date = new Date(value);
//     if (isNaN(date.getTime())) {
//       throw new Error('Value is not a valid date');
//     }
//     return date;
//   },
//   parseLiteral: (ast) => {
//     if (ast.kind !== Kind.STRING) {
//       throw new Error('Can only parse string values');
//     }
//     const date = new Date(ast.value);
//     if (isNaN(date.getTime())) {
//       throw new Error('Value is not a valid date');
//     }
//     return date;
//   },
// });

export const DateTime = asNexusMethod(GraphQLDateTime, 'dateTime');

// Location scalar type for JSON location data
export const Location = scalarType({
  name: 'Location',
  description: 'A location object with latitude and longitude',
  serialize: (value: any) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return null;
      }
    }
    return value;
  },
  parseValue: (value: any) => {
    if (typeof value === 'object' && value !== null) {
      return value;
    }
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        throw new Error('Invalid location format');
      }
    }
    throw new Error('Value is not a valid location object');
  },
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      try {
        return JSON.parse(ast.value);
      } catch {
        throw new Error('Invalid location format');
      }
    }
    throw new Error('Can only parse string values for location');
  },
});

// LocationInput scalar type for input
export const LocationInput = scalarType({
  name: 'LocationInput',
  description: 'A location input object with latitude and longitude',
  serialize: (value: any) => value,
  parseValue: (value: any) => value,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.OBJECT) {
      return ast;
    }
    throw new Error('Can only parse object values for location input');
  },
});
