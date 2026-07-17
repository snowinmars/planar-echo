import type { WithClassName } from '@/types/fcWithClassName';
import type { FC, JSX } from 'react';

const FlagDe: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 6"
    width="10"
    height="6"
  >
    <desc>Flag of France</desc>
    <rect width="10" height="6" y="0" x="0" fill="#CE1126" />
    <rect width="6.66" height="6" y="0" x="0" fill="#fff" />
    <rect width="3.33" height="6" y="0" x="0" fill="#002654" />
  </svg>
);
export default FlagDe;
