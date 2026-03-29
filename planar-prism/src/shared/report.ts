import { timer, takeUntil, buffer, merge, Subject } from 'rxjs';

type Progress = Readonly<{
  value: number;
  step: string;
  params?: Record<string, string> | undefined;
}>;

const latestBy = <TItem, TKey>(
  arr: TItem[],
  key: (x: TItem) => TKey,
): TItem[] => [
  ...new Map<TKey, TItem>(arr.map(x => [key(x), x])).values(),
];

const dispose$ = new Subject<void>();
type CreateReportProps<T> = Readonly<{
  map: (x: T[]) => T[];
  send: (x: T) => void;
}>;
type CreteReportResult<T> = Readonly<{
  report: (item: T) => void;
  unsubscribe: () => void;
}>;
const createReport = <T>({ map, send }: CreateReportProps<T>): CreteReportResult<T> => {
  const report$ = new Subject<T>();
  const autoFlush$ = timer(0, 250).pipe(takeUntil(dispose$));
  const flushTrigger$ = merge(autoFlush$, dispose$);

  const subscription = report$.pipe(
    buffer(flushTrigger$),
  ).subscribe((buffer) => {
    for (const item of map(buffer)) {
      process.send?.(send(item));
    }
  });
  const report = (item: T): void => {
    const isIpc = !!process.send;
    if (isIpc) report$.next(item);
  };
  return {
    report,
    unsubscribe: () => subscription.unsubscribe(),
  };
};

const reportErrorResult = createReport<string>({
  map: x => x,
  send: x => ({ type: 'error', data: x }),
});

const reportProgressResult = createReport<Progress>({
  map: arr => latestBy(arr, x => x.step),
  send: x => ({ type: 'progress', data: x }),
});

const reportProgressSeqResult = createReport<Progress>({
  map: arr => latestBy(arr, x => x.step),
  send: x => ({ type: 'progressSeq', data: x }),
});

const reportCompleteResult = createReport<void>({
  map: x => x,
  send: () => ({ type: 'complete' }),
});

export const reportError = reportErrorResult.report;
export const reportProgress = reportProgressResult.report;
export const reportProgressSeq = reportProgressSeqResult.report;
export const reportComplete = reportCompleteResult.report;
export const disposeReports = () => {
  dispose$.next();
  reportErrorResult.unsubscribe();
  reportProgressResult.unsubscribe();
  reportProgressSeqResult.unsubscribe();
  reportCompleteResult.unsubscribe();
  dispose$.complete();
};
