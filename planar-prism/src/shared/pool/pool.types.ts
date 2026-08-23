import type { Progress } from '@planar/shared';

export type PoolKind =
  | 'pvrz'
  | 'bam'
  | 'mos'
  | 'tis'
  | 'bmp'
  | 'wav'
  | 'acm'
  | 'are';

export type PoolResourceStep = Extract<Progress,
  | { step: 'pvrz_raw2assets' }
  | { step: 'bam_raw2assets' }
  | { step: 'mos_raw2assets' }
  | { step: 'tis_raw2assets' }
  | { step: 'bmp_raw2assets' }
  | { step: 'wav_raw2assets' }
  | { step: 'acm_raw2assets' }
  | { step: 'are_raw2assets' }
>['step'];

export type PoolJob = Readonly<{
  resourceName: string;
  payload: unknown;
}>;

export type PoolWorkerData = Readonly<{
  kind: PoolKind;
  decompiledRoot: string;
  assetsRoot: string;
  context?: unknown;
}>;

export type MainToWorker =
  | Readonly<{ type: 'job'; resourceName: string; payload: unknown }>
  | Readonly<{ type: 'drain' }>;

export type WorkerToMain =
  | Readonly<{ type: 'idle' }>
  | Readonly<{ type: 'result'; resourceName: string; value: unknown }>
  | Readonly<{ type: 'error'; resourceName: string | null; message: string }>;

export type ParseOneProps = Readonly<{
  resourceName: string;
  decompiledRoot: string;
  assetsRoot: string;
  context: unknown;
  payload: unknown;
}>;

export type ParseOneResult<T> = Readonly<{
  value: T;
  transfer?: ArrayBuffer[];
}>;

export type ParseOne = (props: ParseOneProps) => Promise<ParseOneResult<unknown>>;

export type PvrzSabTableEntry = Readonly<{
  offset: number;
  width: number;
  height: number;
}>;

export type PvrzSabTable = Readonly<Record<string, PvrzSabTableEntry>>;

export type PackedPvrz = Readonly<{
  sab: SharedArrayBuffer;
  table: PvrzSabTable;
}>;

export type AssetOk = Readonly<{
  ok: true;
}>;
