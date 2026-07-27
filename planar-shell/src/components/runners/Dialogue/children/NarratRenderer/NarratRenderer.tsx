import clsx from 'clsx';
import Loading from '@/components/Loading';
import NarratHistory from './children/NarratHistory';
import NarratPhrase from './children/NarratPhrase';
import {
  sourceId,
  emptyTlkSource,
} from '../../store/tlkStore.types';
import {
  useDialogueStore,
  useDialogueViewStore,
  useTlkStore,
} from '../../store/di';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './NarratRenderer.module.scss';

const NarratRenderer: FC<WithClassName> = ({ className }) => {
  const phraseLoading = useDialogueStore(x => x.loading);
  const selectResponse = useDialogueStore(x => x.selectResponse);

  const view = useDialogueViewStore(state => state.view);
  const tlkSource = useTlkStore(state => state.sources.get(sourceId.dialogue) ?? emptyTlkSource);

  if (tlkSource.loading) return (
    <div className={clsx(styles.narrat, className)}>
      <Loading />
    </div>
  );

  if (!view) return (
    <div className={clsx(styles.narrat, className)}>
      <NarratHistory />
    </div>
  );

  return (
    <div className={clsx(styles.narrat, className)}>
      <NarratHistory />
      <NarratPhrase
        view={view}
        tlkSource={tlkSource}
        loading={phraseLoading}
        selectResponse={selectResponse}
      />
    </div>
  );
};

export default NarratRenderer;
