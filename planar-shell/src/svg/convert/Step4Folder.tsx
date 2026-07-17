import type { WithClassName } from '@/types/fcWithClassName';
import type { FC, JSX, SVGAttributes } from 'react';
import styles from './Step4Folder.module.scss';

type FileProps = Readonly<{
  x: number;
  y: number;
  dur: string;
  color: SVGAttributes<unknown>['color'];
}>;
const File: FC<FileProps> = ({ x, y, dur, color }: FileProps) => {
  return (
    <g
      className={styles.file}
      style={{ '--duration': dur } as React.CSSProperties}
    >
      <rect x={x} y={y} width="14" height="18" rx="2" fill={color} opacity="0.8" />
      <rect x={x + 3} y={y + 4} width="8" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x={x + 3} y={y + 8} width="6" height="2" rx="1" fill="white" opacity="0.6" />
      <rect x={x + 3} y={y + 12} width="7" height="2" rx="1" fill="white" opacity="0.6" />
    </g>
  );
};

const Step4Folder: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    viewBox="0 0 200 140"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M30,45 L30,120 Q30,125 35,125 L165,125 Q170,125 170,120 L170,50 Q170,45 165,45 L95,45 L85,35 Q83,33 80,33 L35,33 Q30,33 30,38 Z" fill="#1a1a2e" stroke="#4a4a6a" strokeWidth="1.5" />
    <path d="M30,45 L30,55 L170,55 L170,50 Q170,45 165,45 L95,45 L85,35 Q83,33 80,33 L35,33 Q30,33 30,38 Z" fill="#16213e" stroke="#4a4a6a" strokeWidth="1.5" />

    <File x={40} y={-3} dur="3.1s" color="#fb8136" />
    <File x={67} y={-5} dur="2.9s" color="#48929b" />
    <File x={92} y={-6} dur="1.9s" color="#ffb94c" />
    <File x={110} y={-8} dur="2.3s" color="#ff4e20" />
    <File x={145} y={-2} dur="3.7s" color="#8db255" />
  </svg>
);
export default Step4Folder;
