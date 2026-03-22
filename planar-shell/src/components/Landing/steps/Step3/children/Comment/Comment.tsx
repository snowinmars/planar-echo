import { useTranslation } from 'react-i18next';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { FC } from 'react';

import styles from './Comment.module.scss';
import { ValidationState } from '../../stores/types';
import Steam from '@/svg/steam';
import Gog from '@/svg/gog';
import clsx from 'clsx';

const colorizeStatus = (status: ValidationState['status']): TypographyOwnProps['color'] => {
  switch (status) {
    case 'normal': return 'primary';
    case 'success': return 'success';
    case 'error': return 'error';
    default: return 'primary';
  }
};

type CommentProps = Readonly<{
  comment: ValidationState['comment'];
  status: ValidationState['status'];
}>;
const Comment: FC<CommentProps> = ({ comment, status }) => {
  const { t } = useTranslation();

  if (comment) return (
    <Typography color={colorizeStatus(status)}>
      {comment}
    </Typography>
  );

  return (
    <Typography
      className={styles.comment}
      color={colorizeStatus(status)}
    >
      <Link
        className={styles.link}
        href="https://www.google.ru/search?q=chitin%20key"
        target="_blank"
        rel="noopener"
      >
        {t('landing.step3.chitinKeyLink')}
        <OpenInNewIcon fontSize="small" />
      </Link>

      <Link
        className={clsx(styles.link, styles.storeLink)}
        href="https://store.steampowered.com/app/466300/Planescape_Torment_Enhanced_Edition/"
        target="_blank"
        rel="noopener"
        variant="body2"
      >
        <Steam className={styles.steam} />
      </Link>

      <Link
        className={clsx(styles.link, styles.storeLink)}
        href="https://www.gog.com/en/game/planescape_torment_enhanced_edition"
        target="_blank"
        rel="noopener"
        variant="body2"
      >
        <Gog className={styles.gog} />
      </Link>
    </Typography>
  );
};

export default Comment;
