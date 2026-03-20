import { useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import Link from "@mui/material/Link";
import Steam from '@/svg/steam';
import Gog from '@/svg/gog';

import type { FC, ChangeEvent } from "react";

import styles from './Landing.module.scss';

const Step1: FC = () => {
  const { t } = useTranslation();
  const [ownGame, setOwnGame] = useState(false);
  const [chitinKeyPath, setChitinKeyPath] = useState<string | null>(null);
  const [chitinKeyPathValid, setChitinKeyPathValid] = useState<boolean | null>(null);

  useEffect(() => {
    const s = new Subscription()
    return () => {

    }
  });

  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        image={`https://avatars.mds.yandex.net/i?id=9a25abd98c06cce5c0e76311489d05156710b535-8316229-images-thumbs&n=13`}
        alt={`Buy game image`}
      />
      <CardContent>
        <Typography
          className={styles.buy}
          variant="body2"
          color="text.secondary"
        >
          {t('landing.welcome3')}
          <Link className={styles.storeLink} href="https://store.steampowered.com/app/466300/Planescape_Torment_Enhanced_Edition/">
            <Steam className={styles.steam} />
          </Link>
          <Link className={styles.storeLink} href="https://www.gog.com/ru/game/planescape_torment_enhanced_edition/">
            <Gog className={styles.gog} />
          </Link>
        </Typography>

        <FormGroup>
          <FormControlLabel
            required
            value={ownGame}
            onChange={(_, x) => setOwnGame(x)}
            control={<Checkbox />}
            label={t('landing.checkbox1')}
          />

          <TextField
            value={chitinKeyPath}
            onChange={x => {
              const candidate = x.target.value;
              setChitinKeyPath(x.target.value);
              validateChitinKeyPath(candidate)
                .then((x) => {
                  setChitinKeyPathValid(x);
                })
                .catch((e: unknown) => {
                  console.error(e);
                  setChitinKeyPathValid(false);
                })
            }}
            placeholder="D:/Games/Planescape/CHITIN.key"
            label={t('landing.chitinKeyInput')}
          />
          {/* <FormControlLabel
            required
            value={chitinKeyPath}
            onChange={(x) => setChitinKeyPath(x.target)}
            control={<TextField />}
            label={t('landing.chitinKeyInput')}
          /> */}
        </FormGroup>
      </CardContent>
    </Card>
  )
}

const Landing: FC = () => {
  const { t } = useTranslation();

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

        <Grid container spacing={'1em'}>
          <Grid size={{xs:12, md:4}} >
            <Step1 />
          </Grid>
          <Grid size={{xs:12, md:4}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{t('landing.welcome4')}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{xs:12, md:4}}>
            <Card>
              <CardContent>
                <Typography variant="body2" color="text.secondary">{t('landing.welcome5')}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>


      </Container>
    </>
  )
}

export default Landing;
