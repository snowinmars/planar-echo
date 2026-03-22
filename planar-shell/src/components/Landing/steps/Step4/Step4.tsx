import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { clsx } from 'clsx';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './Step4.module.scss';
import Ussr from '@/svg/ussr';

type Step4Props = WithClassName & Readonly<{
  disabled: boolean;
  setStatus: (x: boolean) => void;
  imageUrl: string;
}>;
const Step4: FC<Step4Props> = ({
  className,
  disabled,
  setStatus,
  imageUrl,
}) => {
  const { t } = useTranslation();
  const [ownGame, setOwnGame] = useState(false);

  useEffect(() => {
    setStatus(ownGame);
  }, [ownGame]);

  return (
    <Card className={className}>
      <CardMedia
        className={clsx(disabled && styles.disabledImage)}
        component="img"
        height="140"
        image={imageUrl}
        alt="I own the game"
      />
      <CardContent>
        <FormControlLabel
          value={ownGame}
          onChange={(_, e) => setOwnGame(e)}
          disabled={disabled}
          control={(
            <div className={clsx(styles.wrapper, ownGame && styles.checked)}>
              <Checkbox
                disabled={disabled}
                checkedIcon={<Ussr className={styles.checkboxIcon} />}
              />
            </div>
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
