import { useEffect, useRef } from 'react';
import Typography from '@mui/material/Typography';
import Loading from '@/components/Loading';
import {
  useGameHistoryStore,
  useTlkStore,
} from '@/components/runners/Dialogue/store/di';
import {
  emptyTlkSource,
  sourceId,
} from '@/components/runners/Dialogue/store/tlkStore.types';

import type { FC, UIEvent } from 'react';

import styles from './PsteeHistory.module.scss';

const PsteeHistory: FC = () => {
  const entries = useGameHistoryStore(x => x.entries);
  const loading = useGameHistoryStore(x => x.loading);
  const revision = useGameHistoryStore(x => x.revision);
  const loadOlder = useGameHistoryStore(x => x.loadOlder);
  const loadNewer = useGameHistoryStore(x => x.loadNewer);

  const tlkSource = useTlkStore(state => state.sources.get(sourceId.gameHistory) ?? emptyTlkSource);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrolledRevision = useRef(0);

  useEffect(() => {
    if (tlkSource.loading || scrolledRevision.current === revision) return;
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
    scrolledRevision.current = revision;
  }, [revision, tlkSource.loading]);

  const onScroll = (event: UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    if (element.scrollTop <= 32) loadOlder().catch((error: unknown) => console.error(error));
    if (element.scrollHeight - element.scrollTop - element.clientHeight <= 32) loadNewer().catch((error: unknown) => console.error(error));
  };

  if (loading || tlkSource.loading) return (
    <div className={styles.history} onScroll={onScroll} ref={containerRef}>
      <Loading />
    </div>
  );

  return (
    <div className={styles.history} onScroll={onScroll} ref={containerRef}>
      {
        entries.map((entry) => {
          const lines = entry.tlkRef ? tlkSource.lines.get(entry.tlkRef)!.split('\\n') : ['…'];
          return (
            lines.map((x, i) => (
              <Typography
                className={entry.kind === 'say' ? styles.say : styles.response}
                key={`${entry.sequenceId}_${i}`}
              >
                {x}
              </Typography>
            ))
          );
        })
      }
    </div>
  );
};

export default PsteeHistory;
