export type AsclepiusRole = 'client-host' | 'session-gateway' | 'both';

export const readRole = (): AsclepiusRole => {
  const raw = process.env.PLANAR_ROLE ?? 'both';
  switch (raw) {
    case 'client-host':
    case 'session-gateway':
    case 'both':
      return raw;
    default:
      throw new Error(`Unknown PLANAR_ROLE "${raw}"`);
  }
};

export const servesClient = (role: AsclepiusRole): boolean => role !== 'session-gateway';

export const servesSession = (role: AsclepiusRole): boolean => role !== 'client-host';
