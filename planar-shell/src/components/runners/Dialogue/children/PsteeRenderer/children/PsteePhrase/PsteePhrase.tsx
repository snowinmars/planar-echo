import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import { isNothing } from '@planar/shared';

import type { FC } from 'react';
import type { CurrentDialogueView } from '@/components/runners/Dialogue/store/dialogueViewStore.types';
import type { TlkSource } from '@/components/runners/Dialogue/store/tlkStore.types';
import type { DialogueStore } from '@/components/runners/Dialogue/store/dialogueStore.types';

import styles from './PsteePhrase.module.scss';

type PsteePhraseProps = Readonly<{
  view: CurrentDialogueView;
  tlkSource: TlkSource;
  loading: boolean;
  selectResponse: DialogueStore['selectResponse'];
}>;
export const PsteePhrase: FC<PsteePhraseProps> = ({
  view,
  tlkSource,
  loading,
  selectResponse,
}: PsteePhraseProps) => {
  return (
    <>
      <div className={styles.says}>
        {
          view.says.map(say => (
            <div className={styles.say} key={say.sayId}>
              {
                tlkSource.lines.get(say.textRef)!
                  .split('\\n')
                  .map((x, i) => <Typography className={styles.line} key={i}>{x}</Typography>)
              }
            </div>
          ))
        }
      </div>
      <div className={styles.responses}>
        {
          view.responses.map(({ response, index, kind, marker }) => (
            <Button
              key={response.responseId}
              className={clsx(
                styles.response,
                view.useTwoColumns ? styles.twoColumnResponse : styles.oneColumnResponse,
              )}
              disabled={loading}
              onClick={() => {
                selectResponse(response, 'pstee').catch((error: unknown) => console.error(error));
              }}
            >
              <Typography>{index + 1}</Typography>
              <span className={styles.responseDivider}>.</span>

              <Typography>{isNothing(response.responseRef) ? '…' : tlkSource.lines.get(response.responseRef)}</Typography>

              {
                kind !== 'default' && (
                  <Typography
                    className={clsx(
                      kind === 'destructor' && styles.disposers,
                      kind === 'extern' && styles.externs,
                    )}
                  >
                    {marker}
                  </Typography>
                )
              }
            </Button>
          ))
        }
      </div>
    </>
  );
};

export default PsteePhrase;
