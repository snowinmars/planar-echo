import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import clsx from 'clsx';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import getNativeLangNames from '@/shared/getNativeLangNames';
import Step1Game from '@/svg/convert/Step1Game';

import StepLoader from '../../StepLoader';
import Comment from './children/Comment/Comment';
import Content from './children/Content/Content';

import type { FC } from 'react';

import type { WithClassName } from '@/types/fcWithClassName';

import type { LandingStateStep1 } from '../../store/types';

import styles from './Step1.module.scss';

type Step1Props = WithClassName & Readonly<{
  disabled: boolean;
  valid: boolean;
  loading: LandingStateStep1['step1Loading'];
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

      <Step1Game className={
        clsx(
          styles.stepImage,
          props.valid && styles.valid,
          props.disabled && styles.disabledImage,
        )
      }
      />

      <CardContent className={styles.cardContent}>
        <StepLoader show={props.loading} />

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
