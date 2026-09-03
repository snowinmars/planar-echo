import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useEffect, useRef } from 'react';

import { isNothing } from '@planar/shared';

import { useGameHistoryStore } from '@/components/Workbench/children/Dlg/store/di';
import { useTlkStore } from '@/engine/store/planarRuntime';

import type { FC, UIEvent } from 'react';

import styles from './NarratHistory.module.scss';

const NarratHistory: FC = () => {
  const entries = useGameHistoryStore(x => x.entries);
  const loading = useGameHistoryStore(x => x.loading);
  const revision = useGameHistoryStore(x => x.revision);
  const loadOlder = useGameHistoryStore(x => x.loadOlder);
  const loadNewer = useGameHistoryStore(x => x.loadNewer);

  const lines = useTlkStore(state => state.lines);
  const tlkLoading = useTlkStore(state => state.loading);
  const touchRefs = useTlkStore(state => state.touchRefs);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrolledRevision = useRef(0);

  useEffect(() => {
    const refs = entries
      .map(entry => entry.tlkRef)
      .filter(ref => !isNothing(ref));
    touchRefs(refs);
  }, [entries, revision, touchRefs]);

  useEffect(() => {
    if (tlkLoading || scrolledRevision.current === revision) return;
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
    scrolledRevision.current = revision;
  }, [revision, tlkLoading]);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const bumperPx = 32;
    const atTop = element.scrollTop <= bumperPx;
    const atBottom = element.scrollHeight - element.scrollTop - element.clientHeight <= bumperPx;
    if (atTop) loadOlder().catch((e: unknown) => console.error(e));
    if (atBottom) loadNewer().catch((e: unknown) => console.error(e));
  };

  if (loading) return (
    <div className={styles.history} onScroll={onScroll} ref={containerRef}>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="70%" />
    </div>
  );

  return (
    <div className={styles.history} onScroll={onScroll} ref={containerRef}>
      {
        entries.map((entry) => {
          const text = entry.tlkRef ? lines.get(entry.tlkRef) : undefined;
          if (!text) {
            return (
              <Skeleton
                className={entry.kind === 'say' ? styles.saySkeleton : styles.responseSkeleton}
                key={entry.sequenceId}
                variant="text"
                width="70%"
              />
            );
          }

          return text.split('\\n').map((x, i) => (
            <Typography
              className={entry.kind === 'say' ? styles.say : styles.response}
              key={`${entry.sequenceId}_${i}`}
            >
              {x}
            </Typography>
          ));
        })
      }
    </div>
  );
};

export default NarratHistory;
