import { WithClassName } from '@/types/fcWithClassName';
import { FC, JSX } from 'react';

// https://weidu.org/favicon.ico
const Weidu: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0 C5.28 0 10.56 0 16 0 C16 5.28 16 10.56 16 16 C10.72 16 5.44 16 0 16 C0 10.72 0 5.44 0 0 Z " fill="#031D35" transform="translate(0,0)" />
    <path d="M0 0 C2.97 0 5.94 0 9 0 C9 4.62 9 9.24 9 14 C7.68 13.67 6.36 13.34 5 13 C5.99 13 6.98 13 8 13 C8 9.04 8 5.08 8 1 C6.68 1 5.36 1 4 1 C4 3.64 4 6.28 4 9 C4.33 6.69 4.66 4.38 5 2 C5.66 2 6.32 2 7 2 C7 5.3 7 8.6 7 12 C6.0925 11.814375 5.185 11.62875 4.25 11.4375 C0.8491925 10.77576292 0.8491925 10.77576292 -3 12 C-3 8.7 -3 5.4 -3 2 C-2.34 2 -1.68 2 -1 2 C-0.67 3.98 -0.34 5.96 0 8 C0 5.36 0 2.72 0 0 Z " fill="#1082ED" transform="translate(6,1)" />
    <path d="M0 0 C0.66 0 1.32 0 2 0 C2.33 2.31 2.66 4.62 3 7 C4.32 7 5.64 7 7 7 C7.33 4.69 7.66 2.38 8 0 C8.66 0 9.32 0 10 0 C10 3.3 10 6.6 10 10 C9.0925 9.814375 8.185 9.62875 7.25 9.4375 C3.8491925 8.77576292 3.8491925 8.77576292 0 10 C0 6.7 0 3.4 0 0 Z " fill="#FEFEFF" transform="translate(3,3)" />
  </svg>
);
export default Weidu;
