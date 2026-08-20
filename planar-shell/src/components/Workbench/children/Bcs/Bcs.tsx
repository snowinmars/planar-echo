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
import { useBcsStore } from './store/bcsStore';
import { useBcsWidgetBridge } from './useBcsWidgetBridge';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';
import type { GhostBcsBlockScope, Maybe } from '@planar/shared';

// import styles from './Bcs.module.scss';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const Scope: FC<Readonly<{ title: string; scope: GhostBcsBlockScope }>> = ({ title, scope }) => (
  <Accordion slotProps={{ transition: { unmountOnExit: true } }}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography>{title}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <T title="weight" value={scope.weight} />
      <T title="temps" value={JSON.stringify(scope.temps)} />
      {
        scope.functions.map((fn, i) => (
          <Accordion key={`${title}_fn_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{fn.name}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <T title="name" value={fn.name} />
              <T title="negated" value={String(fn.negated)} />
              <T title="args" value={JSON.stringify(fn.args)} />
            </AccordionDetails>
          </Accordion>
        ))
      }
    </AccordionDetails>
  </Accordion>
);

const Bcs: FC = () => {
  useBcsWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'bcs');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentBcs,
    disposeBcs,
  } = useBcsStore(useShallow(state => ({
    loading: state.loading,
    currentBcs: state.currentBcs,
    disposeBcs: state.disposeBcs,
  })));

  useEffect(() => () => disposeBcs(), [disposeBcs]);

  if (loading && !currentBcs) return <CircularProgress />;
  if (!currentBcs) return null;

  return (
    <div>
      <T title="resourceName" value={currentBcs.resourceName} />
      <T title="blocks" value={currentBcs.blocks.length} />
      {
        currentBcs.blocks.map((block, i) => (
          <Accordion key={`bcs_block_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>
                block
                {' '}
                {i}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Scope title="condition" scope={block.condition} />
              {
                block.actions.map((action, j) => (
                  <Scope key={`bcs_block_${i}_action_${j}`} title={`action ${j}`} scope={action} />
                ))
              }
            </AccordionDetails>
          </Accordion>
        ))
      }
    </div>
  );
};

export default Bcs;
