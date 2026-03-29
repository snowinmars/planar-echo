import { Typography, useTheme } from '@mui/material';
import type { FC } from 'react';

import styles from './Loader.module.scss';
import clsx from 'clsx';

const unify = (value: LoaderProps['value'], variant: LoaderProps['variant']): number => {
  switch (variant) {
    case 'plain': return value;
    case 'percent': {
      const max = 4294967295;
      return Math.round(max * value / 100);
    }
    default: throw new Error(`Out of range variant ${variant}`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};

type LoaderProps = Readonly<{
  value: number;
  loading: boolean;
  variant: 'plain' | 'percent';
  label: string;
}>;
const Loader: FC<LoaderProps> = ({ value, loading, variant, label }: LoaderProps) => {
  const theme = useTheme();
  const chars = unify(value, variant).toString(2).padStart(32, '0').split('');

  // TODO [snow]: bad.
  // Redo with woff colr
  return (
    <div className={styles.loader}>
      <div className={clsx(styles.svgWrapper, loading && styles.loading)}>
        <svg
          className={styles.svg}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <text
            y="1em"
            textLength="100%"
            lengthAdjust="spacing"
          >
            {chars.map((c, i) => {
              const color: string = c === '0' ? theme.palette.text.disabled : theme.palette.success.main;
              return (
                <tspan key={i} fill={color}>{c}</tspan>
              );
            })}
          </text>
        </svg>
      </div>
      <Typography className={styles.label}>{label}</Typography>
    </div>
  );
};

export default Loader;
