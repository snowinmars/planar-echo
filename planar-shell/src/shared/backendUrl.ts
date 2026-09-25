import planarLocalStorage from '@/shared/planarLocalStorage';

export const backendUrl = (): string => planarLocalStorage.get<string>('serverUrl', 'http://localhost:3003')!;
