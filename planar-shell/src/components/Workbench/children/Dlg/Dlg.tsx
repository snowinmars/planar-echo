import { lazy, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router';

import { nothing } from '@planar/shared';

import { useFeatureLease, useLocalStorageStore } from '@/engine/store/planarRuntime';
import planarLocalStorage from '@/shared/planarLocalStorage';

import {
  dlgFeatureModules,
  useDlgStore,
} from './store/di';
import { useDlgWidgetBridge } from './useDlgWidgetBridge';

import type { FC } from 'react';

import type { GhostType, Maybe, StateId } from '@planar/shared';

import styles from './Dlg.module.scss';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));
const NarratRenderer = lazy(() => import('./children/NarratRenderer'));

const Dlg: FC = () => {
  useFeatureLease(dlgFeatureModules);
  useDlgWidgetBridge();

  const { dlgId } = useParams();
  const [searchParams] = useSearchParams();
  const loadDlg = useDlgStore(x => x.loadDlg);
  useEffect(() => {
    if (!dlgId) return;
    const stateId = searchParams.get('stateId') ?? nothing();
    loadDlg(dlgId, stateId as StateId, 'dlg-route').catch((e: unknown) => console.error(e));
  }, [dlgId, loadDlg, searchParams]);

  useEffect(() => {
    planarLocalStorage.set<Maybe<GhostType>>(planarLocalStorage.currentWidget, 'dlg');
    return () => planarLocalStorage.remove(planarLocalStorage.currentWidget);
  }, []);

  const renderer = useLocalStorageStore(state => state.dlgRenderer);

  return (
    <div className={styles.dlg}>
      {
        (renderer === 'pstee' || renderer === 'pstee-two-columns') && <PsteeRenderer />
      }
      {
        renderer === 'narrat' && <NarratRenderer />
      }
    </div>
  );
};

export default Dlg;
