export type AsclepiusRole = 'host-client' | 'host-server' | 'host-both';

export const readRole = (): AsclepiusRole => {
  const raw = process.env.PLANAR_ROLE ?? 'both';
  switch (raw) {
    case 'host-client':
    case 'host-server':
    case 'host-both': return raw;
    default: throw new Error(`Unknown PLANAR_ROLE '${raw}'`);
  }
};

export const canServeClient = (role: AsclepiusRole): boolean => role === 'host-client' || role === 'host-both';

export const canServeServer = (role: AsclepiusRole): boolean => role === 'host-server' || role === 'host-both';
