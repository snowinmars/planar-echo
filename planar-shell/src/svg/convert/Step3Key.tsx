import type { WithClassName } from '@/types/fcWithClassName';
import type { FC, JSX } from 'react';
import styles from './Step3Key.module.scss';

const keyColor = '#ffa400';

type KeyHeadProps = WithClassName & Readonly<{
  x: number;
  y: number;
  r: number;
  strokeWidth: number;
}>;
const KeyHead: FC<KeyHeadProps> = ({ x, y, r, strokeWidth, className }: KeyHeadProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="none"
      stroke={keyColor}
      strokeWidth={strokeWidth}
      className={className}
    />
  );
};

type GlowProps = Readonly<{
  x: number;
  y: number;
  r: number;
  dur: string;
  strokeWidth: number;
}>;
const Glow: FC<GlowProps> = ({ x, y, r, dur, strokeWidth }: GlowProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r={r}
      fill="none"
      stroke={keyColor}
      strokeWidth={strokeWidth}
      className={styles.glow}
      style={{ '--duration': dur } as React.CSSProperties}
    />
  );
};

const Step3Key: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    viewBox="0 0 200 140"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g className={styles.key}>
      <KeyHead x={70} y={70} r={28} strokeWidth={1} />
      <KeyHead x={70} y={70} r={18} strokeWidth={2} />
      <KeyHead x={70} y={70} r={6} strokeWidth={1.5} />

      {/* Key shaft */}
      <rect x="98" y="67" width="70" height="6" rx="1" fill={keyColor} />

      {/* Key teeth */}
      <rect x="150" y="67" width="4" height="12" rx="1" fill={keyColor} />
      <rect x="140" y="67" width="4" height="10" rx="1" fill={keyColor} />
      <rect x="158" y="67" width="4" height="8" rx="1" fill={keyColor} />
      <rect x="145" y="73" width="4" height="6" rx="1" fill={keyColor} />
    </g>

    {/* Glow around bow */}
    <Glow x={70} y={70} r={32} dur="2.3s" strokeWidth={0.5} />
    <Glow x={67} y={70} r={34} dur="2.9s" strokeWidth={0.5} />
    <Glow x={71} y={72} r={27} dur="3.7s" strokeWidth={0.5} />
  </svg>
);
export default Step3Key;
