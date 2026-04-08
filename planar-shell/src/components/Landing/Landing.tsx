import { useTranslation } from 'react-i18next';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import { useLandingStore } from './store/store';
import RunnerGuard from './children/RunnerGuard/RunnerGuard';
import Step0 from './steps/Step0/Step0';
import Step1 from './steps/Step1/Step1';
import Step2 from './steps/Step2/Step2';
import Step3 from './steps/Step3/Step3';
import Step5 from './steps/Step5/Step5';
import Step6 from './steps/Step6/Step6';

import type { FC } from 'react';
import type { GameLanguage, GameName } from '@planar/shared';

import styles from './Landing.module.scss';

const Landing: FC = () => {
  const { t } = useTranslation();
  const store = useLandingStore();

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
          <Step0
            className={styles.step0}
            disabled={store.step0Loading}
            serverUrl={store.serverUrl}
            setServerUrl={store.setServerUrl}
            loading={store.step0Loading}
            comment={store.step0Comment}
            commentArgs={store.step0CommentArgs}
            resultType={store.step0ResultType}
            validate={store.step0Validate}
            imageUrl="https://avatars.mds.yandex.net/i?id=517fdbf2c25f94655d3f31341743d81b_l-8425660-images-thumbs&n=13"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step1
            className={styles.step1}
            disabled={store.step6Loading}
            gameLanguage={store.gameLanguage}
            gameName={store.gameName}
            setGameLanguage={store.setGameLanguage}
            setGameName={store.setGameName}
            imageUrl="https://avatars.mds.yandex.net/i?id=9a25abd98c06cce5c0e76311489d05156710b535-8316229-images-thumbs&n=13"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step2
            className={styles.step2}
            disabled={!store.step1Valid}
            loading={store.step2Loading || store.step6Loading}
            weiduExePath={store.weiduExePath}
            setWeiduExePath={store.setWeiduExePath}
            validate={store.step2Validate}
            comment={store.step2Comment}
            commentArgs={store.step2CommentArgs}
            resultType={store.step2ResultType}
            imageUrl="https://i.pinimg.com/736x/87/1f/a9/871fa959ce4ec0caa904a9d8b3f5ec26.jpg"
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step3
            className={styles.step3}
            disabled={!store.step2Valid || store.step6Loading}
            imageUrl="https://d.newsweek.com/en/full/2271421/german-shepherd-puppy.jpg"
            gameLanguage={store.gameLanguage as GameLanguage}
            weiduExePath={store.weiduExePath}
            chitinKeyPath={store.chitinKeyPath}
            setChitinKeyPath={store.setChitinKeyPath}
            loading={store.step3Loading}
            comment={store.step3Comment}
            commentArgs={store.step3CommentArgs}
            resultType={store.step3ResultType}
            validate={store.step3Validate}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Step5
            className={styles.step4}
            disabled={!store.step3Valid || store.step6Loading}
            imageUrl="https://i.pinimg.com/736x/1f/c4/b5/1fc4b52caa1829c75c0aed37cba79394.jpg"
            ownGame={store.ownGame}
            setOwnGame={store.setOwnGame}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Step6
            disabled={!store.step5Valid}
            loading={store.step6Loading}
            gameName={store.gameName as GameName}
            gameLanguage={store.gameLanguage as GameLanguage}
            weiduExePath={store.weiduExePath}
            chitinKeyPath={store.chitinKeyPath}
            progress={store.progress}
            biff2json={store.biff2json}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Landing;
