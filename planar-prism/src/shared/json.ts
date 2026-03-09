const mapType = 'map';
const replacer = <TValue>(key: string, value: TValue) => {
  if (value instanceof Map) {
    const x: Record<string, TValue> = {};
    for (const [k, v] of value.entries()) {
      x[k.toString()] = v;
    }
    return {
      dataType: mapType,
      value: x,
    };
  }
  else {
    return value;
  }
};
// JSON.stringify({}, replacer, 2);

const reviver = <TValue>(key: string, value: { dataType: string; value: Iterable<readonly [string, TValue]> }) => {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === mapType) {
      return new Map<string, TValue>(value.value);
    }
  }
  return value;
};
// JSON.parse('{}', reviver);

export const jsonStringify = (x: unknown): string => {
  return JSON.stringify(x, replacer, 2);
};
export const jsonParse = <T>(x: string): T => {
  return JSON.parse(x, reviver);
};
