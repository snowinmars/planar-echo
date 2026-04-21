import Typography from '@mui/material/Typography';
import { client } from '@/swagger/client/client.gen';
import { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import { postApiGhostDialogue } from '@/swagger/client';
import planarLocalStorage from '@/shared/planarLocalStorage';
import VirtualizedListbox from './VirtualizedListbox';

import type { FC } from 'react';

import styles from './Picker.module.scss';

type PickerProps = Readonly<{
  onDialogueChange: (x: string) => void;
}>;
const Picker: FC<PickerProps> = (props: PickerProps) => {
  const [ghostPath] = useState(() => planarLocalStorage.get('ghostPath')!);
  const [serverUrl] = useState(() => planarLocalStorage.get('serverUrl')!);

  const [dialogues, setDialogues] = useState<string[]>([]);
  const [dialogue, setDialogue] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    try {
      postApiGhostDialogue({
        client,
        baseURL: serverUrl,
        body: { ghostDir: ghostPath }, // may use server filter here, but nah
      })
        .then(({ error, data }) => {
        // I suggest, that I can run game from non empty output directory
          setLoading(false);
          if (error) {
            setDialogues([]);
            console.error(error);
          }
          else {
            setDialogues(data);
          }
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
    }
    catch (e: unknown) {
      console.error(e);
      setLoading(false);
    }
  }, []);

  return (
    <FormControl
      className={styles.selectDialogue}
      fullWidth
    >
      <Autocomplete
        options={dialogues}
        value={dialogue}
        onChange={(_, x) => {
          props.onDialogueChange(x || '');
          return setDialogue(x || '');
        }}
        loading={loading}
        disabled={loading}
        loadingText="asd"
        slotProps={{
          listbox: {
            component: VirtualizedListbox,
          },
        }}
        renderInput={params => (
          <TextField
            {...params}
            label="Dialogue id"
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: loading ? <CircularProgress color="inherit" size="1em" /> : null,
              },
              inputLabel: {
                ...params.InputLabelProps,
              },
            }}
          />
        )}
      >
      </Autocomplete>
    </FormControl>
  );
};

export default Picker;
