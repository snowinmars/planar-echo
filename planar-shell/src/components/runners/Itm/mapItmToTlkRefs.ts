import type { GhostItm } from '@planar/shared';

export const mapItmToTlkRefs = (itm: GhostItm): number[] => [
  ...new Set([
    itm.unidentifiedNameRef,
    itm.identifiedNameRef,
    itm.unidentifiedDescriptionRef,
    itm.identifiedDescriptionRef,
  ].filter(x => x > 0)),
];
