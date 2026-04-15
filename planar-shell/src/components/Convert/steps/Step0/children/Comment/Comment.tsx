import { useTranslation } from 'react-i18next';
import Typography, { TypographyOwnProps } from '@mui/material/Typography';

import type { FC } from 'react';
import type { LandingStateStep3 } from '@/components/Convert/store/types';

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
const Comment: FC<CommentProps> = (props: CommentProps) => {
  const { t } = useTranslation();

  if (props.comment) return (
    <Typography
      className={styles.comment}
      color={colorize(props.resultType)}
    >
      {t(props.comment, props.commentArgs)}
    </Typography>
  );

  return (
    <Typography
      className={styles.comment}
      color={colorize(props.resultType)}
    >
      {t('landing.step0.comments.default')}
    </Typography>
  );
};

export default Comment;
