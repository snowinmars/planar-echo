import Picker from './children/Picker/Picker';
import PsteeRenderer from './children/PsteeRenderer/PsteeRenderer';
import { useEffect } from 'react';
import { useDialogueStore } from './store/dialogueStore';

import type { FC } from 'react';

import styles from './Run.module.scss';

const Run: FC = () => {
  const tree = useDialogueStore(x => x.tree);

  useEffect(() => {
    console.log(tree);
  }, [tree]);

  return (
    <div className={styles.run}>
      <Picker />
      <PsteeRenderer className={styles.renderer} />
    </div>
  );
};

export default Run;
