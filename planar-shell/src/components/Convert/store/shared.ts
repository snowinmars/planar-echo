import { isAxiosError } from 'axios';

export const getAxiosApiErrorBody = <T>(error: unknown): T => {
  if (isAxiosError(error) && error.response?.data && typeof error.response.data === 'object') return error.response.data as T;
  throw new Error(`Error '${error}' should not be threated as axios error`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
};
