import { useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { isNothing } from '@planar/shared';
import { usePlaySession } from './engine/usePlaySession.js';
import { playBootFromSearchParams } from './engine/playBootFromSearchParams.js';

import type { FC } from 'react';

const Play: FC = () => {
  const renderHostRef = useRef<HTMLDivElement>(null);
  const [params] = useSearchParams();
  const boot = playBootFromSearchParams(params);
  const {
    tick,
    ticksPaused,
    playSocketState,
    errorText,
    areId,
    setPaused,
  } = usePlaySession(renderHostRef, boot);

  const togglePause = (): void => {
    setPaused(!ticksPaused);
  };

  return (
    <Stack spacing={1} sx={{ height: '70vh' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <Button onClick={togglePause} nativeButton={false}>
          {ticksPaused ? 'Resume' : 'Pause'}
        </Button>

        <Typography sx={{ fontFamily: 'Monospace' }}>
          tick
          {' '}
          {tick}
        </Typography>

        <Typography color="text.secondary">{playSocketState}</Typography>

        { !isNothing(errorText) && <Typography color="error">{errorText}</Typography> }

        { !isNothing(areId) && <Typography color="text.secondary">{areId}</Typography> }
      </Stack>

      <div ref={renderHostRef} style={{ flex: 1, minHeight: 320, width: '100%' }} />
    </Stack>
  );
};

export default Play;
