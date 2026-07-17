import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Step0 from './steps/Step0';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import { useLandingStore } from './store';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

import type { FC } from 'react';

import styles from './Convert.module.scss';

const Convert: FC = () => {
  const { t } = useTranslation();
  const store = useLandingStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (store.step6Valid) navigate('/')?.catch(e => console.error(e));
  }, [store.step6Valid]);

  return (
    <Grid container spacing="1em">
      <Grid size={{ xs: 12 }}>
        <Typography variant="h4">{t('landing.intro.convert')}</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Step0
          className={styles.step0}
          disabled={store.step0Loading || store.step6Loading}
          valid={store.step0Valid}
          loading={store.step0Loading || store.step6Loading}
          serverUrl={store.serverUrl}
          setServerUrl={store.setServerUrl}
          comment={store.step0Comment}
          commentArgs={store.step0CommentArgs}
          resultType={store.step0ResultType}
          validate={store.step0Validate}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Step1
          className={styles.step1}
          disabled={!store.step0Valid || store.step6Loading}
          valid={store.step1Valid}
          loading={store.step1Loading || store.step6Loading}
          gameLanguage={store.gameLanguage}
          gameName={store.gameName}
          setGameLanguage={store.setGameLanguage}
          setGameName={store.setGameName}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Step2
          className={styles.step2}
          disabled={!store.step1Valid || store.step2Loading || store.step6Loading}
          valid={store.step2Valid}
          loading={store.step2Loading || store.step6Loading}
          weiduExeDir={store.weiduExeDir}
          setWeiduExeDir={store.setWeiduExeDir}
          validate={store.step2Validate}
          comment={store.step2Comment}
          commentArgs={store.step2CommentArgs}
          resultType={store.step2ResultType}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Step3
          className={styles.step3}
          disabled={!store.step2Valid || store.step3Loading || store.step6Loading}
          valid={store.step3Valid}
          loading={store.step3Loading || store.step6Loading}
          gameLanguage={store.gameLanguage}
          weiduExeDir={store.weiduExeDir}
          chitinKeyFile={store.chitinKeyFile}
          setChitinKeyFile={store.setChitinKeyFile}
          comment={store.step3Comment}
          commentArgs={store.step3CommentArgs}
          resultType={store.step3ResultType}
          validate={store.step3Validate}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Step4
          className={styles.step4}
          disabled={!store.step3Valid || store.step4Loading || store.step6Loading}
          valid={store.step4Valid}
          loading={store.step4Loading || store.step6Loading}
          ghostDir={store.ghostDir}
          setGhostDir={store.setGhostDir}
          comment={store.step4Comment}
          commentArgs={store.step4CommentArgs}
          resultType={store.step4ResultType}
          validate={store.step4Validate}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Step5
          className={styles.step5}
          disabled={!store.step3Valid || !store.step4Valid || store.step6Loading} // because step4 is ghost folder, and it sets from server
          valid={store.step5Valid}
          loading={store.step5Loading || store.step6Loading}
          ownGame={store.ownGame}
          setOwnGame={store.setOwnGame}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Step6
          disabled={!store.step5Valid}
          loading={store.step6Loading}
          gameName={store.gameName}
          gameLanguage={store.gameLanguage}
          weiduExeDir={store.weiduExeDir}
          chitinKeyFile={store.chitinKeyFile}
          progress={store.progress}
          biff2json={store.biff2json}
        />
      </Grid>
    </Grid>
  );
};

export default Convert;
