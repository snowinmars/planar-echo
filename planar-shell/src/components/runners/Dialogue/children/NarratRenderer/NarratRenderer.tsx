import clsx from 'clsx';
import NarratHistory from './children/NarratHistory';
import NarratPhrase from './children/NarratPhrase';
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
  const lines = useTlkStore(state => state.lines);

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
        lines={lines}
        loading={phraseLoading}
        selectResponse={selectResponse}
      />
    </div>
  );
};

export default NarratRenderer;
