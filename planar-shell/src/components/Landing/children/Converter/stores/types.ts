export type Language = 'ru' | 'en';

type Status = 'normal' | 'loading' | 'success' | 'error';
export type ValidationState = Readonly<{
  status: Status;
  setStatus: (status: Status) => void;
}>;
