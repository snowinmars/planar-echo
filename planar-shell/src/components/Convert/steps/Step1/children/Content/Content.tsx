import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';

import { gameNames, objectEntries } from '@planar/shared';

import type { FC } from 'react';

import type { LandingStateStep1 } from '@/components/Convert/store/types';
import type { NativeLang } from '@/shared/getNativeLangNames';

import styles from './Content.module.scss';

type ContentProps = Readonly<{
  disabled: boolean;
  gameName: LandingStateStep1['gameName'];
  gameLanguage: LandingStateStep1['gameLanguage'];
  setGameName: LandingStateStep1['setGameName'];
  setGameLanguage: LandingStateStep1['setGameLanguage'];
  languages: NativeLang[];
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();
  return (
    <>
      <FormControl
        className={styles.inputWrapper}
        fullWidth
      >
        <InputLabel id="landing-step1-gameName-label">{t('landing.step1.gameName')}</InputLabel>
        <Select
          disabled={props.disabled}
          value={props.gameName}
          onChange={(e) => {
            props.setGameName(e.target.value);
          }}
          label={t('landing.step1.gameName')}
          labelId="landing-step1-gameName-label"
          fullWidth
        >
          {
            objectEntries(gameNames).map(([key, name]) => (
              <MenuItem key={key} value={key} disabled={key !== 'pstee'}>
                <Typography>{t(name)}</Typography>
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>

      <FormControl
        className={styles.inputWrapper}
        fullWidth
      >
        <InputLabel id="landing-step1-gameLanguage-label">{t('landing.step1.gameLanguage')}</InputLabel>
        <Select
          disabled={props.disabled}
          value={props.gameLanguage}
          onChange={(e) => {
            props.setGameLanguage(e.target.value);
          }}
          label={t('landing.step1.gameLanguage')}
          labelId="landing-step1-gameLanguage-label"
          fullWidth
        >
          {
            props.languages.map(lang => (
              <MenuItem key={lang.code} value={lang.code}>
                <Typography>{lang.name}</Typography>
              </MenuItem>
            ))
          }
        </Select>
      </FormControl>
    </>
  );
};

export default Content;
