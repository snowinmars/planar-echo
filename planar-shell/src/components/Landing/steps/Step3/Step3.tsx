import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { clsx } from 'clsx';
import StepLoader from '../../children/StepLoader/StepLoader';
import Comment from './children/Comment/Comment';
import Content from './children/Content/Content';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep1, LandingStateStep2, LandingStateStep3 } from '../../store/types';

import styles from './Step3.module.scss';

type Step3Props = WithClassName & Readonly<{
  disabled: boolean;
  imageUrl: string;
  gameLanguage: LandingStateStep1['gameLanguage'];
  weiduExePath: LandingStateStep2['weiduExePath'];
  chitinKeyPath: LandingStateStep3['chitinKeyPath'];
  setChitinKeyPath: LandingStateStep3['setChitinKeyPath'];
  loading: LandingStateStep3['step3Loading'];
  comment: LandingStateStep3['step3Comment'];
  commentArgs: LandingStateStep3['step3CommentArgs'];
  resultType: LandingStateStep3['step3ResultType'];
  validate: LandingStateStep3['step3Validate'];
}>;
const Step3: FC<Step3Props> = (props: Step3Props) => {
  return (
    <Card className={clsx(styles.card, props.className)}>
      <CardMedia
        className={clsx((props.loading || props.disabled) && styles.disabledImage)}
        component="img"
        height="140"
        image={props.imageUrl}
        alt="Choose chitin.key path"
      />
      <CardContent className={styles.cardContent}>
        <StepLoader show={props.loading} />

        <Content
          disabled={props.disabled}
          gameLanguage={props.gameLanguage}
          weiduExePath={props.weiduExePath}
          chitinKeyPath={props.chitinKeyPath}
          setChitinKeyPath={props.setChitinKeyPath}
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
