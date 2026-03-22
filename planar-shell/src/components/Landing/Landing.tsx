import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';
import Step1 from './steps/Step1/Step1';
import Step2 from './steps/Step2/Step2';

import type { FC } from 'react';

import styles from './Landing.module.scss';

const Landing: FC = () => {
  const { t } = useTranslation();
  const [step1Status, setStep1Status] = useState(false);
  const [step2Status, setStep2Status] = useState(false);

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
        <Typography>{t('landing.welcome1')}</Typography>
        <Typography>{t('landing.welcome2')}</Typography>

        <Grid container spacing="1em">
          <Grid size={{ xs: 12, md: 4 }}>
            <Step1
              setStatus={(x) => {
                setStep1Status(x);
              }}
              imageUrl="https://avatars.mds.yandex.net/i?id=9a25abd98c06cce5c0e76311489d05156710b535-8316229-images-thumbs&n=13"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Step2
              disabled={!step1Status}
              setStatus={(x) => {
                setStep2Status(x);
              }}
              imageUrl="https://i.pinimg.com/736x/87/1f/a9/871fa959ce4ec0caa904a9d8b3f5ec26.jpg"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{t('landing.welcome4')}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{t('landing.welcome5')}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

      </Container>
    </>
  );
};

export default Landing;
