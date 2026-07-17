import { useTranslation } from 'react-i18next';
import { clsx } from 'clsx';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Ussr from '@/svg/ussr';
import StepLoader from '../../StepLoader';
import Step5Shield from '@/svg/convert/Step5Shield';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep5 } from '../../store/types';

import styles from './Step5.module.scss';

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
          value={props.ownGame}
          control={(
            <Checkbox
              className={styles.checkbox}
              disabled={props.disabled}
              value={props.ownGame}
              onChange={e => props.setOwnGame(e.target.checked)}
              checkedIcon={<Ussr className={styles.checkboxIcon} />}
            />
          )}
          label={t('landing.step5.ownGame')}
        />

        <Typography>
          {t('landing.step5.comment')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Step5;
