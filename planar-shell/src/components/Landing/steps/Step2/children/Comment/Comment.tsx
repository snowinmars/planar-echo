import { useTranslation } from 'react-i18next';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';
import Link from '@mui/material/Link';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import type { FC } from 'react';

import styles from './Comment.module.scss';
import { ValidationState } from '../../stores/types';

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
      {t(comment)}
    </Typography>
  );

  return (
    <Typography color={colorizeStatus(status)}>
      <Link
        className={styles.link}
        href="https://github.com/WeiDUorg/weidu/releases/tag/v251.00"
        target="_blank"
        rel="noopener"
      >
        {t('landing.step2.weiduLink')}
        <OpenInNewIcon fontSize="small" />
      </Link>
    </Typography>
  );
};

export default Comment;
