import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

import planarLocalStorage from '@/shared/planarLocalStorage';
import { useGhostRouteId } from '@/shared/useGhostRouteId';

import { useIniStore } from './store/iniStore';
import { useIniWidgetBridge } from './useIniWidgetBridge';

import type { FC } from 'react';

import type { GhostType, Maybe } from '@planar/shared';

type TProps = Readonly<{
  title: string;
  value: Maybe<string | number>;
}>;
const T: FC<TProps> = ({ title, value }: TProps) => <TextField multiline disabled variant="standard" label={title} value={value} />;

const dump = (value: unknown): string => {
  if (value instanceof Map) return JSON.stringify(Object.fromEntries(value));
  return JSON.stringify(value);
};

const Ini: FC = () => {
  useIniWidgetBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<GhostType>>(planarLocalStorage.currentWidget, 'ini');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const {
    loading,
    currentIni,
    loadIni,
    disposeIni,
  } = useIniStore(useShallow(state => ({
    loading: state.loading,
    currentIni: state.currentIni,
    loadIni: state.loadIni,
    disposeIni: state.disposeIni,
  })));

  useGhostRouteId('iniId', loadIni, disposeIni);

  useEffect(() => () => disposeIni(), [disposeIni]);

  if (loading && !currentIni) return <CircularProgress />;
  if (!currentIni) return null;

  return (
    <div>
      <T title="resourceName" value={currentIni.resourceName} />
      {'nameless' in currentIni ? <T title="nameless" value={dump(currentIni.nameless)} /> : null}
      {'namelessvar' in currentIni ? <T title="namelessvar" value={dump(currentIni.namelessvar)} /> : null}
      {'locals' in currentIni ? <T title="locals" value={dump(currentIni.locals)} /> : null}
      {'spawnMain' in currentIni ? <T title="spawnMain" value={dump(currentIni.spawnMain)} /> : null}
      {'general' in currentIni ? <T title="general" value={dump(currentIni.general)} /> : null}
      {'monsterPlanescape' in currentIni ? <T title="monsterPlanescape" value={dump(currentIni.monsterPlanescape)} /> : null}
      {'sounds' in currentIni ? <T title="sounds" value={dump(currentIni.sounds)} /> : null}
      {'numberedSections' in currentIni
        ? currentIni.numberedSections.map(section => (
            <Accordion key={`ini_numbered_${section.name}`} slotProps={{ transition: { unmountOnExit: true } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  numbered
                  {' '}
                  {section.name}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <T title="section" value={dump(section)} />
              </AccordionDetails>
            </Accordion>
          ))
        : null}
      {'groupSections' in currentIni
        ? currentIni.groupSections.map((section, i) => (
            <Accordion key={`ini_group_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{section.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <T title="section" value={dump(section)} />
              </AccordionDetails>
            </Accordion>
          ))
        : null}
      {'creatureSections' in currentIni
        ? currentIni.creatureSections.map((section, i) => (
            <Accordion key={`ini_creature_${i}`} slotProps={{ transition: { unmountOnExit: true } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{section.name}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <T title="section" value={dump(section)} />
              </AccordionDetails>
            </Accordion>
          ))
        : null}
    </div>
  );
};

export default Ini;
