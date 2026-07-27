import { lazy, useEffect } from 'react';
import { nothing } from '@planar/shared';
import { useDialogueWidgetBridge } from './useDialogueWidgetBridge';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useSearchParams } from 'react-router';
import {
  dialogueFeatureModules,
  useDialogueStore,
} from './store/di';
import { useFeatureLease, useLocalStorageStore } from '@/engine/store/planarRuntime';

import type { StateId, Maybe } from '@planar/shared';
import type { FC } from 'react';
import type { Widget } from '@/shared/widget';

import styles from './Dialogue.module.scss';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));
const NarratRenderer = lazy(() => import('./children/NarratRenderer'));

const Dialogue: FC = () => {
  useFeatureLease(dialogueFeatureModules);
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
        (renderer === 'pstee' || renderer === 'pstee-two-columns') && <PsteeRenderer />
      }
      {
        renderer === 'narrat' && <NarratRenderer />
      }
    </div>
  );
};

export default Dialogue;
