import { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';
import type {
  GameLanguage,
  Maybe,
  NpcDialogue,
  Say,
  Response,
  StateId,
} from '@planar/shared';

import styles from './PsteeRenderer.module.scss';

const isDestructor = (stateId: StateId) => stateId.endsWith('destructor');

const chooseStartingStateId = (tree: NpcDialogue): StateId => {
  for (const [stateId, weight] of tree.constructorsWeights) {
    const s = tree.tree.get(stateId)!;
    if (s.args?.onlyIf?.()) return stateId;
  }

  return tree.tree.keys().next().value!;
};

type State = Readonly<{
  says: Say[];
  responses: Response[];
}>;
const toState = (tree: NpcDialogue, stateId: StateId): State => {
  const gameLanguage = planarLocalStorage.get<GameLanguage>('gameLanguage')!;
  const state = tree.tree.get(stateId)!;
  const says = state.says.get(gameLanguage)!;
  const responses = state.responses.get(gameLanguage)!;

  return {
    says,
    responses,
  };
};
type PsteeRendererProps = Readonly<{
  tree: Maybe<NpcDialogue>;
  exitDialogue: () => void;
}>;
const PsteeRenderer: FC<PsteeRendererProps> = (props: PsteeRendererProps) => {
  if (!props.tree) return null;

  const [stateId, setStateId] = useState<StateId>(() => chooseStartingStateId(props.tree!));
  const [state, setState] = useState<State>(() => toState(props.tree!, stateId));

  useEffect(() => {
    if (!isDestructor(stateId)) setState(toState(props.tree!, stateId));
  }, [stateId]);

  useEffect(() => {
    const stateId = chooseStartingStateId(props.tree!);
    setStateId(stateId);
  }, [props.tree]);

  return (
    <div>
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
          state.responses.map((response, i) => (
            <Button
              className={styles.response}
              onClick={() => {
                if (isDestructor(response.jumpTo)) {
                  props.exitDialogue();
                }
                else {
                  setStateId(response.jumpTo);
                }
              }}
              key={response.responseId}
            >
              <Typography>{i}</Typography>
              <span className={styles.responseDivider}>.</span>
              <Typography>{response.what}</Typography>
            </Button>
          ))
        }
      </div>
    </div>
  );
};

export default PsteeRenderer;
