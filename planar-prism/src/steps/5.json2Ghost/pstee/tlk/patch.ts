import type { Tlk } from '@/steps/4.biffs2json/pstee/tlk/index.js';
import { reportProgress } from '@/shared/report.js';
import createWriter from '@/shared/writer.js';

export const patchTlk = (tlk: Tlk): string => {
  const writer = createWriter();

  writer.writeLine('{');
  writer.writeLine('"_autogeneraterComment": "Original source: dialog.tlk",', 2);

  const values = [...tlk.itemsMap.values()]; // need percent, map is ~100 000 elements of 7 props

  for (let i = 0; i < values.length; i++) {
    const { index, text } = values[i]!;

    const line = text.replaceAll(`"`, `\\"`).replaceAll(`\n`, `\\\\n`); // double escape because of json.parse later
    writer.write(`"${index}": "${line}"`, 2);

    if (i < values.length - 1) writer.writeLine(',');
    else writer.br();

    const percent = Math.round((i + 1) * 100 / values.length);
    reportProgress({
      value: percent,
      step: 'tlk_json2ghost',
      params: {
        index: index.toString(),
      },
    });
  }

  writer.writeLine('}');

  return writer.done();
};
