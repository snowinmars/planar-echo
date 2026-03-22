import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import type { FC } from 'react';

import styles from './RunnerGuard.module.scss';

const RunnerGuard: FC = () => {
  return (
    <div className={styles.guard}>
      <Button>
        Check may I
        <br />
        play the game right now
      </Button>
    </div>
  );
};

export default RunnerGuard;
