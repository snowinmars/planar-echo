import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

import { clsx } from 'clsx';
import Comment from './children/Comment/Comment';
import Loading from './children/Loading/Loading';

import type { FC } from 'react';

import styles from './Step2.module.scss';
import useWeiduValidation from './stores/store';
import Content from './children/Content/Content';

type Step2Props = Readonly<{
  disabled: boolean;
  setStatus: (x: boolean) => void;
  imageUrl: string;
}>;
const Step2: FC<Step2Props> = ({ disabled, setStatus, imageUrl }) => {
  const {
    path,
    loading,
    comment,
    status,
    setPath,
    validate,
  } = useWeiduValidation(setStatus);

  return (
    <Card className={styles.card}>
      <CardMedia
        className={clsx((loading || disabled) && styles.disabledImage)}
        component="img"
        height="140"
        image={imageUrl}
        alt="Buy game image"
      />
      <CardContent>
        <Loading show={loading} />

        <Content
          path={path}
          loading={loading}
          setPath={setPath}
          validate={validate}
          disabled={disabled}
        />

        <Comment comment={comment} status={status} />
      </CardContent>
    </Card>
  );
};

export default Step2;
