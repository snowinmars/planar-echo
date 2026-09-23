/**
 * CRE.animationId - dec number; INI animation - low 16 bits as 4 hex digits
 */
export const animationIdToHex4 = (animationId: number): string => (animationId & 0xffff).toString(16).padStart(4, '0');
