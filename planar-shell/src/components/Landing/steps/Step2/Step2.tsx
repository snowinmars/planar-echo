import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { clsx } from 'clsx';
import Comment from './children/Comment/Comment';
import Loading from './children/Loading/Loading';
import Content from './children/Content/Content';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';
import type { LandingStateStep2 } from '../../store/types';

import styles from './Step2.module.scss';

type Step2Props = WithClassName & Readonly<{
  disabled: boolean;
  imageUrl: string;
  weiduExePath: LandingStateStep2['weiduExePath'];
  setWeiduExePath: LandingStateStep2['setWeiduExePath'];
  loading: LandingStateStep2['step2Loading'];
  comment: LandingStateStep2['step2Comment'];
  commentArgs: LandingStateStep2['step2CommentArgs'];
  resultType: LandingStateStep2['step2ResultType'];
  validate: LandingStateStep2['step2Validate'];
}>;
const Step2: FC<Step2Props> = (props) => {
  return (
    <Card className={clsx(styles.card, props.className)}>
      <CardMedia
        className={clsx((props.disabled || props.loading) && styles.disabledImage)}
        component="img"
        height="140"
        image={props.imageUrl}
        alt="Choose weidu.exe path"
      />
      <CardContent className={styles.cardContent}>
        <Loading show={props.loading} />

        <Content
          disabled={props.disabled}
          weiduExePath={props.weiduExePath}
          setWeiduExePath={props.setWeiduExePath}
          loading={props.loading}
          validate={props.validate}
        />

        <Comment comment={props.comment} commentArgs={props.commentArgs} resultType={props.resultType} />
      </CardContent>
    </Card>
  );
};

export default Step2;
