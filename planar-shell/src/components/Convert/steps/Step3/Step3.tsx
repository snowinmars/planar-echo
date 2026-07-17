import { clsx } from 'clsx';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import StepLoader from '../../StepLoader';
import Comment from './children/Comment/Comment';
import Content from './children/Content/Content';
import Step3Key from '@/svg/convert/Step3Key';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep1, LandingStateStep2, LandingStateStep3 } from '../../store/types';

import styles from './Step3.module.scss';

type Step3Props = WithClassName & Readonly<{
  disabled: boolean;
  valid: boolean;
  gameLanguage: LandingStateStep1['gameLanguage'];
  weiduExeDir: LandingStateStep2['weiduExeDir'];
  chitinKeyFile: LandingStateStep3['chitinKeyFile'];
  setChitinKeyFile: LandingStateStep3['setChitinKeyFile'];
  loading: LandingStateStep3['step3Loading'];
  comment: LandingStateStep3['step3Comment'];
  commentArgs: LandingStateStep3['step3CommentArgs'];
  resultType: LandingStateStep3['step3ResultType'];
  validate: LandingStateStep3['step3Validate'];
}>;
const Step3: FC<Step3Props> = (props: Step3Props) => {
  return (
    <Card className={clsx(styles.card, props.className)}>

      <Step3Key className={
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
          gameLanguage={props.gameLanguage}
          weiduExeDir={props.weiduExeDir}
          chitinKeyFile={props.chitinKeyFile}
          setChitinKeyFile={props.setChitinKeyFile}
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

export default Step3;
