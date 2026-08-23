import { isNothing, nothing } from '@planar/shared';

import type { Maybe } from '@planar/shared';

export const resrefHref = (
  type: string,
  ext: string,
  raw: Maybe<string>,
): Maybe<string> => {
  if (isNothing(raw)) return nothing();
  const trimmed = raw.trim();
  if (!trimmed || trimmed === '*') return nothing();
  const lower = trimmed.toLowerCase();
  const id = lower.includes('.') ? lower : `${lower}.${ext}`;
  return `/${type}/${id}`;
};
