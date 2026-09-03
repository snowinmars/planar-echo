import QuestionMark from '@mui/icons-material/QuestionMark';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Checkbox from '@mui/material/Checkbox';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { isNothing, nothing } from '@planar/shared';

import {
  gameHistorySettingsKeys,
  getGameHistoryBrowsedPages,
  getGameHistoryPageSize,
  getGameHistoryStoredPages,
  initialGameHistorySettings,
} from '@/shared/gameHistorySettings';
import { applyGameHistoryStorageLimit } from '@/shared/indexedDb';
import { NumberField } from '@/shared/NumberField';
import planarLocalStorage from '@/shared/planarLocalStorage';

import type { FC } from 'react';

import type { Maybe } from '@planar/shared';

import styles from './DlgHistorySettings.module.scss';

const isUnlimited = (storedPages: Maybe<number>): boolean => isNothing(storedPages) || storedPages === 0;

const DlgHistorySettings: FC = () => {
  const { t } = useTranslation();

  const [pageSize, setPageSize] = useState(() => getGameHistoryPageSize());
  const [browsedPages, setBrowsedPages] = useState(() => getGameHistoryBrowsedPages());
  const [storedPages, setStoredPages] = useState<Maybe<number>>(() => getGameHistoryStoredPages());
  const [unlimitedStoredPages, setUnlimitedStoredPages] = useState(() => isUnlimited(getGameHistoryStoredPages()));
  const [tlkCacheMaxLines, setTlkCacheMaxLines] = useState(() => planarLocalStorage.get<number>('tlkCacheMaxLines', 200)!);

  const [changed, setChanged] = useState(false);

  const [openHelp, setOpenHelp] = useState(false);
  const buttonAnchorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    planarLocalStorage.set(gameHistorySettingsKeys.pageSize, pageSize);
  }, [pageSize]);

  useEffect(() => {
    planarLocalStorage.set(gameHistorySettingsKeys.browsedPages, browsedPages);
  }, [browsedPages]);

  useEffect(() => {
    if (isUnlimited(storedPages)) planarLocalStorage.remove(gameHistorySettingsKeys.storedPages);
    else planarLocalStorage.set(gameHistorySettingsKeys.storedPages, storedPages);
  }, [storedPages]);

  useEffect(() => {
    planarLocalStorage.set('tlkCacheMaxLines', tlkCacheMaxLines);
  }, [tlkCacheMaxLines]);

  return (
    <Stack spacing={2}>
      <NumberField
        size="small"
        label={t('settings.dlgHistory.tlkCacheMaxLines')}
        value={tlkCacheMaxLines}
        min={100}
        onValueChange={(x) => {
          setTlkCacheMaxLines(x ?? 100);
        }}
      />

      <NumberField
        size="small"
        label={t('settings.dlgHistory.pageSize')}
        value={pageSize}
        min={1}
        onValueChange={(x) => {
          const newValue = x ?? 1;
          setPageSize(newValue);
          setChanged(true);
        }}
      />

      <NumberField
        size="small"
        label={t('settings.dlgHistory.browsedPages')}
        value={browsedPages}
        min={1}
        onValueChange={(x) => {
          const newValue = x ?? 1;
          setBrowsedPages(newValue);
          setChanged(true);
        }}
      />

      <NumberField
        size="small"
        disabled={unlimitedStoredPages}
        label={t('settings.dlgHistory.storedPages')}
        value={storedPages ?? -1}
        min={0}
        onValueChange={(x) => {
          setStoredPages(x);
          setUnlimitedStoredPages(isUnlimited(x));
          setChanged(true);
        }}
      />

      <FormControlLabel
        label={t('settings.dlgHistory.unlimited')}
        control={(
          <Checkbox
            checked={unlimitedStoredPages}
            onChange={(_, isUnlimited) => {
              if (isUnlimited) setStoredPages(nothing());
              else setStoredPages(6);
              setUnlimitedStoredPages(isUnlimited);
              setChanged(true);
            }}
          />
        )}
      />

      <ButtonGroup
        variant="contained"
        ref={buttonAnchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button
          color="info"
          size="small"
          aria-controls={openHelp ? 'split-button-menu' : undefined}
          aria-expanded={openHelp ? 'true' : undefined}
          onClick={() => {
            setPageSize(initialGameHistorySettings.pageSize);
            setBrowsedPages(initialGameHistorySettings.browsedPages);
            setStoredPages(initialGameHistorySettings.storedPages);
            setUnlimitedStoredPages(isUnlimited(initialGameHistorySettings.storedPages));
            setChanged(true);
          }}
        >
          {t('settings.dlgHistory.reset')}
        </Button>

        <Button
          disabled={!changed}
          color={changed ? 'warning' : 'primary'}
          fullWidth
          onClick={() => {
            setChanged(false);
            const maxEntries = isNothing(storedPages) ? nothing() : pageSize * storedPages;
            applyGameHistoryStorageLimit(maxEntries).catch((e: unknown) => {
              console.error(e);
              throw e;
            });
          }}
        >
          {t('settings.dlgHistory.apply')}
        </Button>

        <Button
          color="info"
          size="small"
          aria-controls={openHelp ? 'split-button-menu' : undefined}
          aria-expanded={openHelp ? 'true' : undefined}
          onClick={() => setOpenHelp(x => !x)}
        >
          <QuestionMark />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={openHelp}
        anchorEl={buttonAnchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={(event: Event) => {
                if (buttonAnchorRef.current && buttonAnchorRef.current.contains(event.target as HTMLElement)) return;
                setOpenHelp(false);
              }}
              >
                <Typography
                  className={styles.help}
                  sx={{ p: 2 }}
                >
                  {t('settings.dlgHistory.help', {
                    pageSize,
                    browsedPages,
                    storedPages: isUnlimited(storedPages) ? '∞' : storedPages,
                    tlkCacheMaxLines,
                  })}
                </Typography>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </Stack>
  );
};

export default DlgHistorySettings;
