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
    <desc>Flag of Poland</desc>
    <rect width="10" height="6" fill="#dc143c" />
    <rect width="10" height="3" fill="#fff" />
  </svg>
);
export default FlagDe;
