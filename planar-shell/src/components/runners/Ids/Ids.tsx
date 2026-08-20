import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useIdsStore } from './store/idsStore';
import { useIdsWidgetBridge } from './useIdsWidgetBridge';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { Maybe } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Ids: FC = () => {
  useIdsWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'ids');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentIds,
    disposeIds,
  } = useIdsStore(useShallow(state => ({
    loading: state.loading,
    currentIds: state.currentIds,
    disposeIds: state.disposeIds,
  })));

  useEffect(() => () => disposeIds(), [disposeIds]);

  if (loading && !currentIds) return <CircularProgress />;
  if (!currentIds) return null;

  const entries = [...currentIds.entries.entries()];

  return (
    <div>
      <T title="resourceName" value={currentIds.resourceName} />
      <T title="wrongSignature" value={currentIds.header.wrongSignature} />
      <T title="wrongEntryCount" value={currentIds.header.wrongEntryCount} />
      <T title="entries" value={entries.length} />
      {entries.map(([key, names]) => <T title={key.toString()} value={names.join(', ')} />)}
    </div>
  );
};

export default Ids;
