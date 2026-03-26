import { objectEntries } from './objects.js';

const MAP_TYPE = 'map';
const isMap = (value: unknown): value is Map<unknown, unknown> => value instanceof Map;

const mapToObject = <K, V>(map: Map<K, V>): Record<string, V> => {
  const obj: Record<string, V> = {};
  for (const [k, v] of map.entries()) {
    obj[String(k)] = v;
  }
  return obj;
};

const objectToMap = <V>(obj: Record<string, V>): Map<string, V> => {
  return new Map(objectEntries(obj));
};

const replacer = (key: string, value: unknown): unknown => {
  if (isMap(value)) {
    return {
      dataType: MAP_TYPE,
      value: mapToObject(value),
    };
  }
  return value;
};

const reviver = (key: string, value: unknown): unknown => {
  const isObject = value && typeof value === 'object';
  const hasMapDatatype = isObject && 'dataType' in value && value.dataType === MAP_TYPE;
  const hasValue = isObject && 'value' in value && typeof value.value === 'object' && value.value !== null;
  if (hasMapDatatype && hasValue) {
    return objectToMap(value.value as Record<string, unknown>);
  }
  return value;
};

export const jsonStringify = (x: unknown): string => {
  return JSON.stringify(x, replacer, 2);
};
export const jsonParse = <T>(x: string): T => {
  return JSON.parse(x, reviver) as T;
};
