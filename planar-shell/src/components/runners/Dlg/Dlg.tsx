import { lazy, useEffect } from 'react';
import { nothing } from '@planar/shared';
import { useDlgWidgetBridge } from './useDlgWidgetBridge';
import planarLocalStorage from '@/shared/planarLocalStorage';
import { useSearchParams } from 'react-router';
import {
  dlgFeatureModules,
  useDlgStore,
} from './store/di';
import { useFeatureLease, useLocalStorageStore } from '@/engine/store/planarRuntime';

import type { StateId, Maybe } from '@planar/shared';
import type { FC } from 'react';
import type { Widget } from '@/shared/widget';

import styles from './Dlg.module.scss';

const PsteeRenderer = lazy(() => import('./children/PsteeRenderer'));
const NarratRenderer = lazy(() => import('./children/NarratRenderer'));

const Dlg: FC = () => {
  useFeatureLease(dlgFeatureModules);
  useDlgWidgetBridge();

  const [searchParams] = useSearchParams();
  const loadDlg = useDlgStore(x => x.loadDlg);
  useEffect(() => {
    if (!searchParams.size) return;
    const dlgId = searchParams.get('dlgId');
    const stateId = searchParams.get('stateId') ?? nothing();
    if (dlgId) {
      loadDlg(dlgId, stateId as StateId, 'dlg-route').catch((e: unknown) => console.error(e)); // TODO [snow]: wrong typing, could I throw if stateId is out of type range?;
    }
  }, [loadDlg, searchParams]);

  useEffect(() => {
    planarLocalStorage.set<Maybe<Widget>>(planarLocalStorage.currentWidget, 'dlg');
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
