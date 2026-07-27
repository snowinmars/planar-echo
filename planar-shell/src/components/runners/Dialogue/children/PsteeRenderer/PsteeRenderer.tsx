import {
  useDialogueStore,
  useDialogueViewStore,
} from '../../store/di';
import { useTlkStore } from '@/engine/store/planarRuntime';
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
  const lines = useTlkStore(state => state.lines);

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
        lines={lines}
        loading={phraseLoading}
        selectResponse={selectResponse}
      />
    </div>
  );
};

export default PsteeRenderer;
