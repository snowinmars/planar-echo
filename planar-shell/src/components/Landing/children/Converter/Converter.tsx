import type { FC } from 'react';

import Button from '@mui/material/Button';
import useConverterStore from './stores/store';

type Language = 'ru' | 'en';

type ConverterProps = Readonly<{
  chitinKeyPath: string;
  weiduExePath: string;
  lang: Language;
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
