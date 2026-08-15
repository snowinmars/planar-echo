import { dlgToCres } from './creToDlg.js';
import { dlgToItms } from './itmToDlgs.js';

export const dlgToCreOrItm = (npcLowercaseId: string): string => {
  // TODO [snow]: it is a good idea, I can reuse it in prism/pickCre.ts,
  // But idk how to properly choose dlg for cre and cre for dlg
  // I should review gemrb for this algorithm
  const cres = dlgToCres(`${npcLowercaseId}.dlg`, false);
  if (cres.length) {
    const cre = cres.sort(x => x.length)[0];
    if (cre) return cre.replace('.cre', '');
  }
  const itms = dlgToItms(`${npcLowercaseId}.dlg`, false);
  if (itms.length) {
    const itm = itms.sort(x => x.length)[0];
    if (itm) return itm.replace('.itm', '');
  }
  throw new Error(`What is '${npcLowercaseId}', if not dlg for cre or itm?`);
};
