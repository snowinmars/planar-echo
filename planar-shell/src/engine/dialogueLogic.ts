// @ts-nocheck for now
/* eslint-disable @typescript-eslint/no-unused-vars */
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
      return;
    },
    isNpcInParty: (whoId) => {
      return false;
    },
    isNearbyDialog: (whoId) => {
      return false;
    },
    changeMorale: ({ whoId, amount }) => {
      return;
    },
    isNpcDead: (whoId) => {
      return false;
    },
    createItem: ({ itemId, whoId, amount, identified, slotId }) => {
      return;
    },
    giveItem: ({ itemId, whoId }) => {
      return;
    },
    takeItem: ({ itemId, whoId }) => {
      return;
    },
    takePartyItems: ({ itemId, amount }) => {
      return;
    },
    hasItem: ({ itemId, whoId }) => {
      return false;
    },
    destroyItem: ({ itemId, all }) => {
      return;
    },
    getNpcStat: ({ whoId, statId }) => character.getNpcStat({ whoId, statId }),
    changeNpcStat: ({ whoId, statId, amount }) => character.changeNpcStat({ whoId, statId, amount }),
    setNpcStat: ({ whoId, statId, amount }) => character.setNpcStat({ whoId, statId, amount }),
    attack: ({ targetId, whoId, force }) => {
      return;
    },
    startCutScene: ({ sceneId, checkConditions }) => {
      return;
    },
    fullHeal: (whoId) => {
      return;
    },
    addExp: ({ amount, whoId }) => {
      return;
    },
    changeGold: ({ amount, operation, force }) => {
      return 0;
    },
    getGold: () => {
      return 0;
    },
    playSound: ({ soundId: _soundId, notRanged: _notRanged }) => {
      return;
    },
    enemy: () => {
      return;
    },
    getTimesTalkedToNpc: () => {
      return 0;
    },
    setTimesTalkedToNpc: (amount) => {
      return 0;
    },
    exists: whoId => character.exists(whoId),
    transformItem: ({ fromItemId, toItemId, targetId, charge1, charge2, charge3 }) => {
      return;
    },
    getAlignment: (whoId) => {
      return 'lawful_good';
    },
    generateModronMaze: () => {
      return;
    },
    countPartyMembers: () => {
      return 0;
    },
    setPortalCursor: ({ locationId, portalId, reset }) => {
      return;
    },
    trade: ({ shopId, customerId }) => {
      return;
    },
    getClass: (whoId) => {
      return 'fighter';
    },
    setNamelessClass: (classId) => {
      return;
    },
    setAnimation: ({ whoId, animationId }) => {
      return;
    },
    showFloatingRebusAbove: (whoId) => {
      return;
    },
    destroySelf: () => {
      return;
    },
    deactivate: (whoId) => {
      return;
    },
    fadeColor: ({ operation, x, y, unknown }) => {
      return;
    },
    wait: (seconds) => {
      return;
    },
    kill: (whoId) => {
      return;
    },
    help: () => {
      return;
    },
    playAnimation: ({ animationId, x, y, blendingMode }) => {
      return;
    },
    rest: ({ gold, hpBonus, disableMoving }) => {
      return;
    },
    teleportParty: ({ locationId, x, y, face }) => {
      return;
    },
    changeScript: ({ whoId, scriptId, scriptLevelId }) => {
      return;
    },
    disableScript: ({ whoId, scriptLevelId }) => {
      return;
    },
    joinParty: ({ joinGroup, again }) => {
      return;
    },
    turnKeyInDoor: ({ doorId, isLocked }) => {
      return;
    },
    openDoor: (doorId) => {
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
      return;
    },
    runAway: ({ whoId, time, timeMeasureId, noAttack }) => {
      return;
    },
    clearActions: (whoId) => {
      return;
    },
    roll: (max) => {
      return 0;
    },
    applySpell: ({ whoId, spellId }) => {
      return;
    },
    damageBy: ({ whoId, amount }) => {
      return;
    },
    damageTo: ({ whoId, amount }) => {
      return;
    },
    getHp: (whoId) => {
      return 0;
    },
    changeWeaponProficiency: ({ whoId, slotId, amount }) => {
      return;
    },
    changeExtraProficiency: ({ whoId, amount }) => {
      return;
    },
    escapeArea: () => {
      return;
    },
    createCreatureNearTo: ({ creatureWhoId, nearToWhoId }) => {
      return;
    },
    creatureInLocation: ({ creatureWhoId, location }) => {
      return false;
    },
    changeTrigger: ({ triggerId, active }) => {
      return;
    },
  };
};
