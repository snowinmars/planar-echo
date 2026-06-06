import { WithClassName } from '@/types/fcWithClassName';
import { FC, JSX } from 'react';

const FlagDe: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 6"
    width="10"
    height="6"
  >
    <desc>Flag of Germany</desc>
    <rect width="10" height="6" y="0" x="0" fill="#000" />
    <rect width="10" height="4" y="2" x="0" fill="#D00" />
    <rect width="10" height="2" y="4" x="0" fill="#FFCE00" />
  </svg>
);
export default FlagDe;
