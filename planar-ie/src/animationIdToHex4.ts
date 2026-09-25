/**
 * CRE animation ID as the lowercase four-digit hex value used by IE INI files.
 */
export const animationIdToHex4 = (animationId: number): string => (animationId & 0xffff).toString(16).padStart(4, '0');
