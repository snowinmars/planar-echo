import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { clsx } from 'clsx';
import StepLoader from '../../children/StepLoader/StepLoader';
import Comment from './children/Comment/Comment';
import Content from './children/Content/Content';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep4 } from '../../store/types';

import styles from './Step4.module.scss';

type Step4Props = WithClassName & Readonly<{
  disabled: boolean;
  imageUrl: string;
  ghostPath: LandingStateStep4['ghostPath'];
  setGhostPath: LandingStateStep4['setGhostPath'];
  loading: LandingStateStep4['step4Loading'];
  comment: LandingStateStep4['step4Comment'];
  commentArgs: LandingStateStep4['step4CommentArgs'];
  resultType: LandingStateStep4['step4ResultType'];
  validate: LandingStateStep4['step4Validate'];
}>;
const Step4: FC<Step4Props> = (props: Step4Props) => {
  return (
    <Card className={clsx(styles.card, props.className)}>
      <CardMedia
        className={clsx((props.loading || props.disabled) && styles.disabledImage)}
        component="img"
        height="140"
        image={props.imageUrl}
        alt="Choose output path"
      />
      <CardContent className={styles.cardContent}>
        <StepLoader show={props.loading} />

        <Content
          disabled={props.disabled}
          ghostPath={props.ghostPath}
          setGhostPath={props.setGhostPath}
          loading={props.loading}
          validate={props.validate}
        />

        <Comment
          comment={props.comment}
          commentArgs={props.commentArgs}
          resultType={props.resultType}
        />
      </CardContent>
    </Card>
  );
};

export default Step4;
