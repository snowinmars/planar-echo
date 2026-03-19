import { Trans, useTranslation } from "react-i18next";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import LanguageSwitcher from "../LanguageSwitcher";
import ThemeSwitcher from "../ThemeSwitcher";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import type { FC } from "react";

import styles from './Landing.module.scss';

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

      <Typography>{t('landing.welcome1')}</Typography>
      <Typography>{t('landing.welcome2')}</Typography>

      <Grid>
        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">{t('landing.welcome3')}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">{t('landing.welcome4')}</Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="body2" color="text.secondary">{t('landing.welcome5')}</Typography>
          </CardContent>
        </Card>
      </Grid>

      <FormGroup>
        <FormControlLabel
          required
          control={<Checkbox />}
          label={t('landing.checkbox1')}
        />
      </FormGroup>
    </>
  )
}

export default Landing;
