import type { UntranslatedItem } from '@planar/shared';

export const mapItemToTlkRefs = (item: UntranslatedItem): number[] => [
  ...new Set([
    item.unidentifiedNameRef,
    item.identifiedNameRef,
    item.unidentifiedDescriptionRef,
    item.identifiedDescriptionRef,
  ].filter(x => x > 0)),
];
