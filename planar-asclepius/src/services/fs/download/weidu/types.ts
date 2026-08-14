export type WeiduPlatform = 'windows' | 'linux' | 'mac';

export type Command = Readonly<{
  platform: WeiduPlatform;
}>;

export type Result
  = | { ok: true; data: { weiduExeDir: string } }
    | { ok: false; error: DownloadError };

export type DownloadError
  = | { code: 'DOWNLOAD_FAILED'; message: string; status: 502 }
    | { code: 'EXTRACT_FAILED'; message: string; status: 500 }
    | { code: 'BINARY_NOT_FOUND'; message: string; status: 404 };
