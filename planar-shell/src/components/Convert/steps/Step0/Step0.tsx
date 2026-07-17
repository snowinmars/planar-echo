import clsx from 'clsx';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Content from './children/Content/Content';
import Comment from './children/Comment/Comment';
import StepLoader from '../../StepLoader';
import Step0Server from '@/svg/convert/Step0Server';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep0 } from '../../store/types';

import styles from './Step0.module.scss';

type Step0Props = WithClassName & Readonly<{
  disabled: boolean;
  valid: boolean;
  serverUrl: LandingStateStep0['serverUrl'];
  setServerUrl: LandingStateStep0['setServerUrl'];
  loading: LandingStateStep0['step0Loading'];
  comment: LandingStateStep0['step0Comment'];
  commentArgs: LandingStateStep0['step0CommentArgs'];
  resultType: LandingStateStep0['step0ResultType'];
  validate: LandingStateStep0['step0Validate'];
}>;
const Step0: FC<Step0Props> = (props) => {
  return (
    <Card className={clsx(styles.card, props.className)}>
      <Step0Server className={
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
          serverUrl={props.serverUrl}
          setServerUrl={props.setServerUrl}
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

export default Step0;
