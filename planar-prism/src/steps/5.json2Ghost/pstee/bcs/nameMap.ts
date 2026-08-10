/** IE lowercase function name → ScriptLogic method name */
export const IE_TO_SCRIPT_METHOD: ReadonlyMap<string, string> = new Map([
  ['setglobal', 'setValue'],
  ['incrementglobal', 'increment'],
  ['global', 'getValueEq'],
  ['globalgt', 'getValueGt'],
  ['globallt', 'getValueLt'],
  ['faceobject', 'faceObject'],
  ['endcutscenemode', 'endCutsceneMode'],
  ['startcutscenemode', 'startCutsceneMode'],
  ['moveviewobject', 'moveViewObject'],
  ['movetopoint', 'moveToPoint'],
  ['waitrandom', 'waitRandom'],
  ['playsequence', 'playSequence'],
  ['returntosavedplace', 'returnToSavedPlace'],
  ['nearsavedlocationpst', 'nearSavedLocationPst'],
  ['wasindialog', 'wasInDialog'],
  ['actionoverride', 'actionOverride'],
  ['triggeroverride', 'triggerOverride'],
  ['nearestenemyof', 'nearestEnemyOf'],
  ['lastattackerof', 'lastAttackerOf'],
  ['mostdamagedof', 'mostDamagedOf'],
  ['createcreature', 'createCreature'],
  ['floatmessage', 'floatMessage'],
  ['changeaiscript', 'changeAiScript'],
  ['hppercentlt', 'hpPercentLt'],
  ['starttimer', 'startTimer'],
  ['timeractive', 'timerActive'],
  ['attackedby', 'attackedBy'],
  ['runawayfrom', 'runAwayFrom'],
  ['nearlocation', 'nearLocation'],
  ['oncreation', 'onCreation'],
  ['spellres', 'spellRes'],
  ['dialogue', 'dialogue'],
  ['dialog', 'dialogue'],
  ['wait', 'wait'],
  ['see', 'see'],
  ['exists', 'exists'],
  ['help', 'help'],
  ['attack', 'attack'],
  ['enemy', 'enemy'],
  ['die', 'die'],
  ['allegiance', 'allegiance'],
  ['team', 'team'],
  ['entered', 'entered'],
  ['clicked', 'clicked'],
  ['range', 'range'],
  ['areacheck', 'areaCheck'],
]);

const WORDS = [
  'override', 'location', 'sequence', 'creature', 'allegiance', 'percent', 'creation',
  'message', 'global', 'object', 'random', 'script', 'timer', 'enemy', 'party', 'point',
  'scene', 'view', 'saved', 'place', 'dialog', 'attack', 'float', 'wait', 'move', 'face',
  'play', 'near', 'return', 'change', 'start', 'active', 'nearest', 'last', 'most',
  'damaged', 'attacker', 'of', 'to', 'by', 'from', 'in', 'ai', 'hp', 'res', 'pst',
];

export const ieNameToMethod = (ieName: string): string => {
  const name = ieName.toLowerCase();
  const known = IE_TO_SCRIPT_METHOD.get(name);
  if (known) return known;

  let rest = name;
  const parts: string[] = [];
  const sorted = [...WORDS].sort((a, b) => b.length - a.length);
  while (rest.length) {
    let hit = false;
    for (const w of sorted) {
      if (rest.startsWith(w)) {
        parts.push(w);
        rest = rest.slice(w.length);
        hit = true;
        break;
      }
    }
    if (!hit) {
      parts.push(rest);
      break;
    }
  }
  return parts
    .filter(Boolean)
    .map((p, i) => (i === 0 ? p : `${p[0]!.toUpperCase()}${p.slice(1)}`))
    .join('');
};

export const BCS_SPECIALS = new Set(['true', 'or', 'continue', 'cutsceneid']);
