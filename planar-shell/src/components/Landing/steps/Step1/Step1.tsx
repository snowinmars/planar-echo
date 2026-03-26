import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Select from '@mui/material/Select';
import getNativeLangNames from '@/shared/getNativeLangNames';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { gameNames, objectEntries } from '@planar/shared';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { GameName, GameLanguage } from '@planar/shared';

import styles from './Step1.module.scss';

type Step1Props = WithClassName & Readonly<{
  gameName: GameName | '';
  gameLanguage: GameLanguage | '';
  setGameName: (x: GameName) => void;
  setGameLanguage: (x: GameLanguage) => void;
  imageUrl: string;
}>;
const Step1: FC<Step1Props> = (props) => {
  const { i18n, t } = useTranslation();
  const [languages] = useState(() => getNativeLangNames(i18n.options.resources || {}));
  // planarLocalStorage.set('gameLanguage', gameLanguage);

  return (
    <Card className={props.className}>
      <CardMedia
        component="img"
        height="140"
        image={props.imageUrl}
        alt="Choose language"
      />
      <CardContent className={styles.cardContent}>
        <FormControl
          className={styles.inputWrapper}
          fullWidth
        >
          <InputLabel id="landing-step1-gameName-label">{t('landing.step1.gameName')}</InputLabel>
          <Select
            value={props.gameName}
            onChange={(e) => {
              props.setGameName(e.target.value as GameName);
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
            value={props.gameLanguage}
            onChange={(e) => {
              props.setGameLanguage(e.target.value as GameLanguage);
            }}
            label={t('landing.step1.gameLanguage')}
            labelId="landing-step1-gameLanguage-label"
            fullWidth
          >
            {
              languages.map(lang => (
                <MenuItem key={lang.code} value={lang.code}>
                  <Typography>{lang.name}</Typography>
                </MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <Typography>
          <br />
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Step1;
