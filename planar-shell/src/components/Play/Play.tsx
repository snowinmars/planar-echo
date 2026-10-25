import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

import { usePlay } from './usePlay';

import type { FC } from 'react';

import styles from './Play.module.scss';

const Play: FC = () => {
  const {
    canvasRef,
    seat,
    status,
    clientOrigin,
    setClientOrigin,
    serverOrigin,
    setServerOrigin,
  } = usePlay();

  return (
    <Stack spacing={2} className={styles.page}>
      <Typography variant="h5">Conformance dot</Typography>

      <Stack direction="row" spacing={1}>
        <Button
          component={RouterLink}
          to="/play?seat=alpha"
          variant={seat === 'alpha' ? 'contained' : 'outlined'}
        >
          alpha
        </Button>
        <Button
          component={RouterLink}
          to="/play?seat=bravo"
          variant={seat === 'bravo' ? 'contained' : 'outlined'}
        >
          bravo
        </Button>
      </Stack>

      <Stack direction="row" spacing={1}>
        <TextField label="clientOrigin" value={clientOrigin} onChange={event => setClientOrigin(event.target.value)} fullWidth />
        <TextField label="serverOrigin" value={serverOrigin} onChange={event => setServerOrigin(event.target.value)} fullWidth />
      </Stack>

      <Typography>{status}</Typography>

      <canvas ref={canvasRef} width={480} height={480} className={styles.canvas} />
    </Stack>
  );
};

export default Play;
