import { clsx } from 'clsx';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import StepLoader from '../../StepLoader';
import Comment from './children/Comment/Comment';
import Content from './children/Content/Content';
import Step2WeiDU from '@/svg/convert/Step2WeiDU';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep2 } from '../../store/types';

import styles from './Step2.module.scss';

type Step2Props = WithClassName & Readonly<{
  disabled: boolean;
  valid: boolean;
  weiduExeDir: LandingStateStep2['weiduExeDir'];
  setWeiduExeDir: LandingStateStep2['setWeiduExeDir'];
  loading: LandingStateStep2['step2Loading'];
  comment: LandingStateStep2['step2Comment'];
  commentArgs: LandingStateStep2['step2CommentArgs'];
  resultType: LandingStateStep2['step2ResultType'];
  validate: LandingStateStep2['step2Validate'];
}>;
const Step2: FC<Step2Props> = (props) => {
  return (
    <Card className={clsx(styles.card, props.className)}>
      <Step2WeiDU className={
        clsx(
          styles.stepImage,
          props.valid && styles.valid,
          (props.disabled || props.loading) && styles.disabledImage,
        )
      }
      />
      <CardContent className={styles.cardContent}>
        <StepLoader show={props.loading} />

        <Content
          disabled={props.disabled}
          weiduExeDir={props.weiduExeDir}
          setWeiduExeDir={props.setWeiduExeDir}
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

export default Step2;
