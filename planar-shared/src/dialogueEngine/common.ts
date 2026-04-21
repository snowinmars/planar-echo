import type { StateId } from './enums/state.js';

export const createSayId = (stateId: StateId, i: number) => `${stateId}_${i}`;
