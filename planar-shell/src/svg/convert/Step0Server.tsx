import type { WithClassName } from '@/types/fcWithClassName';
import type { FC, JSX, SVGAttributes } from 'react';

import styles from './Step0Server.module.scss';
import clsx from 'clsx';

type LedProps = WithClassName & Readonly<{
  x: number;
  y: number;
  dur: string;
  color: SVGAttributes<unknown>['color'];
}>;
const Led: FC<LedProps> = ({ x, y, dur, className, color }: LedProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r="2.5"
      fill={color}
      className={clsx(className, styles.led)}
      style={{ '--duration': dur } as React.CSSProperties}
    />
  );
};

type LineProps = WithClassName & Readonly<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}>;
const Line: FC<LineProps> = ({ x1, y1, x2, y2 }: LineProps) => {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4a4a6a" strokeWidth="1.5" strokeDasharray="4 3" />
  );
};

type StaticNodeProps = WithClassName & Readonly<{
  x: number;
  y: number;
  dur: string;
  color: SVGAttributes<unknown>['color'];
}>;
const StaticNode: FC<StaticNodeProps> = ({ x, y, dur, color, className }: StaticNodeProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r="5"
      fill={color}
      className={clsx(className, styles.staticNode)}
      style={{ '--duration': dur } as React.CSSProperties}
    />
  );
};

type MovingNodeProps = WithClassName & Readonly<{
  x: number;
  y: number;
  dur: string;
  color: SVGAttributes<unknown>['color'];
}>;
const MovingNode: FC<MovingNodeProps> = ({ x, y, dur, color, className }: MovingNodeProps) => {
  return (
    <circle
      cx={x}
      cy={y}
      r="2"
      fill={color}
      className={clsx(className, styles.movingNode)}
      style={{ '--duration': dur } as React.CSSProperties}
    />
  );
};

type ServerRackProps = Readonly<{
  x: number;
  y: number;
}>;
const ServerRack: FC<ServerRackProps> = ({ x, y }: ServerRackProps) => {
  return (
    <rect x={x} y={y} width="52" height="18" rx="2" fill="#16213e" stroke="#4a4a6a" strokeWidth="1" />
  );
};

const Step0Server: FC<WithClassName> = ({ className }): JSX.Element => (
  <svg
    className={className}
    viewBox="0 0 200 140"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="70" y="20" width="60" height="100" rx="4" fill="#1a1a2e" stroke="#4a4a6a" strokeWidth="1.5" />
    <ServerRack x={74} y={26} />
    <ServerRack x={74} y={50} />
    <ServerRack x={74} y={74} />
    <ServerRack x={74} y={98} />

    <Led x={82} y={35} dur="5.9s" color="#c6c2b6" />
    <Led x={90} y={35} dur="7.9s" color="#bcb58c" />
    <Led x={82} y={59} dur="10.7s" color="#a5ba93" />
    <Led x={90} y={59} dur="14.9s" color="#d3b17d" />
    <Led x={82} y={83} dur="8.9s" color="#ffb94e" />
    <Led x={90} y={83} dur="15.1s" color="#f08f90" />

    <Line x1={20} y1={50} x2={70} y2={50} />
    <Line x1={20} y1={70} x2={70} y2={70} />
    <Line x1={20} y1={90} x2={70} y2={90} />
    <Line x1={130} y1={50} x2={180} y2={50} />
    <Line x1={130} y1={70} x2={180} y2={70} />
    <Line x1={130} y1={90} x2={180} y2={90} />

    <StaticNode x={15} y={50} dur="2.9s" color="#ff4e20" />
    <StaticNode x={15} y={70} dur="2.3s" color="#fb8136" />
    <StaticNode x={15} y={90} dur="1.9s" color="#ffb94c" />
    <StaticNode x={185} y={50} dur="1.7s" color="#8db255" />
    <StaticNode x={185} y={70} dur="1.3s" color="#48929b" />
    <StaticNode x={185} y={90} dur="1.1s" color="#1f4788" />

    <MovingNode x={0} y={0} dur="1.7s" color="#8db255" />
    <MovingNode x={0} y={20} dur="1.3s" color="#48929b" />
    <MovingNode x={0} y={40} dur="1.1s" color="#1f4788" />
    <MovingNode x={110} y={0} dur="2.9s" color="#ff4e20" />
    <MovingNode x={110} y={20} dur="2.3s" color="#fb8136" />
    <MovingNode x={110} y={40} dur="1.9s" color="#ffb94c" />
  </svg>
);
export default Step0Server;
