import { useTranslation } from 'react-i18next';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { FC } from 'react';
import type { LandingStateStep2 } from '@/components/Landing/store/types';

import styles from './Comment.module.scss';

const colorize = (status: LandingStateStep2['step2ResultType']): TypographyOwnProps['color'] => {
  switch (status) {
    case 'success': return 'success';
    case 'error': return 'error';
    default: return 'primary';
  }
};

type CommentProps = Readonly<{
  comment: LandingStateStep2['step2Comment'];
  commentArgs: LandingStateStep2['step2CommentArgs'];
  resultType: LandingStateStep2['step2ResultType'];
}>;
const Comment: FC<CommentProps> = ({ comment, commentArgs, resultType }) => {
  const { t } = useTranslation();

  if (comment) return (
    <Typography color={colorize(resultType)}>
      {t(comment, commentArgs)}
    </Typography>
  );

  return (
    <Typography color={colorize(resultType)}>
      <Link
        className={styles.link}
        href="https://github.com/WeiDUorg/weidu/releases/tag/v251.00"
        target="_blank"
        rel="noopener"
      >
        {t('landing.step2.comments.default')}
        <OpenInNewIcon fontSize="small" />
      </Link>
    </Typography>
  );
};

export default Comment;
