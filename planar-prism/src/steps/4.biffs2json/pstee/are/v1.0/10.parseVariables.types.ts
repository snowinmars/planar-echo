import { extend } from '@/shared/extendedMap.js';

/* createGenerator().register().enum('variableTypeV10',
 *    ['int','float','script name','resref','strref','dword']
 * ).write();
 */
const variableTypeV10 = {
  0: 'int',
  1: 'float',
  2: 'script name',
  3: 'resref',
  4: 'strref',
  5: 'dword',
} as const;
type VariableTypeV10 = typeof variableTypeV10[keyof typeof variableTypeV10];

export const extendMap = {
  variableType: extend(variableTypeV10),
};

export type RawAreVariableV10 = Readonly<{
  name: string;
  type: VariableTypeV10;
  resourceType: number;
  dwordValue: number;
  intValue: number;
  doubleValue: number;
  scriptNameValue: string;
}>;
