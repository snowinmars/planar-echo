import Picker from './children/Picker/Picker';
import { lazy, useEffect } from 'react';
import { useDialogueStore } from './store/dialogueStore';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';

import styles from './Run.module.scss';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));
const NarratRenderer = lazy(() => import('./children/NarratRenderer'));
const MobileRenderer = lazy(() => import('./children/MobileRenderer'));

const Run: FC = () => {
  const tree = useDialogueStore(x => x.tree);

  useEffect(() => {
    console.log(tree);
  }, [tree]);

  const renderer = planarLocalStorage.get<string>('dialogueRenderer', 'pstee-two-columns');

  return (
    <div className={styles.run}>
      <Picker />
      {
        (renderer === 'pstee' || renderer === 'pstee-two-columns') && <PsteeRenderer className={styles.renderer} />
      }
      {
        renderer === 'narrat' && <NarratRenderer className={styles.renderer} />
      }
      {
        renderer === 'mobile' && <MobileRenderer className={styles.renderer} />
      }
    </div>
  );
};

export default Run;
