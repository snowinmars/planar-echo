import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';

import styles from './Landing.module.scss';
import RunnerGuard from './children/RunnerGuard/RunnerGuard';
import Converter from './children/Converter/Converter';
import Step1 from './steps/Step1/Step1';
import Step2 from './steps/Step2/Step2';
import Step3 from './steps/Step3/Step3';
import Step4 from './steps/Step4/Step4';

import type { FC } from 'react';
import type { GameLanguage, GameName } from '@planar/shared';

const Landing: FC = () => {
  const { t } = useTranslation();
  const [step1Status, setStep1Status] = useState(false);
  const [step2Status, setStep2Status] = useState(false);
  const [step3Status, setStep3Status] = useState(false);
  const [_, setStep4Status] = useState(false);

  const [gameLanguage, setGameLanguage] = useState<GameLanguage | ''>('');
  const [gameName, setGameName] = useState<GameName | ''>('');
  const [weiduExePath, setWeiduExePath] = useState('');
  const [chitinKeyPath, setChitinKeyPath] = useState('');

  return (
    <>
      <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4">{t('landing.intro.1')}</Typography>

        <Typography color="text.secondary">
          {t('landing.intro.2')}
        </Typography>

        <Typography color="error">
          {t('landing.intro.techdemo')}
          {' '}
          v0.0.1
        </Typography>
      </Paper>

      <Grid container spacing="1em">
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="h4">{t('landing.intro.3')}</Typography>

          <Typography color="text.secondary">
            {t('landing.intro.4')}

          </Typography>

          <Typography color="text.secondary">
            {t('landing.intro.5')}

          </Typography>

          <Typography color="text.secondary">
            {t('landing.intro.6')}

          </Typography>

          <Link component={RouterLink} to="/details">{t('landing.intro.details')}</Link>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <RunnerGuard />
        </Grid>
      </Grid>

      <Divider className={styles.divider} />

      <Grid container spacing="1em">
        <Grid size={{ xs: 12 }}>
          <Typography variant="h4">{t('landing.intro.convert')}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step1
            className={styles.step1}
            setStatus={(x) => {
              setStep1Status(x);
            }}
            setGameLanguage={(x: GameLanguage) => {
              setGameLanguage(x);
            }}
            setGameName={(x: GameName) => {
              setGameName(x);
            }}
            imageUrl="https://avatars.mds.yandex.net/i?id=9a25abd98c06cce5c0e76311489d05156710b535-8316229-images-thumbs&n=13"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step2
            className={styles.step2}
            disabled={!step1Status}
            setStatus={(x) => {
              setStep2Status(x);
            }}
            setWeiduExePath={(x) => {
              setWeiduExePath(x);
            }}
            imageUrl="https://i.pinimg.com/736x/87/1f/a9/871fa959ce4ec0caa904a9d8b3f5ec26.jpg"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step3
            className={styles.step3}
            disabled={!step2Status}
            setStatus={(x) => {
              setStep3Status(x);
            }}
            setChitinKeyPath={(x) => {
              setChitinKeyPath(x);
            }}
            imageUrl="https://d.newsweek.com/en/full/2271421/german-shepherd-puppy.jpg"
            weiduExePath={weiduExePath}
            gameLanguage={gameLanguage as GameLanguage}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step4
            className={styles.step4}
            disabled={!step3Status}
            setStatus={(x) => {
              setStep4Status(x);
            }}
            imageUrl="https://i.pinimg.com/736x/1f/c4/b5/1fc4b52caa1829c75c0aed37cba79394.jpg"
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Converter
            weiduExePath={weiduExePath}
            chitinKeyPath={chitinKeyPath}
            gameLanguage={gameLanguage as GameLanguage}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Landing;
