import extractZip from 'extract-zip';
import { chmod, mkdir, readdir, rm, stat, unlink, writeFile } from 'fs/promises';
import { tmpdir } from 'os';
import { join, resolve } from 'path';

import { nothing } from '@planar/shared';

import { getWeiduInstallDir } from '@/services/settings/storage.js';
import logger from '@/shared/logger.js';

import type { Maybe } from '@planar/shared';

import type { Command, Result, WeiduPlatform } from './types.js';

const weiduUrls: Record<WeiduPlatform, string> = {
  windows: 'https://github.com/WeiDUorg/weidu/releases/download/v251.00/WeiDU-Windows-251.zip',
  linux: 'https://github.com/WeiDUorg/weidu/releases/download/v251.00/WeiDU-Linux-251.zip',
  mac: 'https://github.com/WeiDUorg/weidu/releases/download/v251.00/WeiDU-Mac-251.zip',
};

const binaryName = (platform: WeiduPlatform): string => platform === 'windows' ? 'weidu.exe' : 'weidu';

const findWeiduBinary = async (root: string, platform: WeiduPlatform): Promise<Maybe<string>> => {
  const target = binaryName(platform);
  const entries = await readdir(root, { recursive: true });

  for (const entry of entries) {
    const base = entry.split(/[/\\]/).pop();
    if (base !== target) continue;

    const full = join(root, entry);
    const fileStat = await stat(full);
    if (fileStat.isFile()) return resolve(full);
  }

  return nothing();
};

export default async ({
  platform,
}: Command): Promise<Result> => {
  const url = weiduUrls[platform];
  const destDir = getWeiduInstallDir();
  const zipPath = join(tmpdir(), `weidu-${platform}-${Date.now()}.zip`);

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'planar-echo' },
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      return {
        ok: false,
        error: {
          code: 'DOWNLOAD_FAILED',
          message: `WeiDU download failed: HTTP ${response.status}`,
          status: 502,
        },
      };
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    await writeFile(zipPath, bytes);
  }
  catch (e: unknown) {
    logger.error(e);
    return {
      ok: false,
      error: {
        code: 'DOWNLOAD_FAILED',
        message: `WeiDU download failed: '${e?.toString()}'`,
        status: 502,
      },
    };
  }

  try {
    await rm(destDir, { recursive: true, force: true });
    await mkdir(destDir, { recursive: true });
    await extractZip(zipPath, { dir: destDir });
  }
  catch (e: unknown) {
    logger.error(e);
    return {
      ok: false,
      error: {
        code: 'EXTRACT_FAILED',
        message: `WeiDU extract failed: '${e?.toString()}'`,
        status: 500,
      },
    };
  }
  finally {
    await unlink(zipPath).catch((e: unknown) => logger.error(e));
  }

  const weiduExeDir = await findWeiduBinary(destDir, platform);
  if (!weiduExeDir) {
    return {
      ok: false,
      error: {
        code: 'BINARY_NOT_FOUND',
        message: `WeiDU binary '${binaryName(platform)}' was not found in '${destDir}'`,
        status: 404,
      },
    };
  }

  if (platform !== 'windows') {
    try {
      await chmod(weiduExeDir, 0o755);
    }
    catch (e: unknown) {
      logger.error(e);
      return {
        ok: false,
        error: {
          code: 'EXTRACT_FAILED',
          message: `Failed to chmod WeiDU binary: '${e?.toString()}'`,
          status: 500,
        },
      };
    }
  }

  return { ok: true, data: { weiduExeDir } };
};
