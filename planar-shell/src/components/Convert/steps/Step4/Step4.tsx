import { clsx } from 'clsx';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import StepLoader from '../../StepLoader';
import Comment from './children/Comment/Comment';
import Content from './children/Content/Content';
import Step4Folder from '@/svg/convert/Step4Folder';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep4 } from '../../store/types';

import styles from './Step4.module.scss';

type Step4Props = WithClassName & Readonly<{
  disabled: boolean;
  valid: boolean;
  ghostDir: LandingStateStep4['ghostDir'];
  setGhostDir: LandingStateStep4['setGhostDir'];
  loading: LandingStateStep4['step4Loading'];
  comment: LandingStateStep4['step4Comment'];
  commentArgs: LandingStateStep4['step4CommentArgs'];
  resultType: LandingStateStep4['step4ResultType'];
  validate: LandingStateStep4['step4Validate'];
}>;
const Step4: FC<Step4Props> = (props: Step4Props) => {
  return (
    <Card className={clsx(styles.card, props.className)}>

      <Step4Folder className={
        clsx(
          styles.stepImage,
          props.valid && styles.valid,
          (props.loading || props.disabled) && styles.disabledImage,
        )
      }
      />

      <CardContent className={styles.cardContent}>
        <StepLoader show={props.loading} />

        <Content
          disabled={props.disabled}
          ghostDir={props.ghostDir}
          setGhostDir={props.setGhostDir}
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
