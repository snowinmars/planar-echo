import { Link as RouterLink } from 'react-router';

import { isNothing } from '@planar/shared';

import { resrefHref } from './resrefHref';

import type { FC } from 'react';

import type { Maybe } from '@planar/shared';

type ResrefLinkProps = Readonly<{
  type: string;
  ext: string;
  value: Maybe<string>;
}>;

const ResrefLink: FC<ResrefLinkProps> = ({ type, ext, value }: ResrefLinkProps) => {
  const href = resrefHref(type, ext, value);
  if (isNothing(href) || isNothing(value) || value === '') return <span>{value ?? ''}</span>;
  return <RouterLink to={href}>{value}</RouterLink>;
};

export default ResrefLink;
