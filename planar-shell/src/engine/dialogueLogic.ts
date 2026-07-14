import type { DialogueLogic } from '@planar/shared';
import type { ZustandNarrative } from './store/narrativeStore';
import type { ZustandCharacter } from './store/characterStore';
import { getNarrativeActions } from './store/narrativeStore';
import { getCharacterActions } from './store/characterStore';

type DialogueLogicStores = Readonly<{
  narrative: ZustandNarrative;
  character: ZustandCharacter;
}>;

export const createDialogueLogic = (stores: DialogueLogicStores): DialogueLogic => {
  const narrative = getNarrativeActions(stores.narrative);
  const character = getCharacterActions(stores.character);

  return {
    getValue: ({ variableId, envId }) => narrative.getValue({ variableId, envId }),
    setValue: ({ variableId, envId, amount }) => narrative.setValue({ variableId, envId, amount }),
    increment: ({ variableId, envId, onceKey, amount }) => narrative.increment({ variableId, envId, onceKey, amount }),
    setJournal: (journalId) => {
      console.log(journalId);
      return;
    },
    isNpcInParty: (whoId) => {
      console.log(whoId);
      return false;
    },
    isNearbyDialog: (whoId) => {
      console.log(whoId);
      return false;
    },
    changeMorale: ({ whoId, amount }) => {
      console.log({ whoId, amount });
      return;
    },
    isNpcDead: (whoId) => {
      console.log(whoId);
      return false;
    },
    createItem: ({ itemId, whoId, amount, identified, slotId }) => {
      console.log({ itemId, whoId, amount, identified, slotId });
      return;
    },
    giveItem: ({ itemId, whoId }) => {
      console.log({ itemId, whoId });
      return;
    },
    takeItem: ({ itemId, whoId }) => {
      console.log({ itemId, whoId });
      return;
    },
    takePartyItems: ({ itemId, amount }) => {
      console.log({ itemId, amount });
      return;
    },
    countPartyItem: (itemId) => {
      console.log(itemId);
      return 0;
    },
    hasItem: ({ itemId, whoId }) => {
      console.log({ itemId, whoId });
      return false;
    },
    destroyItem: ({ itemId, all }) => {
      console.log({ itemId, all });
      return;
    },
    getNpcStat: ({ whoId, statId }) => character.getNpcStat({ whoId, statId }),
    changeNpcStat: ({ whoId, statId, amount }) => character.changeNpcStat({ whoId, statId, amount }),
    setNpcStat: ({ whoId, statId, amount }) => character.setNpcStat({ whoId, statId, amount }),
    attack: ({ targetId, whoId, force }) => {
      console.log({ targetId, whoId, force });
      return;
    },
    startCutScene: ({ sceneId, checkConditions }) => {
      console.log({ sceneId, checkConditions });
      return;
    },
    fullHeal: (whoId) => {
      console.log(whoId);
      return;
    },
    addExp: ({ amount, whoId }) => {
      console.log({ amount, whoId });
      return;
    },
    changeGold: ({ amount, operation, force }) => {
      console.log({ amount, operation, force });
      return 0;
    },
    getGold: () => {
      return 0;
    },
    playSound: ({ soundId, notRanged }) => {
      console.log({ soundId, notRanged });
      return;
    },
    enemy: () => {
      return;
    },
    getTimesTalkedToNpc: () => {
      return 0;
    },
    setTimesTalkedToNpc: (amount) => {
      console.log(amount);
      return 0;
    },
    talk: (whoId) => {
      console.log(whoId);
      return;
    },
    exists: whoId => character.exists(whoId),
    transformItem: ({ fromItemId, toItemId, targetId, charge1, charge2, charge3 }) => {
      console.log({ fromItemId, toItemId, targetId, charge1, charge2, charge3 });
      return;
    },
    getAlignment: (whoId) => {
      console.log(whoId);
      return 'lawful_good';
    },
    generateModronMaze: () => {
      return;
    },
    countPartyMembers: () => {
      return 0;
    },
    setPortalCursor: ({ locationId, portalId, reset }) => {
      console.log({ locationId, portalId, reset });
      return;
    },
    trade: ({ shopId, customerId }) => {
      console.log({ shopId, customerId });
      return;
    },
    getClass: (whoId) => {
      console.log(whoId);
      return 'fighter';
    },
    setNamelessClass: (classId) => {
      console.log(classId);
      return;
    },
    setAnimation: ({ whoId, animationId }) => {
      console.log({ whoId, animationId });
      return;
    },
    showFloatingRebusAbove: (whoId) => {
      console.log(whoId);
      return;
    },
    destroyCreature: (whoId) => {
      console.log(whoId);
      return;
    },
    deactivate: (whoId) => {
      console.log(whoId);
      return;
    },
    fadeColor: ({ operation, x, y, unknown }) => {
      console.log({ operation, x, y, unknown });
      return;
    },
    wait: (seconds) => {
      console.log(seconds);
      return;
    },
    kill: (whoId) => {
      console.log(whoId);
      return;
    },
    help: () => {
      return;
    },
    playAnimation: ({ animationId, x, y, blendingMode }) => {
      console.log({ animationId, x, y, blendingMode });
      return;
    },
    rest: ({ gold, hpBonus, disableMoving }) => {
      console.log({ gold, hpBonus, disableMoving });
      return;
    },
    teleportParty: ({ locationId, x, y, face }) => {
      console.log({ locationId, x, y, face });
      return;
    },
    changeScript: ({ whoId, scriptId, scriptLevelId }) => {
      console.log({ whoId, scriptId, scriptLevelId });
      return;
    },
    disableScript: ({ whoId, scriptLevelId }) => {
      console.log({ whoId, scriptLevelId });
      return;
    },
    joinParty: ({ joinGroup, again }) => {
      console.log({ joinGroup, again });
      return;
    },
    turnKeyInDoor: ({ doorId, isLocked }) => {
      console.log({ doorId, isLocked });
      return;
    },
    openDoor: (doorId) => {
      console.log(doorId);
      return;
    },
    getLastNpcTalkedTo: () => {
      return 'morte';
    },
    leaveParty: () => {
      return;
    },
    startCutsceneMode: () => {
      return;
    },
    startMovie: (movieId) => {
      console.log(movieId);
      return;
    },
    runAway: ({ whoId, time, timeMeasureId, noAttack }) => {
      console.log({ whoId, time, timeMeasureId, noAttack });
      return;
    },
    clearActions: (whoId) => {
      console.log(whoId);
      return;
    },
    roll: (max) => {
      console.log(max);
      return 0;
    },
    applySpell: ({ whoId, spellId }) => {
      console.log({ whoId, spellId });
      return;
    },
    damageBy: ({ whoId, amount }) => {
      console.log({ whoId, amount });
      return;
    },
    damageTo: ({ whoId, amount }) => {
      console.log({ whoId, amount });
      return;
    },
    getHp: (whoId) => {
      console.log(whoId);
      return 0;
    },
    changeWeaponProficiency: ({ whoId, slotId, amount }) => {
      console.log({ whoId, slotId, amount });
      return;
    },
    changeExtraProficiency: ({ whoId, amount }) => {
      console.log({ whoId, amount });
      return;
    },
    escapeArea: () => {
      return;
    },
    createCreatureNearTo: ({ creatureWhoId, nearToWhoId }) => {
      console.log({ creatureWhoId, nearToWhoId });
      return;
    },
    creatureInLocation: ({ creatureWhoId, location }) => {
      console.log({ creatureWhoId, location });
      return false;
    },
    changeTrigger: ({ triggerId, active }) => {
      console.log({ triggerId, active });
      return;
    },
    faceobject: ({ whoId, to }) => {
      console.log({ whoId, to });
      return;
    },
    getProficiency: ({ whoId, proficiency }) => {
      console.log({ whoId, proficiency });
      return 0;
    },
    getExtraProficiencyPoints: (whoId) => {
      console.log(whoId);
      return 0;
    },
    countEnemiesInRange: (range) => {
      console.log(range);
      return 0;
    },
    dropInventory: () => {
      return;
    },
    quitGame: ({ arg1, arg2, arg3 }) => {
      console.log({ arg1, arg2, arg3 });
      return;
    },
    sinisterPoof: (args) => {
      if (args.sticky) {
        const { poof, whoId, value, sticky } = args;
        console.log({ poof, whoId, value, sticky });
      }
      else {
        const { poof, x, y, value, sticky } = args;
        console.log({ poof, x, y, value, sticky });
      }
      return;
    },
    checkBit: ({ variable, env, bit }) => {
      console.log({ variable, env, bit });
      return false;
    },
    setBit: ({ variable, env, bit }) => {
      console.log({ variable, env, bit });
      return;
    },
    getHpPercent: (whoId) => {
      console.log(whoId);
      return 0;
    },
    setTimer: ({ timer, env, seconds }) => {
      console.log({ timer, env, seconds });
      return;
    },
    timerExpired: ({ timer, env }) => {
      console.log({ timer, env });
      return false;
    },
    setRandomValue: ({ variable, env, from, to, inclucive }) => {
      console.log({ variable, env, from, to, inclucive });
      return false;
    },
    clearAllActions: (whoId) => {
      console.log(whoId);
      return;
    },
    polymorph: ({ whoId, target }) => {
      console.log({ whoId, target });
      return;
    },
    sleep: (seconds) => {
      console.log(seconds);
      return;
    },
    getClassLevel: ({ whoId, classId }) => {
      console.log({ whoId, classId });
      return 0;
    },
    moveCamera: ({ x, y, animationTime }) => {
      console.log({ x, y, animationTime });
      return;
    },
    walk: ({ whoId, x, y }) => {
      console.log({ whoId, x, y });
      return;
    },
    useItem: ({ whoId, itemId }) => {
      console.log({ whoId, itemId });
      return;
    },
    fixEngineRoom: () => {
      return;
    },
    showFirstTimeHelp: () => {
      return;
    },
    endCutsceneMode: () => {
      return;
    },
    recoil: () => {
      return;
    },
    explore: () => {
      return;
    },
    setDisguise: ({ whoId, disguide }) => {
      console.log({ whoId, disguide });
      return;
    },
    createCreature: ({ whoId, x, y, direction }) => {
      console.log({ whoId, x, y, direction });
      return;
    },
    addJournalEntry: ({ journalId, type }) => {
      console.log({ journalId, type });
      return;
    },
    eraseJournalEntry: (journalId) => {
      console.log(journalId);
      return;
    },
    isInNpcArea: ({ whoId, aroundNpd }) => {
      console.log({ whoId, aroundNpd });
      return false;
    },
    saveGame: (slot) => {
      console.log(slot);
      return;
    },
    hideFloatMessageOver: (whoId) => {
      console.log(whoId);
      return;
    },
    showFloatMessageOver: ({ whoId, messageId }) => {
      console.log({ whoId, messageId });
      return;
    },
    changeDialog: ({ whoId, dialogueId }) => {
      console.log({ whoId, dialogueId });
      return;
    },
    changeAllegiance: ({ whoId, allegianceId }) => {
      console.log({ whoId, allegianceId });
      return false;
    },
  };
};
