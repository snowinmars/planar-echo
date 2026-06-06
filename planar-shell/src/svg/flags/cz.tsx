import { WithClassName } from '@/types/fcWithClassName';
import { FC, JSX } from 'react';

const FlagCz: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 6"
    width="10"
    height="6"
  >
    <desc>Flag of Czech Republic</desc>
    <rect width="10" height="6" fill="#d7141a" />
    <rect width="10" height="3" fill="#fff" />
    <path d="M 5,3 0,0 V 6 z" fill="#11457e" />
  </svg>
);
export default FlagCz;
