import { lazy, useEffect } from 'react';
import { useDialogueViewBridge } from './useDialogueViewBridge';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';

import styles from './Dialogue.module.scss';
import { Widget } from '@/shared/widget';
import { Maybe } from '@planar/shared';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));
const NarratRenderer = lazy(() => import('./children/NarratRenderer'));
const MobileRenderer = lazy(() => import('./children/MobileRenderer'));

const Dialogue: FC = () => {
  useDialogueViewBridge();

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'dialogue');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const renderer = planarLocalStorage.get<string>('dialogueRenderer', 'pstee-two-columns');

  return (
    <div className={styles.dialogue}>
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

export default Dialogue;
