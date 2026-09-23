import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { clsx } from 'clsx';
import { useTranslation } from 'react-i18next';

import Step5Shield from '@/svg/convert/Step5Shield';

import StepLoader from '../../StepLoader';

import type { FC } from 'react';

import type { WithClassName } from '@/types/fcWithClassName';

import type { LandingStateStep5 } from '../../store/types';

import styles from './Step5.module.scss';

const LEGAL_URL = 'https://github.com/snowinmars/planar-echo/blob/master/LEGAL.md';

type Step5Props = WithClassName & Readonly<{
  disabled: boolean;
  valid: boolean;
  loading: LandingStateStep5['step5Loading'];
  ownGame: LandingStateStep5['ownGame'];
  setOwnGame: LandingStateStep5['setOwnGame'];
}>;
const Step5: FC<Step5Props> = (props: Step5Props) => {
  const { t } = useTranslation();

  return (
    <Card className={clsx(styles.card, props.className)}>
      <Step5Shield className={
        clsx(
          styles.stepImage,
          props.valid && styles.valid,
          (props.loading || props.disabled) && styles.disabledImage,
        )
      }
      />

      <CardContent className={styles.cardContent}>
        <StepLoader show={props.loading} />

        <FormControlLabel
          disabled={props.disabled}
          control={(
            <Checkbox
              disabled={props.disabled}
              onChange={e => props.setOwnGame(e.target.checked)}
              checked={props.ownGame}
            />
          )}
          label={t('landing.step5.ownGame')}
        />

        <Typography>
          {t('landing.step5.comment')}
          {' '}
          <Link
            href={LEGAL_URL}
            target="_blank"
            rel="noopener"
          >
            {t('landing.step5.legal')}
          </Link>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Step5;
