import type { WithClassName } from '@/types/fcWithClassName';
import type { FC, JSX, SVGAttributes } from 'react';

import styles from './Step2WeiDU.module.scss';

const biggerGearColor = '#ff4c20';
const smallerGearColor = '#8db255';

type SparkProps = WithClassName & Readonly<{
  x: number;
  y: number;
  dur: string;
  color: SVGAttributes<unknown>['color'];
}>;
const Spark: FC<SparkProps> = ({ x, y, dur, color }: SparkProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r="1.5"
      fill={color}
      style={{ '--duration': dur } as React.CSSProperties}
      className={styles.spark}
    />
  );
};

const Step2WeiDU: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    viewBox="0 0 200 140"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className={styles.biggerGear}>
      <circle cx="80" cy="70" r="30" fill="none" stroke={biggerGearColor} strokeWidth="3" />
      <circle cx="80" cy="70" r="12" fill="#1a1a2e" stroke={biggerGearColor} strokeWidth="2" />
      <rect x="76" y="36" width="8" height="10" rx="1" fill={biggerGearColor} />
      <rect x="76" y="94" width="8" height="10" rx="1" fill={biggerGearColor} />
      <rect x="46" y="66" width="10" height="8" rx="1" fill={biggerGearColor} />
      <rect x="104" y="66" width="10" height="8" rx="1" fill={biggerGearColor} />
      <rect x="55" y="43" width="8" height="10" rx="1" fill={biggerGearColor} transform="rotate(-45 60 48)" />
      <rect x="97" y="43" width="8" height="10" rx="1" fill={biggerGearColor} transform="rotate(45 100 48)" />
      <rect x="55" y="87" width="8" height="10" rx="1" fill={biggerGearColor} transform="rotate(45 60 92)" />
      <rect x="97" y="87" width="8" height="10" rx="1" fill={biggerGearColor} transform="rotate(-45 100 92)" />
    </g>

    <g className={styles.smallerGear}>
      <circle cx="130" cy="55" r="18" fill="none" stroke={smallerGearColor} strokeWidth="2.5" />
      <circle cx="130" cy="55" r="7" fill="#1a1a2e" stroke={smallerGearColor} strokeWidth="1.5" />
      <rect x="127" y="34" width="6" height="7" rx="1" fill={smallerGearColor} />
      <rect x="127" y="69" width="6" height="7" rx="1" fill={smallerGearColor} />
      <rect x="109" y="52" width="7" height="6" rx="1" fill={smallerGearColor} />
      <rect x="144" y="52" width="7" height="6" rx="1" fill={smallerGearColor} />
      <rect x="114" y="38" width="6" height="7" rx="1" fill={smallerGearColor} transform="rotate(-45 120 41.5)" />
      <rect x="140" y="38" width="6" height="7" rx="1" fill={smallerGearColor} transform="rotate(45 140 41.5)" />
    </g>

    <Spark x={95} y={35} dur="2.9s" color="#f08f90" />
    <Spark x={110} y={40} dur="1.1s" color="#a5ba93" />
    <Spark x={120} y={30} dur="1.9s" color="#ffb94e" />
  </svg>
);
export default Step2WeiDU;
