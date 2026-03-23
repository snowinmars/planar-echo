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

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { GameName, GameLanguage } from '@planar/shared';

import styles from './Step1.module.scss';

const gameNames: Record<GameName, string> = {
  bg1: 'landing.step1.gameNames.bg1',
  bg1ee: 'landing.step1.gameNames.bg1ee',
  bg2: 'landing.step1.gameNames.bg2',
  bg2ee: 'landing.step1.gameNames.bg2ee',
  iwd: 'landing.step1.gameNames.iwd',
  iwdee: 'landing.step1.gameNames.iwdee',
  iwd2: 'landing.step1.gameNames.iwd2',
  iwd2ee: 'landing.step1.gameNames.iwd2ee',
  pst: 'landing.step1.gameNames.pst',
  pstee: 'landing.step1.gameNames.pstee',
};

type Step1Props = WithClassName & Readonly<{
  setStatus: (x: boolean) => void;
  setGameLanguage: (x: GameLanguage) => void;
  setGameName: (x: GameName) => void;
  imageUrl: string;
}>;
const Step1: FC<Step1Props> = (props) => {
  const { i18n, t } = useTranslation();
  const [languages] = useState(() => getNativeLangNames(i18n.options.resources || {}));
  const [gameLanguage, setGameLanguage] = useState<GameLanguage | ''>('');
  const [gameName, setGameName] = useState<GameName | ''>('');

  useEffect(() => {
    props.setStatus(!!gameLanguage && !!gameName);
    if (gameLanguage !== '') props.setGameLanguage(gameLanguage);
    if (gameName !== '') props.setGameName(gameName);
  }, [gameLanguage, gameName]);

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
            value={gameName}
            onChange={(e) => {
              setGameName(e.target.value as GameName);
            }}
            label={t('landing.step1.gameName')}
            labelId="landing-step1-gameName-label"
            fullWidth
          >
            {

              Object.entries(gameNames).map(([key, name]) => (
                <MenuItem key={key} value={key}>
                  <Typography>{name}</Typography>
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
            value={gameLanguage}
            onChange={(e) => {
              setGameLanguage(e.target.value as GameLanguage);
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
