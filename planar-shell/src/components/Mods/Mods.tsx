import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { CLIENT_HOOKS, SERVER_HOOKS } from '@planar/shared';

import {
  backendUrl,
  emptyActive,
  fetchActiveJson,
  fetchModsList,
  postInstallDefaults,
  QUERY_NAMES,
  RADIO_SLOTS,
  setActiveJsonMods,
} from '@/shared/modsApi';

import type { FC } from 'react';

import type { ActiveJsonMods, ClientHookName, ServerHookName } from '@planar/shared';

import type { DiskModRow } from '@/shared/modsApi';

const SAVE_DEBOUNCE_MS = 300;

const Mods: FC = () => {
  const { t } = useTranslation();
  const serverUrl = backendUrl();
  const [mods, setMods] = useState<DiskModRow[]>([]);
  const [active, setActive] = useState<ActiveJsonMods>(emptyActive);
  const [hasActive, setHasActive] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const muteSave = useRef(true);
  const saveSeq = useRef(0);
  const activeRef = useRef(active);
  activeRef.current = active;

  const persist = async (draft: ActiveJsonMods): Promise<void> => {
    const my = ++saveSeq.current;
    const result = await setActiveJsonMods(serverUrl, draft);
    if (my !== saveSeq.current) return;
    if (result.ok) {
      setErrors([]);
      setHasActive(true);
      return;
    }
    setErrors(result.errors);
  };

  const reload = async (): Promise<void> => {
    muteSave.current = true;
    saveSeq.current += 1;
    const list = await fetchModsList(serverUrl);
    setMods(list.mods);
    const next = await fetchActiveJson(serverUrl);
    if (!next) {
      setHasActive(false);
      setActive(emptyActive());
      return;
    }
    setHasActive(true);
    setActive(next);
  };

  useEffect(() => {
    reload().catch((err: unknown) => {
      console.error(err);
      setMessage(err instanceof Error ? err.message : String(err));
    });
  }, []);

  useEffect(() => {
    const skip = muteSave.current;
    if (skip) {
      muteSave.current = false;
      return;
    }
    const handle = window.setTimeout(() => {
      persist(active).catch((err: unknown) => {
        setMessage(err instanceof Error ? err.message : String(err));
      });
    }, SAVE_DEBOUNCE_MS);
    return () => window.clearTimeout(handle);
  }, [active, serverUrl]);

  return (
    <Stack spacing={2} sx={{ p: 2 }}>
      <Typography variant="h5">{t('mods.title')}</Typography>
      <Typography color="text.secondary">{t('mods.hint')}</Typography>

      {!hasActive && <Alert severity="warning">{t('mods.missingActive')}</Alert>}
      {message && <Alert severity="info">{message}</Alert>}
      {errors.map(err => (
        <Alert key={err} severity="error">{err}</Alert>
      ))}

      <Button
        nativeButton={false}
        disabled={busy}
        onClick={() => {
          setBusy(true);
          postInstallDefaults(serverUrl)
            .then(async (result) => {
              setMessage(t('mods.copied', { ids: result.copied.join(', ') || '—' }));
              const list = await fetchModsList(serverUrl);
              setMods(list.mods);
              await persist(activeRef.current);
            })
            .catch((err: unknown) => setMessage(err instanceof Error ? err.message : String(err)))
            .finally(() => setBusy(false));
        }}
      >
        {busy ? t('mods.installing') : t('mods.installDefaults')}
      </Button>

      <Typography variant="h6">{t('mods.slots')}</Typography>
      {RADIO_SLOTS.map(slot => (
        <FormControl key={slot} fullWidth>
          <InputLabel>{slot}</InputLabel>
          <Select
            label={slot}
            value={active.slots[slot] ?? ''}
            onChange={(e) => {
              const value = e.target.value;
              setActive({
                ...active,
                slots: { ...active.slots, [slot]: value === '' ? null : value },
              });
            }}
          >
            <MenuItem value=""><em>—</em></MenuItem>
            {mods.filter(mod => mod.manifest.slots.includes(slot)).map(mod => (
              <MenuItem key={mod.id} value={mod.id}>{mod.id}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}

      <Typography variant="h6">{t('mods.enabled')}</Typography>
      {mods.map(mod => (
        <FormControlLabel
          key={mod.id}
          control={(
            <Switch
              checked={Boolean(active.enabled[mod.id])}
              onChange={(e) => {
                setActive({
                  ...active,
                  enabled: { ...active.enabled, [mod.id]: e.target.checked },
                });
              }}
            />
          )}
          label={`${mod.id} v${mod.manifest.version} [${mod.manifest.sides.join('+')}]`}
        />
      ))}

      <Typography variant="h6">{t('mods.serverHooks')}</Typography>
      {SERVER_HOOKS.map(hook => (
        <TextField
          key={`server-${hook}`}
          label={hook}
          fullWidth
          value={(active.serverHooks[hook] ?? []).join(', ')}
          onChange={(e) => {
            const ids = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
            const next: Partial<Record<ServerHookName, string[]>> = { ...active.serverHooks, [hook]: ids };
            setActive({
              ...active,
              serverHooks: next,
            });
          }}
        />
      ))}

      <Typography variant="h6">{t('mods.clientHooks')}</Typography>
      {CLIENT_HOOKS.map(hook => (
        <TextField
          key={`client-${hook}`}
          label={hook}
          fullWidth
          value={(active.clientHooks[hook] ?? []).join(', ')}
          onChange={(e) => {
            const ids = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
            const next: Partial<Record<ClientHookName, string[]>> = { ...active.clientHooks, [hook]: ids };
            setActive({
              ...active,
              clientHooks: next,
            });
          }}
        />
      ))}

      <Typography variant="h6">{t('mods.queries')}</Typography>
      {QUERY_NAMES.map(query => (
        <TextField
          key={query}
          label={query}
          fullWidth
          value={(active.queries[query] ?? []).join(', ')}
          onChange={(e) => {
            const ids = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
            setActive({
              ...active,
              queries: { ...active.queries, [query]: ids },
            });
          }}
        />
      ))}
    </Stack>
  );
};

export default Mods;
