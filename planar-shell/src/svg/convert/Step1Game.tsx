import type { WithClassName } from '@/types/fcWithClassName';
import type { FC, JSX, SVGAttributes } from 'react';

import styles from './Step1Game.module.scss';
import clsx from 'clsx';

type LineProps = WithClassName & Readonly<{
  x: number;
  y: number;
  dur: string;
  color: SVGAttributes<unknown>['color'];
}>;
const Line: FC<LineProps> = ({ className, x, y, dur, color }: LineProps) => {
  return (
    <rect
      x={x}
      y={y}
      height="4"
      rx="2"
      fill={color}
      className={clsx(className, styles.line)}
      style={{ '--duration': dur } as React.CSSProperties}
    />
  );
};

type LangProps = WithClassName & Readonly<{
  x: number;
  y: number;
  bot: string;
  dur: string;
  text: string;
  color: SVGAttributes<unknown>['color'];
}>;
const Lang: FC<LangProps> = ({ className, x, y, bot, dur, text, color }: LangProps) => {
  return (
    <text
      x={x}
      y={y}
      fontSize="11"
      fill={color}
      fontFamily="monospace"
      className={clsx(className, styles.lang)}
      style={{ '--duration': dur, '--bot': bot } as React.CSSProperties}
    >
      {text}
    </text>
  );
};

const Step1Game: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    viewBox="0 0 200 140"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="40" y="15" width="120" height="110" rx="4" fill="#191f45" stroke="#1b294b" strokeWidth="1.5" />

    <Line x={52} y={30} dur="3.1s" className={styles.lineL} color="#fb8136" />
    <Line x={52} y={42} dur="2.9s" className={styles.lineS} color="#48929b" />
    <Line x={52} y={54} dur="1.9s" className={styles.lineM} color="#ffb94c" />
    <Line x={52} y={66} dur="2.3s" className={styles.lineL} color="#ff4e20" />
    <Line x={52} y={78} dur="3.7s" className={styles.lineS} color="#8db255" />

    <Lang x={55} y={105} bot="11px" dur="3.1s" text="ཞི་བ" color="#fb8136" />
    <Lang x={69} y={105} bot="-7px" dur="4.7s" text="လုပ်" color="#48929b" />
    <Lang x={90} y={105} bot="9px" dur="4.1s" text="𒐊" color="#ffb94c" />
    <Lang x={104} y={105} bot="5px" dur="4.3s" text="独" color="#ff4e20" />
    <Lang x={118} y={105} bot="-13px" dur="3.7s" text="衆" color="#8db255" />

    <circle cx="150" cy="100" r="18" fill="none" stroke="#1f4788" strokeWidth="1.5" className={styles.globe} />
    <ellipse cx="150" cy="100" rx="8" ry="18" fill="none" stroke="#1f4788" strokeWidth="1" className={styles.globe} />
    <line x1="132" y1="100" x2="168" y2="100" stroke="#1f4788" strokeWidth="1" className={styles.globe} />
    <line x1="136" y1="92" x2="164" y2="92" stroke="#1f4788" strokeWidth="0.8" className={styles.globe} />
    <line x1="136" y1="108" x2="164" y2="108" stroke="#1f4788" strokeWidth="0.8" className={styles.globe} />
  </svg>
);
export default Step1Game;
