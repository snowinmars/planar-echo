import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import { clsx } from 'clsx';
import Comment from './children/Comment/Comment';
import Loading from './children/Loading/Loading';
import useChitinKeyValidation from './stores/store';
import Content from './children/Content/Content';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './Step3.module.scss';

type Language = 'ru' | 'en';

type Step3Props = WithClassName & Readonly<{
  disabled: boolean;
  setStatus: (x: boolean) => void;
  imageUrl: string;
  weiduExePath: string;
  lang: Language;
}>;
const Step3: FC<Step3Props> = ({
  className,
  disabled,
  setStatus,
  imageUrl,
  weiduExePath,
  lang,
}) => {
  const {
    path,
    loading,
    comment,
    status,
    setPath,
    validate,
  } = useChitinKeyValidation(setStatus);

  return (
    <Card className={clsx(styles.card, className)}>
      <CardMedia
        className={clsx((loading || disabled) && styles.disabledImage)}
        component="img"
        height="140"
        image={imageUrl}
        alt="Choose chitin.key path"
      />
      <CardContent>
        <Loading show={loading} />

        <Content
          path={path}
          loading={loading}
          setPath={setPath}
          validate={validate}
          disabled={disabled}
          weiduExePath={weiduExePath}
          lang={lang}
        />

        <Comment comment={comment} status={status} />
      </CardContent>
    </Card>
  );
};

export default Step3;
