import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useEffStore } from './store/effStore';
import { useEffWidgetBridge } from './useEffWidgetBridge';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number | boolean>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value === undefined || value === null ? '' : String(value)} />;

const Eff: FC = () => {
  useEffWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'eff');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentEff,
    disposeEff,
  } = useEffStore(useShallow(state => ({
    loading: state.loading,
    currentEff: state.currentEff,
    disposeEff: state.disposeEff,
  })));

  useEffect(() => () => disposeEff(), [disposeEff]);

  if (loading && !currentEff) return <CircularProgress />;
  if (!currentEff) return null;

  return (
    <div>
      {Object.entries(currentEff).map(([key, value]) => (
        <T
          key={key}
          title={key}
          value={Array.isArray(value) ? value.join(', ') : value}
        />
      ))}
    </div>
  );
};

export default Eff;
