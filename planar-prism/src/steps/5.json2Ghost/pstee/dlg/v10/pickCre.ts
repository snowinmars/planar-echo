import { dlgToCres, dlgToItms, nothing } from '@planar/shared';

import type { GhostCre, GhostItm, Maybe } from '@planar/shared';

const pickItm = (itms: Map<string, GhostItm>, dlgResourceName: string): Maybe<GhostItm> | 'narrator' => {
  try {
    const creResourceNames = dlgToItms(dlgResourceName);
    if (creResourceNames.length === 1 && creResourceNames[0] === 'narrator') return creResourceNames[0];
    const cre = itms.get(creResourceNames[0]!)!;

    return cre;
  }
  catch {
    return nothing();
  }
};

const pickCre = (cres: Map<string, GhostCre>, dlgResourceName: string): Maybe<GhostCre> | 'narrator' => {
  try {
    const creResourceNames = dlgToCres(dlgResourceName);
    if (creResourceNames.length === 1 && creResourceNames[0] === 'narrator') return creResourceNames[0];
    const cre = cres.get(creResourceNames[0]!)!;

    return cre;
  }
  catch {
    return nothing();
  }
};

export const pickCreOrItm = (
  cres: Map<string, GhostCre>,
  itms: Map<string, GhostItm>,
  dlgResourceName: string): GhostCre | GhostItm | 'narrator' => {
  const cre = pickCre(cres, dlgResourceName);
  const itm = pickItm(itms, dlgResourceName);

  if (!cre && !itm) throw new Error(`Cannot find cre or itm for '${dlgResourceName}'`);
  if (cre) return cre;
  return itm!;
};
