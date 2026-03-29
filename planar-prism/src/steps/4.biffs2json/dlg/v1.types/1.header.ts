import { extend } from '@/pipes/offsetMap.js';
import type { Maybe } from '@planar/shared';

/* createGenerator().register().flags('threatResponseV10',{
 *   byte1:['enemy','escapearea','nothing'],
 * }).write();
 */
const threatResponseV10 = {
  // byte1
  0x1: 'enemy',
  0x2: 'escapearea',
  0x4: 'nothing',
  // 0x8: unused
  // 0x10: unused
  // 0x20: unused
  // 0x40: unused
  // 0x80: unused
} as const;
type ThreatResponseV10 = typeof threatResponseV10[keyof typeof threatResponseV10];

export const offsetMap = {
  threatResponse: extend(threatResponseV10),
};

export type RawHeader = Readonly<{
  signature: string;
  version: string;
  statesCount: number;
  statesOffset: number;
  responsesCount: number;
  responsesOffset: number;
  stateTriggersOffset: number;
  stateTriggersCount: number;
  responsesTriggersOffset: number;
  responseTriggersCount: number;
  actionsOffset: number;
  actionsCount: number;
  threatResponse: number;
}>;

export type DlgHeader = Readonly<{
  signature: string;
  version: string;
  statesCount: number;
  statesOffset: number;
  responsesCount: number;
  responsesOffset: number;
  stateTriggersOffset: number;
  stateTriggersCount: number;
  responsesTriggersOffset: number;
  responseTriggersCount: number;
  actionsOffset: number;
  actionsCount: number;
  threatResponse: number;
}>;
