import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import getNativeLangNames from '@/shared/getNativeLangNames';
import clsx from 'clsx';
import Content from './children/Content/Content';
import Comment from './children/Comment/Comment';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep1 } from '../../store/types';

import styles from './Step1.module.scss';

type Step1Props = WithClassName & Readonly<{
  disabled: boolean;
  imageUrl: string;
  gameName: LandingStateStep1['gameName'];
  gameLanguage: LandingStateStep1['gameLanguage'];
  setGameName: LandingStateStep1['setGameName'];
  setGameLanguage: LandingStateStep1['setGameLanguage'];
}>;
const Step1: FC<Step1Props> = (props) => {
  const { i18n } = useTranslation();
  const [languages] = useState(() => getNativeLangNames(i18n.options.resources || {}));
  // planarLocalStorage.set('gameLanguage', gameLanguage);

  return (
    <Card className={clsx(styles.card, props.className)}>
      <CardMedia
        className={clsx(props.disabled && styles.disabledImage)}
        component="img"
        height="140"
        image={props.imageUrl}
        alt="Choose language"
      />
      <CardContent className={styles.cardContent}>
        <Content
          disabled={props.disabled}
          gameName={props.gameName}
          gameLanguage={props.gameLanguage}
          setGameName={props.setGameName}
          setGameLanguage={props.setGameLanguage}
          languages={languages}
        />

        <Comment />
      </CardContent>
    </Card>
  );
};

export default Step1;
