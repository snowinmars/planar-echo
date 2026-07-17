import { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import NarrativeTab from './children/NarrativeTab';
import CharactersTab from './children/CharactersTab';
import { useTranslation } from 'react-i18next';
import Divider from '@mui/material/Divider';
import clsx from 'clsx';

import type {FC } from 'react';

import styles from './Stores.module.scss';

const ANIMATION_TIME_MS = 1000;

type TabType = 'narrative' | 'characters';
const Stores: FC = () => {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabType>('narrative');
  const [savedTab, setSavedTab] = useState<TabType | null>(null);

  useEffect(() => {
    // TODO [snow]: it will be better ti say something about saving is done, but it is not important right now
    const timeout = setTimeout(() => {
      setSavedTab(null);
    }, ANIMATION_TIME_MS);

    return () => {
      clearTimeout(timeout);
    };
  }, [savedTab]);

  return (
    <>
      <Typography variant="h4">{t('stores.tabs.title')}</Typography>
      <Tabs value={tab} onChange={(_, v) => setTab(v as TabType)}>
        <Tab
          className={clsx(styles.tab, savedTab === 'narrative' && styles.savedTab)}
          label={t('stores.tabs.narrative.title')}
          value="narrative"
        />
        <Tab
          className={clsx(styles.tab, savedTab === 'characters' && styles.savedTab)}
          label={t('stores.tabs.characters.title')}
          value="characters"
        />
      </Tabs>
      <Divider />
      {tab === 'narrative' && (
        <NarrativeTab onSave={() => setSavedTab('narrative')} />
      )}
      {tab === 'characters' && <CharactersTab onSave={() => setSavedTab('characters')} />}
    </>
  );
};

export default Stores;
