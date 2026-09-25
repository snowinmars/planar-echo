import { Outlet } from 'react-router-dom';

import Footer from '../Footer';
import Header from '../Header';

import type { FC } from 'react';

import styles from './Layout.module.scss';

const Layout: FC = () => {
  return (
    <>
      <Header />

      <div className={styles.container}>
        <Outlet />
      </div>

      <Footer />
    </>
  );
};
export default Layout;
