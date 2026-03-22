import type { FC } from 'react';

import styles from './Converter.module.scss';
import Button from '@mui/material/Button';
import useConverterStore from './stores/store';

type Language = 'ru' | 'en';

type ConverterProps = Readonly<{
  chitinKeyPath: string;
  weiduExePath: string;
  lang: Language;
}>;
const Converter: FC<ConverterProps> = ({
  chitinKeyPath,
  weiduExePath,
  lang,
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
      </Button>
    </div>
  );
};
export default Converter;
