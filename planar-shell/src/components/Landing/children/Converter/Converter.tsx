import type { FC } from 'react';

import Button from '@mui/material/Button';
import useConverterStore from './stores/store';
import { GameLanguage } from '@planar/shared';

type ConverterProps = Readonly<{
  chitinKeyPath: string;
  weiduExePath: string;
  gameLanguage: GameLanguage;
}>;
const Converter: FC<ConverterProps> = ({
}: ConverterProps) => {
  const { status, setStatus } = useConverterStore();
  return (
    <div>
      <Button
        onClick={() => {
          setStatus('loading');
        }}
      >
        I have space on hdd and want to start
        {status}
      </Button>
    </div>
  );
};
export default Converter;
