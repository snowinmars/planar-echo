import { useTranslation } from 'react-i18next';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';

import type { LandingStateStep4 } from '@/components/Landing/store/types';
import type { FC } from 'react';

import styles from './Comment.module.scss';

const colorize = (status: LandingStateStep4['step4ResultType']): TypographyOwnProps['color'] => {
  switch (status) {
    case 'success': return 'success';
    case 'error': return 'error';
    default: return 'primary';
  }
};

type CommentProps = Readonly<{
  comment: LandingStateStep4['step4Comment'];
  commentArgs: LandingStateStep4['step4CommentArgs'];
  resultType: LandingStateStep4['step4ResultType'];
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
      {t('landing.step4.comments.default')}
    </Typography>
  );
};

export default Comment;
