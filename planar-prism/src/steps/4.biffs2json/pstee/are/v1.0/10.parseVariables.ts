import { extendMap } from './10.parseVariables.types.js';

import type { BufferReader } from '@/shared/bufferReader.js';
import type { RawAreVariableV10 } from './10.parseVariables.types.js';

const parseVariable = (reader: BufferReader): RawAreVariableV10 => {
  const name = reader.nullTerminatedString(32); // TODO [snow]: in bytecode there is tail after null terminator. Why?
  const type = reader.map.ushort(extendMap.variableType.parse);
  const resourceType = reader.ushort();
  const dwordValue = reader.uint();
  const intValue = reader.int();
  const doubleValue = reader.double();
  const scriptNameValue = reader.string(32);

  const rawAreVariableV10: RawAreVariableV10 = {
    name,
    type,
    resourceType,
    dwordValue,
    intValue,
    doubleValue,
    scriptNameValue,
  };

  return rawAreVariableV10;
};

type ParseVariablesProps = Readonly<{
  reader: BufferReader;
  count: number;
}>;
export const parseVariables = ({
  reader,
  count,
}: ParseVariablesProps): RawAreVariableV10[] => {
  const variables: RawAreVariableV10[] = [];

  for (let i = 0; i < count; i++) variables.push(parseVariable(reader));

  return variables;
};
