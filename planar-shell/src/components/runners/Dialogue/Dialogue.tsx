import { lazy, useEffect } from 'react';
import { nothing } from '@planar/shared';
import { useDialogueWidgetBridge } from './useDialogueWidgetBridge';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useSearchParams } from 'react-router';
import {
  DialogueRuntimeProvider,
  dialogueFeatureModules,
  useDialogueStore,
  useLocalStorageStore,
} from './store/di';

import type { StateId, Maybe } from '@planar/shared';
import type { FC } from 'react';
import type { Widget } from '@/shared/widget';

import styles from './Dialogue.module.scss';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));
const NarratRenderer = lazy(() => import('./children/NarratRenderer'));
const MobileRenderer = lazy(() => import('./children/MobileRenderer'));

const DialogueContent: FC = () => {
  useDialogueWidgetBridge();

  const [searchParams] = useSearchParams();
  const loadDialogue = useDialogueStore(x => x.loadDialogue);
  useEffect(() => {
    if (!searchParams.size) return;
    const dialogueId = searchParams.get('dialogueId');
    const stateId = searchParams.get('stateId') ?? nothing();
    if (dialogueId) {
      loadDialogue(dialogueId, stateId as StateId, 'dialogue-route').catch(e => console.error(e)); // TODO [snow]: wrong typing, could I throw if stateId is out of type range?;
    }
  }, [loadDialogue, searchParams]);

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'dialogue');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const renderer = useLocalStorageStore(state => state.dialogueRenderer);

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

const Dialogue: FC = () => (
  <DialogueRuntimeProvider modules={dialogueFeatureModules}>
    <DialogueContent />
  </DialogueRuntimeProvider>
);

export default Dialogue;
