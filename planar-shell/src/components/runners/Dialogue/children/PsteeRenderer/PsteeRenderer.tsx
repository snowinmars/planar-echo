import {
  emptyTlkSource,
  sourceId,
} from '../../store/tlkStore.types';
import {
  useDialogueStore,
  useDialogueViewStore,
  useTlkStore,
} from '../../store/di';
import Loading from '@/components/Loading';
import PsteeHistory from './children/PsteeHistory';
import PsteePhrase from './children/PsteePhrase';
import clsx from 'clsx';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './PsteeRenderer.module.scss';

const PsteeRenderer: FC<WithClassName> = ({ className }) => {
  const phraseLoading = useDialogueStore(x => x.loading);
  const selectResponse = useDialogueStore(x => x.selectResponse);

  const view = useDialogueViewStore(state => state.view);
  const tlkSource = useTlkStore(state => state.sources.get(sourceId.dialogue) ?? emptyTlkSource);

  if (tlkSource.loading) return (
    <div className={clsx(styles.pstee, className)}>
      <Loading />
    </div>
  );

  if (!view) return (
    <div className={clsx(styles.pstee, className)}>
      <PsteeHistory />
    </div>
  );

  return (
    <div className={clsx(styles.pstee, className)}>
      <PsteeHistory />
      <PsteePhrase
        view={view}
        tlkSource={tlkSource}
        loading={phraseLoading}
        selectResponse={selectResponse}
      />
    </div>
  );
};

export default PsteeRenderer;
