import Picker from './children/Picker/Picker';
import { lazy, useEffect, useState } from 'react';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { getSkeleton } from './getSkeleton';
import { getTranslation } from './getTranslation';
import { createDialogueLogic, nothing } from '@planar/shared';

import type { FC } from 'react';
import type { Maybe, NpcDialogue } from '@planar/shared';
import type { GameLanguage } from '@/swagger/client';

import styles from './Run.module.scss';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));

const Run: FC = () => {
  const [selectedDialogue, setSelectedDialogue] = useState('');
  const [serverUrl] = useState(() => planarLocalStorage.get('serverUrl')!);
  const [ghostPath] = useState(() => planarLocalStorage.get('ghostPath')!);
  const [gameLanguage] = useState(() => planarLocalStorage.get<GameLanguage>('gameLanguage')!);
  const [tree, setTree] = useState<Maybe<NpcDialogue>>(nothing());

  useEffect(() => {
    console.log(tree);
  }, [tree]);

  useEffect(() => {
    if (!selectedDialogue) return;

    Promise.resolve()
      .then(async () => {
        const skeleton = await getSkeleton(serverUrl, ghostPath, selectedDialogue);
        const translation = await getTranslation(serverUrl, ghostPath, selectedDialogue, gameLanguage);

        const l = createDialogueLogic();
        const s = skeleton(l);
        const t = translation(s);
        setTree(t);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [selectedDialogue]);

  return (
    <>
      <Picker
        onDialogueChange={(x) => {
          setSelectedDialogue(x);
        }}
      />
      <PsteeRenderer
        tree={tree}
        exitDialogue={() => {
          setTree(nothing());
        }}
      />
    </>
  );
};

export default Run;
