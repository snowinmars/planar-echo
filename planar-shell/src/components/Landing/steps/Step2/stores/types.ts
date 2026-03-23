export type ValidationState = Readonly<{
  path: string;
  loading: boolean;
  comment: string;
  status: 'normal' | 'success' | 'error';
  setPath: (path: string) => void;
  validate: () => Promise<void>;
}>;
