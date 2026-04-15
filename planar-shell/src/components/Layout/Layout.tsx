import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import ThemeSwitcher from '@/components/ThemeSwitcher';
import { Link as RouterLink } from 'react-router';
import { Outlet } from 'react-router-dom';
import Footer from '../Footer/Footer';

import type { FC } from 'react';

const Layout: FC = () => {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link component={RouterLink} to="/" sx={{ flexGrow: 1 }}>
            Planar echo
          </Link>
          <ThemeSwitcher />
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>

      <Container>
        <Outlet />
      </Container>

      <Footer />
    </>
  );
};
export default Layout;
