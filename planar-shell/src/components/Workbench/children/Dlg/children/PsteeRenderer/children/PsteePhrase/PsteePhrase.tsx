import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useEffect } from 'react';

import { isNothing } from '@planar/shared';

import { useTlkStore } from '@/engine/store/planarRuntime';

import type { FC } from 'react';

import type { DlgStore } from '@/components/Workbench/children/Dlg/store/dlgStore.types';
import type { CurrentDlgView } from '@/components/Workbench/children/Dlg/store/dlgViewStore.types';

import styles from './PsteePhrase.module.scss';

type PsteePhraseProps = Readonly<{
  view: CurrentDlgView;
  lines: ReadonlyMap<number, string>;
  loading: boolean;
  selectResponse: DlgStore['selectResponse'];
}>;
export const PsteePhrase: FC<PsteePhraseProps> = ({
  view,
  lines,
  loading,
  selectResponse,
}: PsteePhraseProps) => {
  // TODO [snow]: why there are view.tlkRefs and lines at the same time?
  const touchRefs = useTlkStore(state => state.touchRefs);
  const hasMissingText = view.tlkRefs.some(x => !lines.has(x));

  useEffect(() => {
    touchRefs(view.tlkRefs);
  }, [view, touchRefs]);

  return (
    <>
      <div className={styles.says}>
        {
          view.says.map((say) => {
            const text = lines.get(say.textRef);

            if (text) return (
              <div className={styles.say} key={say.sayId}>
                {
                  text.split('\\n')
                    .map((x, i) => (
                      <Typography className={styles.line} key={i}>{x}</Typography>
                    ))
                }
              </div>
            );

            return (
              <div className={styles.say} key={say.sayId}>
                <Skeleton variant="text" width="80%" />
              </div>
            );
          })
        }
      </div>

      <div className={styles.responses}>
        {
          view.responses.map(({ response, index, kind, marker }) => {
            const responseText = isNothing(response.responseRef)
              ? '…'
              : lines.get(response.responseRef);
            const isUntranslated = isNothing(responseText);

            return (
              <Button
                key={response.responseId}
                className={clsx(
                  styles.response,
                  view.useTwoColumns ? styles.twoColumnResponse : styles.oneColumnResponse,
                )}
                disabled={loading || hasMissingText}
                onClick={() => {
                  selectResponse(response, 'pstee').catch((error: unknown) => console.error(error));
                }}
              >
                <Typography>{index + 1}</Typography>
                <span className={styles.responseDivider}>.</span>

                {
                  isUntranslated
                    ? <Skeleton variant="text" width="60%" />
                    : <Typography>{responseText}</Typography>
                }

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
            );
          })
        }
      </div>
    </>
  );
};

export default PsteePhrase;
