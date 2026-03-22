import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';
import Step1 from './steps/Step1/Step1';
import Step2 from './steps/Step2/Step2';
import Step3 from './steps/Step3/Step3';
import Step4 from './steps/Step4/Step4';
import { Paper } from '@mui/material';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';

import type { FC } from 'react';

import styles from './Landing.module.scss';
import RunnerGuard from './children/RunnerGuard/RunnerGuard';

type Language = 'ru' | 'en';

const Landing: FC = () => {
  const { t } = useTranslation();
  const [step1Status, setStep1Status] = useState(false);
  const [step2Status, setStep2Status] = useState(false);
  const [step3Status, setStep3Status] = useState(false);
  const [step4Status, setStep4Status] = useState(false);

  const [lang, setLang] = useState<Language>('ru');
  const [weiduExePath, setWeiduExePath] = useState('');

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Planar echo
          </Typography>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>

      <Container>
        {/* <Typography>{t('landing.welcome1')}</Typography>
        <Typography>{t('landing.welcome2')}</Typography> */}

        <Paper elevation={0} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4">Hi.</Typography>

          <Typography color="text.secondary">
            This is planar-echo: an open source tool for converting classic Infinity Engine games into game on custom engine, that will run everywhere.
          </Typography>

          <Typography color="error">
            Tech demo build v0.0.1
          </Typography>
        </Paper>

        <Grid container spacing="1em">
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="h4">Long story short</Typography>

            <Typography color="text.secondary">
              Planar echo does require original game to work, because the tool know nothing about the game.
            </Typography>

            <Typography color="text.secondary">
              Run this tool agaist Infinity Engine game - and get linux/android/web/windows version of the same game.
            </Typography>

            <Typography color="text.secondary">
              Requirements: node js to run the planar-echo and the game you own.
            </Typography>

            <Link component={RouterLink} to="/details">Read more</Link>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <RunnerGuard />
          </Grid>
        </Grid>

        <Grid container spacing="1em">
          <Grid size={{ xs: 12, md: 6 }}>
            <Step1
              className={styles.step1}
              setStatus={(x) => {
                setStep1Status(x);
              }}
              setLang={(x: Language) => {
                setLang(x);
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
              imageUrl="https://d.newsweek.com/en/full/2271421/german-shepherd-puppy.jpg"
              weiduExePath={weiduExePath}
              lang={lang}
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
        </Grid>

      </Container>
    </>
  );
};

export default Landing;
