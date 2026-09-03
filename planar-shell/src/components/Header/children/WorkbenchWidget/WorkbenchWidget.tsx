import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import { isAxiosError } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { debounceTime, Subject } from 'rxjs';

import { isNothing } from '@planar/shared';

import planarLocalStorage from '@/shared/planarLocalStorage';
import VirtualizedListbox from '@/shared/VirtualizedListbox';
import { postApiGhostSearch } from '@/swagger/client';
import { client } from '@/swagger/client/client.gen';

import type { FC } from 'react';

import type { GhostType } from '@planar/shared';

import styles from './WorkbenchWidget.module.scss';

type GhostSearchHit = Readonly<{
  type: GhostType;
  id: string;
}>;

const optionKey = (hit: GhostSearchHit): string => `${hit.type}:${hit.id}`;

const WorkbenchWidget: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hits, setHits] = useState<GhostSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const queryRef = useRef<Subject<string> | null>(null);

  useEffect(() => {
    const query$ = new Subject<string>();
    queryRef.current = query$;
    let abortController: AbortController | undefined;
    const subscription = query$.pipe(debounceTime(300)).subscribe((partialName) => {
      abortController?.abort();
      const trimmed = partialName.trim();
      if (trimmed.length < 2) {
        setHits([]);
        setLoading(false);
        return;
      }

      abortController = new AbortController();
      const { signal } = abortController;
      const serverUrl = planarLocalStorage.get('serverUrl')!;
      const ghostDir = planarLocalStorage.get('ghostDir')!;
      setLoading(true);

      postApiGhostSearch({
        client,
        baseURL: serverUrl,
        body: { ghostDir, partialName: trimmed },
        signal,
      })
        .then(({ error, data }) => {
          if (signal.aborted) return;
          if (error) {
            console.error(error);
            setHits([]);
            return;
          }
          setHits(data ?? []);
        })
        .catch((e: unknown) => {
          if (isAxiosError(e) && e.code === 'ERR_CANCELED') return;
          console.error(e);
          if (!signal.aborted) setHits([]);
        })
        .finally(() => {
          if (!signal.aborted) setLoading(false);
        });
    });

    return () => {
      abortController?.abort();
      subscription.unsubscribe();
      query$.complete();
      queryRef.current = null;
    };
  }, []);

  return (
    <div className={styles.widget}>
      <Autocomplete
        className={styles.searchPicker}
        options={hits}
        value={null}
        filterOptions={x => x}
        getOptionKey={optionKey}
        getOptionLabel={hit => `${hit.id} (${hit.type})`}
        isOptionEqualToValue={(a, b) => a.type === b.type && a.id === b.id}
        onInputChange={(_, value, reason) => {
          if (reason === 'input' || reason === 'clear') queryRef.current?.next(value);
        }}
        onChange={(_, hit) => {
          if (isNothing(hit)) return;
          navigate(`/${hit.type}/${hit.id}`)?.catch((e: unknown) => console.error(e));
        }}
        loading={loading}
        slotProps={{
          listbox: {
            component: VirtualizedListbox,
          },
        }}
        renderInput={params => (
          <TextField
            {...params}
            label={t('run.workbenchSearchLabel', { amount: hits.length })}
            variant="standard"
            size="small"
            slotProps={{
              ...params.slotProps,
              input: {
                ...params.slotProps.input,
                endAdornment: loading ? <CircularProgress color="inherit" size="1em" /> : null,
              },
            }}
          />
        )}
      />
    </div>
  );
};

export default WorkbenchWidget;
