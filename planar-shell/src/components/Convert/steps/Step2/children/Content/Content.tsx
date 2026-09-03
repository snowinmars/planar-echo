import DownloadIcon from '@mui/icons-material/Download';
import ReplayIcon from '@mui/icons-material/Replay';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import type { FC, MouseEvent } from 'react';

import type { LandingStateStep2, WeiduDownloadPlatform } from '@/components/Convert/store/types';

import styles from './Content.module.scss';

const platforms: readonly WeiduDownloadPlatform[] = ['windows', 'linux', 'mac'];

type ContentProps = Readonly<{
  disabled: boolean;
  weiduExeDir: LandingStateStep2['weiduExeDir'];
  setWeiduExeDir: LandingStateStep2['setWeiduExeDir'];
  loading: LandingStateStep2['step2Loading'];
  validate: LandingStateStep2['step2Validate'];
  downloadWeidu: LandingStateStep2['step2DownloadWeidu'];
}>;
const Content: FC<ContentProps> = (props: ContentProps) => {
  const { t } = useTranslation();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  const openDownloadMenu = (event: MouseEvent<HTMLButtonElement>): void => {
    setMenuAnchor(event.currentTarget);
  };

  const closeDownloadMenu = (): void => {
    setMenuAnchor(null);
  };

  const onPlatformClick = (platform: WeiduDownloadPlatform): void => {
    closeDownloadMenu();
    props.downloadWeidu(platform).catch((e: unknown) => console.error(e));
  };

  return (
    <Paper className={styles.inputWrapper}>
      <TextField
        className={styles.input}
        value={props.weiduExeDir}
        onChange={(e) => {
          const value = e.target.value;
          props.setWeiduExeDir(value);
        }}
        disabled={props.loading || props.disabled}
        fullWidth
        label={t('landing.step2.weiduExeDir')}
        placeholder="D:\Games\weidu\weidu.exe"
      />

      <div className={styles.inputActions}>
        <IconButton
          className={styles.inputReload}
          aria-label="replay"
          disabled={!props.weiduExeDir || props.loading || props.disabled}
          onClick={() => {
            if (props.weiduExeDir) props.validate().catch((e: unknown) => console.error(e));
          }}
        >
          <ReplayIcon />
        </IconButton>

        <IconButton
          className={styles.inputDownload}
          aria-label="download"
          disabled={props.loading || props.disabled}
          onClick={openDownloadMenu}
        >
          <DownloadIcon />
        </IconButton>
      </div>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeDownloadMenu}
      >
        {
          platforms.map(platform => (
            <MenuItem
              key={platform}
              onClick={() => {
                onPlatformClick(platform);
              }}
            >
              {t(`landing.step2.download.${platform}`)}
            </MenuItem>
          ))
        }
      </Menu>
    </Paper>
  );
};

export default Content;
