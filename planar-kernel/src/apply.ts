import { applyMove } from './apply/applyMove.js';
import { applyPause } from './apply/applyPause.js';
import { applyPointer } from './apply/applyPointer.js';
import { applyTick } from './apply/applyTick.js';

import type { AppliableCommand, ApplyResult, World } from './types.js';

export const apply = (world: World, command: AppliableCommand): ApplyResult => {
  const type = command.type;
  switch (type) {
    case 'clock/tick': return applyTick(world);
    case 'actor/move': return applyMove(world, command);
    case 'pointer/click': return applyPointer(world, command);
    case 'session/pause': return applyPause(world, command);
    case 'session/loadArea': return { events: [{ op: 'command/rejected', reason: 'host-only' }] };
    default: throw new Error(`Command type '${type}' is out of range`); // eslint-disable-line @typescript-eslint/restrict-template-expressions
  }
};
