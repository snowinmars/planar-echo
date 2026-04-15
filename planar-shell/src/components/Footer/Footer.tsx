import Link from '@mui/material/Link';
import EmailIcon from '@mui/icons-material/Email';
import Telegram from '@/svg/telegram';
import Github from '@/svg/github';

import type { FC } from 'react';

import styles from './footer.module.scss';

const Footer: FC = () => (
  <footer className={styles.footer}>
    <Link
      className={styles.license}
      href="https://github.com/snowinmars/planar-echo/blob/master/LICENSE"
      target="_blank"
      rel="noopener"
    >
      GNU/GPLv3
    </Link>

    <Link
      href="mailto:snowinmars@yandex.ru"
      target="_blank"
      rel="noopener"
    >
      <EmailIcon className={styles.email} />
    </Link>
    <Link
      href="https://t.me/snowinmars"
      target="_blank"
      rel="noopener"
    >
      <Telegram className={styles.telegram} />
    </Link>
    <Link
      href="https://github.com/snowinmars/planar-echo/"
      target="_blank"
      rel="noopener"
    >
      <Github className={styles.github} />
    </Link>
  </footer>
);

export default Footer;
