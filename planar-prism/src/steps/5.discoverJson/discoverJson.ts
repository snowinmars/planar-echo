import type { Pathes } from '../1.createPathes/index.js';
import type { AllJsons } from '../4.biffs2json/index.js';
import saveDiscovered from './saveDiscovered.js';
import type { Discovered } from './types.js';

const formStateId = (npcLowercaseId: string, stateIndex: number): string => `${npcLowercaseId}_state${stateIndex}`;
const formResponseId = (npcLowercaseId: string, responseIndex: number): string => `${npcLowercaseId}_response${responseIndex}`.replaceAll(`'`, `\\'`);

const discoverJson = async (allJsons: AllJsons, pathes: Pathes): Promise<Discovered> => {
  const npcs = allJsons.cres.map((cre) => {
    const npcLowercaseId = cre.resourceName.split('.')[0]!;
    return npcLowercaseId;
  });

  const states = allJsons.dlgs.map((dlg) => {
    const npcLowercaseId = dlg.resourceName.split('.')[0]!;
    return dlg.states.map((state) => {
      const stateId = formStateId(npcLowercaseId, state.index);
      return stateId;
    });
  }).flat();

  const responses = allJsons.dlgs.map((dlg) => {
    const npcLowercaseId = dlg.resourceName.split('.')[0]!;
    return dlg.responses.map((response) => {
      const responseId = formResponseId(npcLowercaseId, response.index);
      return responseId;
    });
  }).flat();

  const journals = allJsons.dlgs.map((dlg) => {
    return dlg.responses.map((response) => {
      return response.journalRef;
    }).filter(x => x) as number[];
  }).flat();

  const discovered: Discovered = {
    npcs,
    states,
    responses,
    journals,
  };

  await saveDiscovered(discovered, pathes);

  return discovered;
};

export default discoverJson;
