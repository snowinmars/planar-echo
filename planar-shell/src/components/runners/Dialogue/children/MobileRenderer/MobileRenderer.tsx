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
import MobileHistory from './children/MobileHistory';
import MobilePhrase from './children/MobilePhrase';
import clsx from 'clsx';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './MobileRenderer.module.scss';

const MobileRenderer: FC<WithClassName> = ({ className }) => {
  const phraseLoading = useDialogueStore(x => x.loading);
  const selectResponse = useDialogueStore(x => x.selectResponse);

  const view = useDialogueViewStore(state => state.view);
  const tlkSource = useTlkStore(state => state.sources.get(sourceId.dialogue) ?? emptyTlkSource);

  if (tlkSource.loading) return (
    <div className={clsx(styles.mobile, className)}>
      <Loading />
    </div>
  );

  if (!view) return (
    <div className={clsx(styles.mobile, className)}>
      <MobileHistory />
    </div>
  );

  return (
    <div className={clsx(styles.narrat, className)}>
      <MobileHistory />
      <MobilePhrase
        view={view}
        tlkSource={tlkSource}
        loading={phraseLoading}
        selectResponse={selectResponse}
      />
    </div>
  );
};

export default MobileRenderer;
