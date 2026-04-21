import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';
import IconButton from '@mui/material/IconButton';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslationSvg from '@/svg/translation';

import type { FC } from 'react';

import styles from './Layout.module.scss';

const Layout: FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
            Planar echo
          </Link>
          <IconButton
            component={RouterLink}
            to="/settings"
          >
            <SettingsIcon />
          </IconButton>
          <IconButton
            component={RouterLink}
            to="/settings"
          >
            <TranslationSvg className={styles.languange} />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container className={styles.container}>
        <Outlet />
      </Container>

      <Footer />
    </>
  );
};
export default Layout;
