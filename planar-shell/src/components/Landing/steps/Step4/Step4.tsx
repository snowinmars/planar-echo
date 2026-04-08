import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { clsx } from 'clsx';
import Ussr from '@/svg/ussr';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep4 } from '../../store/types';

import styles from './Step4.module.scss';

type Step4Props = WithClassName & Readonly<{
  disabled: boolean;
  imageUrl: string;
  ownGame: LandingStateStep4['ownGame'];
  setOwnGame: LandingStateStep4['setOwnGame'];
}>;
const Step4: FC<Step4Props> = (props: Step4Props) => {
  const { t } = useTranslation();

  return (
    <Card className={props.className}>
      <CardMedia
        className={clsx(props.disabled && styles.disabledImage)}
        component="img"
        height="140"
        image={props.imageUrl}
        alt="I own the game"
      />
      <CardContent className={styles.cardContent}>
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
          label={t('landing.step4.ownGame')}
        />

        <Typography>
          {t('landing.step4.comment')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default Step4;
