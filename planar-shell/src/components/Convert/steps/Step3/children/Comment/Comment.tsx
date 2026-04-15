import { useTranslation } from 'react-i18next';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Steam from '@/svg/steam';
import Gog from '@/svg/gog';
import clsx from 'clsx';

import type { LandingStateStep3 } from '@/components/Convert/store/types';
import type { FC } from 'react';

import styles from './Comment.module.scss';

const colorize = (status: LandingStateStep3['step3ResultType']): TypographyOwnProps['color'] => {
  switch (status) {
    case 'success': return 'success';
    case 'error': return 'error';
    default: return 'primary';
  }
};

type CommentProps = Readonly<{
  comment: LandingStateStep3['step3Comment'];
  commentArgs: LandingStateStep3['step3CommentArgs'];
  resultType: LandingStateStep3['step3ResultType'];
}>;
const Comment: FC<CommentProps> = ({ comment, commentArgs, resultType }) => {
  const { t } = useTranslation();

  if (comment) return (
    <Typography color={colorize(resultType)}>
      {t(comment, commentArgs)}
    </Typography>
  );

  return (
    <Typography
      className={styles.comment}
      color={colorize(resultType)}
    >
      <Link
        className={styles.link}
        href="https://www.google.ru/search?q=chitin%20key"
        target="_blank"
        rel="noopener"
      >
        {t('landing.step3.comments.default')}
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
