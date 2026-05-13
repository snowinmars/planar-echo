import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useDialogueStore } from '../../store/dialogueStore';
import { useShallow } from 'zustand/react/shallow';
import { getExternDialogueId, getSaysResponses, isDestructor } from '../../store/helpers';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';
import type { WithClassName } from '@/types/fcWithClassName';

import styles from './NarratRenderer.module.scss';
import clsx from 'clsx';

const NarratRenderer: FC<WithClassName> = ({ className }) => {
  const {
    loading,
    tree,
    gameLanguage,
    currentStateId,
    setCurrentStateId,
    setDialogue,
    disposeDialogue,
  } = useDialogueStore(useShallow(state => ({
    loading: state.loading,
    tree: state.tree,
    gameLanguage: state.gameLanguage,
    currentStateId: state.currentStateId,
    setCurrentStateId: state.setCurrentStateId,
    setDialogue: state.setDialogue,
    disposeDialogue: state.disposeDialogue,
  })));

  if (!tree || !currentStateId) return null;

  const state = getSaysResponses(tree, gameLanguage, currentStateId);

  return (
    <div className={clsx(styles.narrat, className)}>
      <div className={styles.says}>
        {
          state.says.map(say => (
            <div
              className={styles.say}
              key={say.sayId}
            >
              <Typography
                className={styles.who}
                variant="h6"
              >
                {say.whoId}
              </Typography>
              <span className={styles.sayDivider}>:</span>
              <Typography>{say.what}</Typography>
            </div>
          ))
        }
      </div>
      <div className={styles.responses}>
        {
          state.responses.map((response, i) => {
            const destructor = isDestructor(response.jumpTo);
            if (destructor) {
              const markDisposers = planarLocalStorage.get<boolean>('dialogueMarks_markDisposers', true)!;
              return (
                <Button
                  key={response.responseId}
                  className={styles.response}
                  disabled={loading}
                  onClick={() => {
                    disposeDialogue();
                  }}
                >
                  <Typography>{i}</Typography>
                  <span className={styles.responseDivider}>.</span>
                  <Typography>
                    {response.what}
                    <Typography className={styles.disposers}>{markDisposers && `✕`}</Typography>
                  </Typography>
                </Button>
              );
            }

            const externDialogueId = getExternDialogueId(response.responseId, response.jumpTo);
            const isExtern = !!externDialogueId;
            if (isExtern) {
              const markExterns = planarLocalStorage.get<boolean>('dialogueMarks_markExterns', false)!;
              return (
                <Button
                  key={response.responseId}
                  className={styles.response}
                  disabled={loading}
                  onClick={() => {
                    setDialogue(externDialogueId, response.jumpTo).catch(e => console.error(e));
                  }}
                >
                  <Typography>{i}</Typography>
                  <span className={styles.responseDivider}>.</span>
                  <Typography>
                    {response.what}
                    <Typography className={styles.externs}>{markExterns && `→ ${externDialogueId}`}</Typography>
                  </Typography>
                </Button>
              );
            }

            return (
              <Button
                key={response.responseId}
                className={styles.response}
                disabled={loading}
                onClick={() => {
                  setCurrentStateId(response.jumpTo);
                }}
              >
                <Typography>{i}</Typography>
                <span className={styles.responseDivider}>.</span>
                <Typography>{response.what}</Typography>
              </Button>
            );
          })
        }
      </div>
    </div>
  );
};

export default NarratRenderer;
