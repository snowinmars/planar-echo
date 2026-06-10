import { lazy, useEffect } from 'react';
import { nothing, StateId, type Maybe } from '@planar/shared';
import { useDialogueWidgetBridge } from './useDialogueWidgetBridge';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useSearchParams } from 'react-router';
import { useDialogueStore } from './store/dialogueStore';

import type { FC } from 'react';
import type { Widget } from '@/shared/widget';

import styles from './Dialogue.module.scss';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));
const NarratRenderer = lazy(() => import('./children/NarratRenderer'));
const MobileRenderer = lazy(() => import('./children/MobileRenderer'));

const Dialogue: FC = () => {
  useDialogueWidgetBridge();

  const [searchParams] = useSearchParams();
  if (searchParams.size) {
    const dialogueId = searchParams.get('dialogueId');
    const stateId = searchParams.get('stateId') ?? nothing();
    if (dialogueId) {
      const loadDialogue = useDialogueStore(x => x.loadDialogue);
      loadDialogue(dialogueId, stateId as StateId).catch(e => console.error(e)); // TODO [snow]: wrong typing, could I throw if stateId is out of type range?
    }
  }

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
