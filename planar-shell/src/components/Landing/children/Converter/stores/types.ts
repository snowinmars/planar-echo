export type Language = 'ru' | 'en';

type Status = 'loading' | 'success' | 'error';
export type ValidationState = Readonly<{
  status: Status;
  setStatus: (status: Status) => void;
}>;
