import { dlgToCres, dlgToItms, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';
import type { CreWithTlk } from '../../cre/v10/patchCres.types.js';
import type { ItmWithTlk } from '../../itm/v11/patchItms.types.js';

const pickItm = (itms: Map<string, ItmWithTlk>, dlgResourceName: string): Maybe<ItmWithTlk> | 'narrator' => {
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

const pickCre = (cres: Map<string, CreWithTlk>, dlgResourceName: string): Maybe<CreWithTlk> | 'narrator' => {
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
  cres: Map<string, CreWithTlk>,
  itms: Map<string, ItmWithTlk>,
  dlgResourceName: string): CreWithTlk | ItmWithTlk | 'narrator' => {
  const cre = pickCre(cres, dlgResourceName);
  const itm = pickItm(itms, dlgResourceName);

  if (!cre && !itm) throw new Error(`Cannot find cre or itm for '${dlgResourceName}'`);
  if (cre) return cre;
  return itm!;
};
