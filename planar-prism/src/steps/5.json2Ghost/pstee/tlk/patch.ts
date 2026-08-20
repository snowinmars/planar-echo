import type { RawTlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import { reportProgress } from '@/shared/report.js';
import createWriter from '@/shared/writer.js';

export const patchTlk = (tlk: RawTlk): string => {
  const writer = createWriter();

  writer.writeLine('{');
  writer.writeLine('"_autogeneraterComment": "Original source: dialog.tlk",', 2);

  const values = [...tlk.itemsMap.values()]; // need percent, map is ~100 000 elements of 7 props

  reportProgress({
    value: 1,
    step: 'tlk_json2ghost',
    params: {
      resourceName: tlk.resourceName,
    },
  });

  for (let i = 0; i < values.length; i++) {
    const { index, text } = values[i]!;

    const line = text.replaceAll(`"`, `\\"`).replaceAll(`\n`, `\\\\n`).replaceAll(`\\ `, `\\\\ `); // double escape because of json.parse later
    writer.write(`"${index}": "${line}"`, 2);

    if (i < values.length - 1) writer.writeLine(',');
    else writer.br();
  }

  writer.writeLine('}');

  reportProgress({
    value: 100,
    step: 'tlk_json2ghost',
    params: {
      resourceName: tlk.resourceName,
    },
  });

  return writer.done();
};
