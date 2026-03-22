import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';

import { clsx } from 'clsx';
import Comment from './children/Comment/Comment';
import Loading from './children/Loading/Loading';

import { useEffect, type FC } from 'react';

import styles from './Step2.module.scss';
import useWeiduValidation from './stores/store';
import Content from './children/Content/Content';
import type { WithClassName } from '@/types/fcWithClassName';

type Step2Props = WithClassName & Readonly<{
  disabled: boolean;
  setStatus: (x: boolean) => void;
  setWeiduExePath: (x: string) => void;
  imageUrl: string;
}>;
const Step2: FC<Step2Props> = ({
  className,
  disabled,
  setStatus,
  imageUrl,
  setWeiduExePath,
}) => {
  const {
    path,
    loading,
    comment,
    status,
    setPath,
    validate,
  } = useWeiduValidation(setStatus);

  useEffect(() => {
    setWeiduExePath(path);
  }, [path]);

  return (
    <Card className={clsx(styles.card, className)}>
      <CardMedia
        className={clsx((loading || disabled) && styles.disabledImage)}
        component="img"
        height="140"
        image={imageUrl}
        alt="Choose weidu.exe path"
      />
      <CardContent className={styles.cardContent}>
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
