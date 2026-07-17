import { dialogueToCreatureOrItem } from '@planar/shared';

import type { DiscoverNext } from '@/discoverer.types.js';
import type { Direction } from '@planar/shared';

type Ie2tsItem = Readonly<{
  regex: RegExp;
  onMatch: (matches: string[]) => string;
}>;

const dropQuotes = (x: string): string => x.replaceAll(`"`, '').replaceAll(`'`, `\\'`).trim();
const nativeTimeToNumber = (x: string): number => {
  switch (x) {
    case 'zero': return 0;
    case 'one': return 1;
    case 'two': return 2;
    case 'three': return 3;
    case 'four': return 4;
    case 'five': return 5;
    case 'six': return 6;
    case 'seven': return 7;
    case 'eight': return 8;
    case 'nine': return 9;
    case 'ten': return 10;
    case 'eleven': return 11;
    case 'twelve': return 12;
    case 'thirteen': return 13;
    case 'fourteen': return 14;
    case 'fifteen': return 15;
    default: throw new Error(`Native time '${x}' is out of range`);
  }
};

export const parseDirection = (s: string): Direction => {
  if (!s) throw new Error(`Cannot parse Direction from nothing`);

  switch (s) {
    case 's': return '0=south';
    case 'w': return '4=west';
    case 'n': return '8=north';
    case 'e': return '12=east';
    default: throw new Error(`Cannot parse Direction from ${s}`);
  }
};

const createItems = (discover: DiscoverNext, myself: string): Ie2tsItem[] => {
  const notMe = (whoId: string): string => {
    if (whoId === 'myself') return myself;
    if (whoId === '[pc]') whoId = 'protagonist';
    return dropQuotes(whoId);
  };

  return [{
    regex: /(!)?l\.inparty\((.*?)\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `${not ? '!' : ''}l.isNpcInParty('${who}')`; // InParty("variable")
    },
  }, {
    regex: /(!)?l\.nearbydialog\((.*?)\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `${not ? '!' : ''}l.isNearbyDialog('${who}')`; // NearbyDialog("variable")
    },
  }, {
    regex: /moraledec\((.*?),(\d+)\)/,
    onMatch: ([line, whoId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.changeMorale({whoId: '${who}', amount: -${amount}})`; // MoraleDec("variable",1)
    },
  }, {
    regex: /moraleinc\((.*?),(\d+)\)/,
    onMatch: ([line, whoId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.changeMorale({whoId: '${who}', amount: ${amount}})`; // MoraleInc("variable",1)
    },
  }, {
    regex: /incrementglobal\((.*?),(.*?),([-\d]+)\)/,
    onMatch: ([line, variableId, envId, amount]) => {
      if (!variableId) throw new Error(`Wrong line syntax: cannot find 'variableId' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const variable = dropQuotes(variableId);
      const env = dropQuotes(envId);
      discover({ type: 'variable', name: variable, env: env, extendValueSpectreWith: parseInt(amount), forceType: 'number' });

      return `l.increment({variableId: '${variable}', envId: '${env}', amount: ${amount}})`; // IncrementGlobal("variable","global",1)
    },
  }, {
    regex: /incrementglobalonceex\((.*?),(.*?),([-\d]+)\)/,
    onMatch: ([line, keyId, variableId, amount]) => {
      if (!keyId) throw new Error(`Wrong line syntax: cannot find 'keyId' in '${line}'`);
      if (!variableId) throw new Error(`Wrong line syntax: cannot find 'variableId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const key = dropQuotes(keyId);
      const variable = dropQuotes(variableId);
      discover({ type: 'key', name: key, extendValueSpectreWith: 1, forceType: 'number' });
      discover({ type: 'variable', name: variable, extendValueSpectreWith: parseInt(amount), forceType: 'number' });

      return `l.increment({onceKey: '${key}', variableId: '${variable}', amount: ${amount}})`; // IncrementGlobal("variable","global",1)
    },
  }, {
    regex: /(!)?dead\((.*?)\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `${not ? '!' : ''}l.isNpcDead('${who}')`; // Dead("variable")
    },
  }, {
    regex: /giveitemcreate\((.*?),(.*?),(\d+),(\d+),(\d+)\)/,
    onMatch: ([line, itemId, whoId, amount, identified, slotId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      if (!identified) throw new Error(`Wrong line syntax: cannot find 'identified' in '${line}'`);
      if (!slotId) throw new Error(`Wrong line syntax: cannot find 'slotId' in '${line}'`);
      const item = dropQuotes(itemId);
      const who = notMe(whoId);
      const slot = dropQuotes(slotId);
      discover({ type: 'item', name: item });
      discover({ type: 'who', name: who });
      discover({ type: 'slot', name: slot });

      return `l.createItem({itemId: '${item}', whoId: '${who}', amount: ${amount}, identified: ${identified === '1' ? true : false}, slotId: '${slot}' })`; // GiveItemCreate("variable",Protagonist,1,0,0)
    },
  }, {
    regex: /createitem\((.*?),(\d+),(\d+),(\d+)\)/,
    onMatch: ([line, itemId, amount, identified, slotId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      if (!identified) throw new Error(`Wrong line syntax: cannot find 'identified' in '${line}'`);
      if (!slotId) throw new Error(`Wrong line syntax: cannot find 'slotId' in '${line}'`);
      const item = dropQuotes(itemId);
      const slot = dropQuotes(slotId);
      discover({ type: 'item', name: item });
      discover({ type: 'slot', name: slot });

      return `l.createItem({itemId: '${item}', amount: ${amount}, identified: ${identified === '1' ? true : false}, slotId: '${slot}' })`; // GiveItemCreate("variable",Protagonist,1,0,0)
    },
  }, {
    regex: /(give|take)item\((.*?),(.*?)\)/,
    onMatch: ([line, op, itemId, whoId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const item = dropQuotes(itemId);
      const who = notMe(whoId);
      discover({ type: 'item', name: item });
      discover({ type: 'who', name: who });

      return `l.${op}Item({itemId: '${item}', whoId: '${who}' })`; // GiveItem("variable",Protagonist) / TakeItem("variable",Protagonist)
    },
  }, {
    regex: /takepartyitemnum\((.*?),(\d+)\)/,
    onMatch: ([line, itemId, amount]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const item = dropQuotes(itemId);
      discover({ type: 'item', name: item });

      return `l.takePartyItems({itemId: '${item}', amount: ${amount}})`; // TakePartyItemNum("variable",1)
    },
  }, {
    regex: /takepartyitem\("(.*?)"\)/,
    onMatch: ([line, itemId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      const item = dropQuotes(itemId);
      discover({ type: 'item', name: item });

      return `l.takePartyItems({itemId: '${item}', amount: 'stack'})`; // TakePartyItem("dgem")
    },
  }, {
    regex: /numitemsparty(gt|lt)?\("(.*?)",(\d+)\)/,
    onMatch: ([line, op, itemId, amount]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const item = dropQuotes(itemId);
      discover({ type: 'item', name: item });

      if (!op) return `l.countPartyItem('${item}') === ${amount}`; // NumItemsParty("tail",0)

      switch (op) {
        case 'gt': return `l.countPartyItem('${item}') > ${amount}`; // NumItemsPartyGT("tail",0)
        case 'lt': return `l.countPartyItem('${item}') < ${amount}`; // NumItemsPartyLT("tail",0)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /(!)?hasitem\((.*?),(.*?)\)/,
    onMatch: ([line, not, itemId, whoId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const item = dropQuotes(itemId);
      const who = notMe(whoId);
      discover({ type: 'item', name: item });
      discover({ type: 'who', name: who });

      return `${not ? '!' : ''}l.hasItem({itemId: '${item}', whoId: '${who}' })`; // HasItem("variable",Myself)
    },
  }, {
    regex: /(!)?partyhasitem\((.*?)\)/,
    onMatch: ([line, not, itemId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      const item = dropQuotes(itemId);
      discover({ type: 'item', name: item });
      discover({ type: 'who', name: 'party' });

      return `${not ? '!' : ''}l.hasItem({itemId: '${item}', whoId: 'party' })`; // PartyHasItem("variable")
    },
  }, {
    regex: /destroypartyitem\((.*?),(true|false)\)/,
    onMatch: ([line, itemId, all]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      const item = dropQuotes(itemId);
      discover({ type: 'item', name: item });
      discover({ type: 'who', name: 'party' });

      return `l.destroyItem({itemId: '${item}', whoId: 'party', all: ${all === 'true' ? true : false} })`; // DestroyPartyItem("variable",TRUE)
    },
  }, {
    regex: /destroyitemobject\((.*?),(.*),(true|false)\)/,
    onMatch: ([line, itemId, whoId, all]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const item = dropQuotes(itemId);
      const who = notMe(whoId);
      discover({ type: 'item', name: item });
      discover({ type: 'who', name: who });

      return `l.destroyItem({itemId: '${item}', whoId: '${who}', all: ${all === 'true' ? true : false} })`; // DestroyItemObject("variable",Protagonist,TRUE)
    },
  }, {
    regex: /(!)?(set)?global(gt|lt)?\((.*?),(.*?),([-\d]+)\)/,
    onMatch: ([line, not, set, op, variableId, envId, amount]) => {
      if (!variableId) throw new Error(`Wrong line syntax: cannot find 'variableId' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const variable = dropQuotes(variableId);
      const env = dropQuotes(envId);
      discover({ type: 'variable', name: variable, env: env, extendValueSpectreWith: parseInt(amount) });

      if (set) return `l.setValue({variableId: '${variable}', envId: '${env}', amount: ${amount}})`; // SetGlobal("variable","global",1)'

      if (!op) {
        if (not) return `l.getValue({variableId: '${variable}', envId: '${env}'}) !== ${amount}`; // !Global("variable","global",1)'
        return `l.getValue({variableId: '${variable}', envId: '${env}'}) === ${amount}`; // Global("variable","global",1)
      }

      if (not) switch (op) {
        case 'gt': return `l.getValue({variableId: '${variable}', envId: '${env}'}) <= ${amount}`; // !GlobalGT("variable","global",1)
        case 'lt': return `l.getValue({variableId: '${variable}', envId: '${env}'}) >= ${amount}`; // !GlobalLT("variable","global",1)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
      switch (op) {
        case 'gt': return `l.getValue({variableId: '${variable}', envId: '${env}'}) > ${amount}`; // GlobalGT("variable","global",1)
        case 'lt': return `l.getValue({variableId: '${variable}', envId: '${env}'}) < ${amount}`; // GlobalLT("variable","global",1)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /checkstat(gt|lt)?\((.*?),(\d+),(.*?)\)/,
    onMatch: ([line, op, whoId, amount, statId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!statId) throw new Error(`Wrong line syntax: cannot find 'statId' in '${line}'`);
      const who = notMe(whoId);
      const stat = dropQuotes(statId);
      discover({ type: 'who', name: who });
      discover({ type: 'stat', name: stat });

      if (!op) return `l.getNpcStat({whoId: '${who}', statId: '${stat}'}) === ${amount}`;
      switch (op) {
        case 'gt': return `l.getNpcStat({whoId: '${who}', statId: '${stat}'}) > ${amount}`; // CheckStatGt(Protagonist,13,DEX)
        case 'lt': return `l.getNpcStat({whoId: '${who}', statId: '${stat}'}) < ${amount}`; // CheckStatLt(Protagonist,13,DEX)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /forceattack\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, targetId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!targetId) throw new Error(`Wrong line syntax: cannot find 'targetId' in '${line}'`);
      const who = notMe(whoId);
      const target = notMe(targetId);
      discover({ type: 'who', name: who });
      discover({ type: 'who', name: target });

      return `l.attack({targetId: '${dropQuotes(target)}', whoId: '${dropQuotes(who)}', force: true})`; // ForceAttack(Protagonist,Myself) / ForceAttack("Annah",Myself)
    },
  }, {
    regex: /attack\((.*?)\)/,
    onMatch: ([line, targetId]) => {
      if (!targetId) throw new Error(`Wrong line syntax: cannot find 'targetId' in '${line}'`);
      const target = notMe(targetId);
      discover({ type: 'who', name: target });

      return `l.attack({targetId: '${dropQuotes(target)}', whoId: '${dropQuotes(myself)}'})`; // Attack(Protagonist) / Attack("Annah")
    },
  }, {
    regex: /startcutscene\((.*?)\)/,
    onMatch: ([line, sceneId]) => {
      if (!sceneId) throw new Error(`Wrong line syntax: cannot find 'sceneId' in '${line}'`);
      const scene = dropQuotes(sceneId);
      discover({ type: 'scene', name: scene });

      return `l.startCutScene({sceneId: '${scene}', checkConditions: false})`; // StartCutScene("bdcut17b")
    },
  }, {
    regex: /startcutsceneex\((.*?),(true|false)\)/,
    onMatch: ([line, sceneId, checkConditions]) => {
      if (!sceneId) throw new Error(`Wrong line syntax: cannot find 'sceneId' in '${line}'`);
      const scene = dropQuotes(sceneId);
      discover({ type: 'scene', name: scene });

      return `l.startCutScene({sceneId: '${scene}', checkConditions: ${checkConditions === 'true' ? true : false}})`; // StartCutSceneEx("bdcut17b",TRUE)
    },
  }, {
    regex: /fullheal(?:ex)?\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.fullHeal('${who}')`; // FullHeal(Protagonist)
    },
  }, {
    regex: /addexperienceparty\((\d+)\)/,
    onMatch: ([line, amount]) => {
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: 'party' });

      return `l.addExp({amount: ${amount}, whoId: 'party'})`; // AddExperienceParty(750)
    },
  }, {
    regex: /giveexperience\((.*?),(\d+)\)/,
    onMatch: ([line, whoId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.addExp({amount: ${amount}, whoId: '${who}'})`; // GiveExperience(Protagonist,750)
    },
  }, {
    regex: /(take|destroy|give)?partygold(gt|lt|global)?\((\d+)\)/,
    onMatch: ([line, op1, op2, amount]) => {
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'sound' in '${line}'`);

      if (op1) switch (op1) {
        case 'take': return `l.changeGold({amount: -${amount}, operation: 'take'})`; // TakePartyGold(10)
        case 'destroy': return `l.changeGold({amount: -${amount}, operation: 'destroy'})`; // DestroyPartyGold(10)
        case 'give': return `l.changeGold({amount: ${amount}, operation: 'give'})`; // GivePartyGold(10)
        default: throw new Error(`Operation '${op1}' is out of range in line '${line}'`);
      }

      if (op2) switch (op2) {
        case 'gt': return `l.getGold() > ${amount}`; // PartyGoldGt(2)
        case 'lt': return `l.getGold() > ${amount}`; // PartyGoldLt(2)
        default: throw new Error(`Operation '${op2}' is out of range in line '${line}'`);
      }

      return `l.getGold() === ${amount}`; // PartyGold(0)
    },
  }, {
    regex: /givegoldforce\((\d+)\)/,
    onMatch: ([line, amount]) => {
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'sound' in '${line}'`);

      return `l.changeGold({amount: ${amount}, operation: 'give', force: true})`; // GiveGoldForce(1)
    },
  }, {
    regex: /playsound(notranged)?\((.*?)\)/,
    onMatch: ([line, op, soundId]) => {
      if (!soundId) throw new Error(`Wrong line syntax: cannot find 'soundId' in '${line}'`);
      const sound = dropQuotes(soundId);
      discover({ type: 'sound', name: sound });

      return `l.playSound({soundId: '${sound}', notRanged: ${op ? true : false}})`; // PlaySoundNotRanged("sptr_01")
    },
  }, {
    regex: /permanentstatchange\("?(.*?)"?,(.*?),(.*?),(\d+)\)/,
    onMatch: ([line, whoId, statId, op, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!statId) throw new Error(`Wrong line syntax: cannot find 'statId' in '${line}'`);
      if (!op) throw new Error(`Wrong line syntax: cannot find 'op' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      const stat = dropQuotes(statId);
      discover({ type: 'who', name: who });
      discover({ type: 'stat', name: stat });

      switch (op) {
        case 'raise': return `l.changeNpcStat({whoId: '${whoId}', statId: '${stat}', amount: ${amount}})`; // PermanentStatChange(Protagonist,Pickpocket,RAISE,1)
        case 'lower': return `l.changeNpcStat({whoId: '${whoId}', statId: '${stat}', amount: -${amount}})`; // PermanentStatChange(Protagonist,ArmorClass,LOWER,1)
        case 'set': return `l.setNpcStat({whoId: '${whoId}', statId: '${stat}', amount: ${amount}})`; // PermanentStatChange("Vhail",DEX,SET,25)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /(set)?numtimestalkedto(gt|lt)?\((\d+)\)/,
    onMatch: ([line, op1, op2, amount]) => {
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);

      if (op1) switch (op1) {
        case 'set': return `l.setTimesTalkedToNpc(${amount})`; // SetNumTimesTalkedTo(0)
        default: throw new Error(`Operation '${op1}' is out of range in line '${line}'`);
      }

      if (op2) switch (op2) {
        case 'gt': return `l.getTimesTalkedToNpc() > ${amount}`; // NumTimesTalkedToGt(0)
        case 'lt': return `l.getTimesTalkedToNpc() < ${amount}`; // NumTimesTalkedToLt(0)
        default: throw new Error(`Operation '${op2}' is out of range in line '${line}'`);
      }

      return `l.getTimesTalkedToNpc() === ${amount}`; // NumTimesTalkedTo(0)
    },
  }, {
    regex: /(!)?exists\((.*?)\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `${not ? '!' : ''}l.exists('${who}')`; // Exists("trans")
    },
  }, {
    regex: /transformpartyitem\((.*?),(.*?),(\d+),(\d+),(\d+)\)/,
    onMatch: ([line, fromItemId, toItemId, charge1, charge2, charge3]) => {
      if (!fromItemId) throw new Error(`Wrong line syntax: cannot find 'fromItemId' in '${line}'`);
      if (!toItemId) throw new Error(`Wrong line syntax: cannot find 'toItemId' in '${line}'`);
      if (!charge1) throw new Error(`Wrong line syntax: cannot find 'charge1' in '${line}'`);
      if (!charge2) throw new Error(`Wrong line syntax: cannot find 'charge2' in '${line}'`);
      if (!charge3) throw new Error(`Wrong line syntax: cannot find 'charge3' in '${line}'`);
      const fromItem = dropQuotes(fromItemId);
      const toItem = dropQuotes(toItemId);
      discover({ type: 'item', name: fromItem });
      discover({ type: 'item', name: toItem });

      return `l.transformItem({fromItemId: '${fromItem}', toItemId: '${toItem}', charge1: ${charge1}, charge2: ${charge2}, charge3: ${charge3}, targetId: 'party' })`; // TransformPartyItem("tankard","tankardf",1,0,0)
    },
  }, {
    regex: /(!)?alignment\((.*?),(.*?)\)/,
    onMatch: ([line, not, whoId, alignmentId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!alignmentId) throw new Error(`Wrong line syntax: cannot find 'alignmentId' in '${line}'`);
      const who = notMe(whoId);
      const alignment = dropQuotes(alignmentId);
      discover({ type: 'who', name: who });
      discover({ type: 'alignment', name: alignment });

      return not ? `l.getAlignment('${who}') !== '${alignment}'` : `l.getAlignment('${who}') === '${alignment}'`; // Alignment(protagonist,lawful_good)
    },
  }, {
    regex: /generatemodronmaze\(\)/,
    onMatch: () => `l.generateModronMaze()`, // GenerateModronMaze()
  }, {
    regex: /numinparty(gt|lt)?\((.*?)\)/,
    onMatch: ([line, op, amount]) => {
      if (!op) return `l.countPartyMembers() === ${amount}`; // NumInParty(1)
      switch (op) {
        case 'gt': return `l.countPartyMembers() > ${amount}`; // NumInPartygt(1)
        case 'lt': return `l.countPartyMembers() < ${amount}`; // NumInPartylt(1)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /setportalcursor\((.*?),(.*?),(true|false)\)/,
    onMatch: ([line, locationId, portalId, reset]) => {
      if (!locationId) throw new Error(`Wrong line syntax: cannot find 'locationId' in '${line}'`);
      if (!portalId) throw new Error(`Wrong line syntax: cannot find 'portalId' in '${line}'`);
      if (!reset) throw new Error(`Wrong line syntax: cannot find 'reset' in '${line}'`);
      const location = dropQuotes(locationId);
      const portal = dropQuotes(portalId);
      discover({ type: 'location', name: location });
      discover({ type: 'portal', name: portal });

      return `l.setPortalCursor({locationId: '${location}', portalId: '${portal}', reset: ${reset}})`; // SetPortalCursor(\"fort_port\",portal_cursor_visible,true)
    },
  }, {
    regex: /startstore\((.*?),(.*?)\)/,
    onMatch: ([line, shopWhoId, customerWhoId]) => {
      if (!shopWhoId) throw new Error(`Wrong line syntax: cannot find 'shopWhoId' in '${line}'`);
      if (!customerWhoId) throw new Error(`Wrong line syntax: cannot find 'customerWhoId' in '${line}'`);
      const shopWho = notMe(shopWhoId);
      const customerWho = notMe(customerWhoId);
      discover({ type: 'who', name: shopWho });
      discover({ type: 'who', name: customerWho });

      return `l.trade({shopId: '${shopWho}', customerId: '${customerWho}'})`; // startstore("fell",protagonist)
    },
  }, {
    regex: /(true|false)\(\)/,
    onMatch: ([_, op]) => op === 'true' ? 'true' : 'false', // True() / False()
  }, {
    regex: /escapearea\(\)/,
    onMatch: () => `l.escapeArea()`, // EscapeArea()
  }, {
    regex: /class\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, classId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!classId) throw new Error(`Wrong line syntax: cannot find 'classId' in '${line}'`);
      const who = notMe(whoId);
      const clas = dropQuotes(classId);
      discover({ type: 'who', name: who });
      discover({ type: 'class', name: clas });

      return `l.getClass('${who}') === '${clas}'`; // Class(Myself, MAGE);
    },
  }, {
    regex: /setnamelessclass\((.*?)\)/,
    onMatch: ([line, classId]) => {
      if (!classId) throw new Error(`Wrong line syntax: cannot find 'classId' in '${line}'`);
      const clas = dropQuotes(classId);
      discover({ type: 'class', name: clas });

      return `l.setNamelessClass('${clas}')`; // SetNamelessClass(THIEF)
    },
  }, {
    regex: /setanimstate\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, animationId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!animationId) throw new Error(`Wrong line syntax: cannot find 'animationId' in '${line}'`);
      const who = notMe(whoId);
      const animation = dropQuotes(animationId);
      discover({ type: 'who', name: who });
      discover({ type: 'animation', name: animation });

      return `l.setAnimation({whoId: '${who}', animationId: '${animation}'})`; // SetAnimState(Myself,anim_mimeattack2)
    },
  }, {
    regex: /floatrebus\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.showFloatingRebusAbove('${who}')`; // FloatRebus(Myself)
    },
  }, {
    regex: /destroyself\(\)/,
    onMatch: () => `l.destroyCreature('${myself}')`,
  }, {
    regex: /deactivate\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });
      return `l.deactivate('${who}')`;
    },
  }, {
    regex: /fade(to|from)color\(\[(\d+)\.(\d+)\],(\d+)\)/,
    onMatch: ([line, op, x, y, unknown]) => {
      if (!op) throw new Error(`Wrong line syntax: cannot find 'op' in '${line}'`);
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);

      return `l.fadeColor({operation: '${op}', x: ${x}, y: ${y}, unknown: ${unknown}})`;
    },
  }, {
    regex: /kill\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.kill('${who}')`;
    },
  }, {
    regex: /sinisterpoof\((.*?),\[(\d+)\.(\d+)\],(\d+)\)/,
    onMatch: ([line, animationId, x, y, blendingMode]) => {
      if (!animationId) throw new Error(`Wrong line syntax: cannot find 'animationId' in '${line}'`);
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);
      if (!blendingMode) throw new Error(`Wrong line syntax: cannot find 'blendingMode' in '${line}'`);
      const animation = dropQuotes(animationId);
      discover({ type: 'animation', name: animation });

      return `l.playAnimation({animationId: '${animation}', x: ${x}, y: ${y}, blendingMode: ${blendingMode}})`;
    },
  }, {
    regex: /restpartyex\((\d+),(\d+),(true|false)\)/,
    onMatch: ([line, gold, hpBonus, disableMoving]) => {
      if (!gold) throw new Error(`Wrong line syntax: cannot find 'gold' in '${line}'`);
      if (!hpBonus) throw new Error(`Wrong line syntax: cannot find 'hpBonus' in '${line}'`);
      if (!disableMoving) throw new Error(`Wrong line syntax: cannot find 'disableMoving' in '${line}'`);

      return `l.rest({gold: ${gold}, hpBonus: ${hpBonus}, disableMoving: ${disableMoving}})`;
    },
  }, {
    regex: /restparty\(\)/,
    onMatch: () => `l.rest({gold: 0, hpBonus: 0, disableMoving: false})`,
  }, {
    regex: /teleportparty\((.*?),\[(\d+?)\.(\d+?)\],(\d+?)\)/,
    onMatch: ([line, locationId, x, y, face]) => {
      if (!locationId) throw new Error(`Wrong line syntax: cannot find 'locationId' in '${line}'`);
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);
      if (!face) throw new Error(`Wrong line syntax: cannot find 'face' in '${line}'`);
      const location = dropQuotes(locationId);
      discover({ type: 'location', name: location });

      return `l.teleportParty({locationId: '${location}', x: ${x}, y: ${y}, face: ${face}})`;
    },
  }, {
    regex: /changeaiscript\((.*?),(.*?)\)/,
    onMatch: ([line, scriptId, levelId]) => {
      // script may be empty in case: ChangeAiScript("",General)
      if (!scriptId) throw new Error(`Wrong line syntax: cannot find 'scriptId' in '${line}'`);
      if (!levelId) throw new Error(`Wrong line syntax: cannot find 'levelId' in '${line}'`);
      const script = dropQuotes(scriptId);
      const level = dropQuotes(levelId);
      if (script) discover({ type: 'script', name: script });
      discover({ type: 'scriptLevel', name: level });
      discover({ type: 'who', name: myself });

      return script ? `l.changeScript({whoId: '${myself}', scriptId: '${script}', 'scriptLevelId': '${level}'})` : `l.disableScript({whoId: '${myself}', 'scriptLevelId': '${level}'})`;
    },
  }, {
    regex: /joinparty(ex)?\((true|false)?\)/,
    onMatch: ([_, op, joinGroup]) => {
      discover({ type: 'who', name: myself });
      return `l.joinParty({whoId: '${myself}', again: ${op ? true : false}, joinGroup: ${joinGroup ? true : false}})`;
    },
  }, {
    regex: /setdoorlocked\((.*?),(true|false)\)/,
    onMatch: ([line, doorId, isLocked]) => {
      if (!doorId) throw new Error(`Wrong line syntax: cannot find 'doorId' in '${line}'`);
      if (!isLocked) throw new Error(`Wrong line syntax: cannot find 'isLocked' in '${line}'`);
      const door = dropQuotes(doorId);
      discover({ type: 'door', name: door });

      return `l.turnKeyInDoor({doorId: '${door}', isLocked: ${isLocked}})`;
    },
  }, {
    regex: /opendoor\((.*?)\)/,
    onMatch: ([line, doorId]) => {
      if (!doorId) throw new Error(`Wrong line syntax: cannot find 'doorId' in '${line}'`);
      const door = dropQuotes(doorId);
      discover({ type: 'door', name: door });

      return `l.openDoor('${door}')`;
    },
  }, {
    regex: /lastpersontalkedto\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.getLastNpcTalkedTo() === '${who}'`;
    },
  }, {
    regex: /leaveparty\(\)/,
    onMatch: () => `l.leaveParty()`,
  }, {
    regex: /startcutscenemode\(\)/,
    onMatch: () => `l.startCutsceneMode()`,
  }, {
    regex: /startmovie\((.*?)\)/,
    onMatch: ([line, movieId]) => {
      if (!movieId) throw new Error(`Wrong line syntax: cannot find 'movieId' in '${line}'`);
      const movie = dropQuotes(movieId);
      discover({ type: 'movie', name: movie });

      return `l.startMovie('${movie}')`;
    },
  }, {
    regex: /runawayfrom(?:ex)\((.*?),(?:(\d+)|(.*?)_ai_(.*?)),?(true|false)?\)/,
    onMatch: ([line, whoId, timeSec, timeNative, nativeMeasure, noAttack]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!timeSec && !timeNative && !nativeMeasure) throw new Error(`Wrong line syntax: cannot find 'timeSec/timeNative/nativeMeasure' in '${line}'`);
      if (timeNative && !nativeMeasure) throw new Error(`Wrong line syntax: cannot find 'nativeMeasure' for 'timeNative' in '${line}'`);
      if (!timeNative && nativeMeasure) throw new Error(`Wrong line syntax: cannot find 'timeNative' for 'nativeMeasure' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      if (timeSec) {
        discover({ type: 'timeMeasure', name: 'sec' });
        return `l.runAway({whoId: '${who}', time: ${timeSec}, timeMeasureId: 'sec', noAttack: ${noAttack === 'true' ? true : false}})`;
      }

      discover({ type: 'timeMeasure', name: nativeMeasure! });
      return `l.runAway({whoId: '${who}', time: ${nativeTimeToNumber(timeNative!)}, timeMeasureId: '${nativeMeasure}', noAttack: ${noAttack === 'true' ? true : false}})`;
    },
  }, {
    regex: /clearactions\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.clearActions('${who}')`;
    },
  }, {
    regex: /randomnum\((\d+),(\d+)\)/,
    onMatch: ([line, range, match]) => {
      if (!range) throw new Error(`Wrong line syntax: cannot find 'range' in '${line}'`);
      if (!match) throw new Error(`Wrong line syntax: cannot find 'match' in '${line}'`);
      return `l.roll(${range}) === ${match}`;
    },
  }, {
    regex: /applyspell\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, spellId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!spellId) throw new Error(`Wrong line syntax: cannot find 'spellId' in '${line}'`);
      const who = notMe(whoId);
      const spell = dropQuotes(spellId);
      discover({ type: 'who', name: who });
      discover({ type: 'spell', name: spell });
      return `l.applySpell({whoId: '${who}', spellId: '${spell}'})`; // ApplySpell(Protagonist,special_remove_sensory_touch)
    },
  }, {
    regex: /damage\((.*?),(.*?),(\d+)\)/,
    onMatch: ([line, whoId, op, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!op) throw new Error(`Wrong line syntax: cannot find 'op' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      switch (op) {
        case 'lower': return `l.damageBy({whoId: '${who}', amount: ${amount}})`; // Damage(Protagonist,LOWER,15)
        case 'raise': return `l.damageBy({whoId: '${who}', amount: -${amount}})`; // Damage(Protagonist,RAISE,15)
        case 'set': return `l.damageTo({whoId: '${who}', amount: ${amount}})`; // Damage(Protagonist,SET,15)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /hp(gt|lt)?\((.*?),(\d+)\)/,
    onMatch: ([line, op, whoId, amount]) => {
      if (!op) return `l.getHp('${whoId}') === ${amount}`;
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      switch (op) {
        case 'gt': return `l.getHp('${who}') > ${amount}`;
        case 'lt': return `l.getHp('${who}') < ${amount}`;
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /incrementproficiency\((.*?),(.*?),(\d+)\)/,
    onMatch: ([line, whoId, slotId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!slotId) throw new Error(`Wrong line syntax: cannot find 'slotId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      const slot = dropQuotes(slotId);
      discover({ type: 'who', name: who });
      discover({ type: 'slot', name: slot });

      return `l.changeWeaponProficiency({whoId: '${who}', slotId: '${slot}', amount: ${amount}})`; // IncrementProficiency(protagonist,fist,1)
    },
  }, {
    regex: /incrementextraproficiency\((.*?),([-\d]+)\)/,
    onMatch: ([line, whoId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.changeExtraProficiency({whoId: '${who}', amount: ${amount}})`; // IncrementExtraProficiency(protagonist,1);
    },
  }, {
    regex: /createcreatureatfeet\((.*?)\)/,
    onMatch: ([line, creatureWhoId]) => {
      if (!creatureWhoId) throw new Error(`Wrong line syntax: cannot find 'creatureWhoId' in '${line}'`);
      const creatureWho = notMe(creatureWhoId);
      discover({ type: 'who', name: creatureWho });
      discover({ type: 'who', name: myself });

      return `l.createCreatureNearTo({creatureWhoId: '${creatureWho}', nearToWhoId: '${myself}'})`;
    },
  }, {
    regex: /creatureinarea\((.*?)\)/,
    onMatch: ([line, locationId]) => {
      if (!locationId) throw new Error(`Wrong line syntax: cannot find 'locationId' in '${line}'`);
      const location = dropQuotes(locationId);
      discover({ type: 'location', name: location });
      discover({ type: 'who', name: myself });

      return `l.creatureInLocation({creatureWhoId: '${myself}', location: '${location}'})`; // CreatureInArea("AR0108")
    },
  }, {
    regex: /triggeractivation\((.*?),(true|false)\)/,
    onMatch: ([line, triggerId, active]) => {
      if (!triggerId) throw new Error(`Wrong line syntax: cannot find 'triggerId' in '${line}'`);
      if (!active) throw new Error(`Wrong line syntax: cannot find 'active' in '${line}'`);
      const trigger = dropQuotes(triggerId);
      discover({ type: 'trigger', name: trigger });

      return `l.changeTrigger({triggerId: '${trigger}', active: ${active}})`;
    },
  }, {
    regex: /faceobject\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });
      discover({ type: 'who', name: myself });

      return `l.faceobject({ whoId: '${myself}', to: '${who}'})`; // FaceObject(protagonist);
    },
  }, {
    regex: /proficiency(gt|lt)?\((.*?),(.*?),(\d+)\)/,
    onMatch: ([line, op, whoId, proficiency, value]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!proficiency) throw new Error(`Wrong line syntax: cannot find 'proficiency' in '${line}'`);
      if (!value) throw new Error(`Wrong line syntax: cannot find 'value' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });
      discover({ type: 'proficiency', name: proficiency });

      if (!op) return `l.getProficiency({ whoId: '${who}', proficiency: '${proficiency}'}) === ${value}`; // Proficiency(protagonist,hammer,0)

      switch (op) {
        case 'gt': return `l.getProficiency({ whoId: '${who}', proficiency: '${proficiency}'}) > ${value}`; // ProficiencyGT(protagonist,hammer,0)
        case 'lt': return `l.getProficiency({ whoId: '${who}', proficiency: '${proficiency}'}) < ${value}`; // ProficiencyLT(protagonist,hammer,0)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /proficiency(gt|lg)?\((.*?),(\d+)\)/,
    onMatch: ([line, op, whoId, value]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!value) throw new Error(`Wrong line syntax: cannot find 'value' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      if (!op) return `l.getExtraProficiencyPoints('${who}') === ${value}`; // ExtraProficiency(protagonist,0)

      switch (op) {
        case 'gt': return `l.getExtraProficiencyPoints('${who}') > ${value}`; // ExtraProficiencyGT(protagonist,0)
        case 'lt': return `l.getExtraProficiencyPoints('${who}') < ${value}`; // ExtraProficiencyLT(protagonist,0)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /(!)?range\((.*?),(\d+)\)/,
    onMatch: ([line, op, rangeIdType, range]) => {
      if (!rangeIdType) throw new Error(`Wrong line syntax: cannot find 'rangeIdType' in '${line}'`);
      if (rangeIdType !== '[enemy]') throw new Error(`Should not be possible: expect to have '[enemy]' as a first argument of the '${line}', but got '${rangeIdType}'`);
      if (!range) throw new Error(`Wrong line syntax: cannot find 'range' in '${line}'`);

      if (op) return `l.countEnemiesInRange(${range}) !== 0`; // !Range([enemy],64);
      return `l.countEnemiesInRange(${range}) === 0`; // Range([enemy],64);
    },
  }, {
    regex: /dropinventory\(\)/,
    onMatch: () => {
      return 'l.dropInventory()'; // DropInventory()
    },
  }, {
    regex: /clearallactions\(\)/,
    onMatch: () => {
      discover({ type: 'who', name: myself });
      return `l.clearAllActions('${myself}')`; // ClearAllActions()
    },
  }, {
    regex: /quitgame\((.*?),(\d+),(\d+)\)/,
    onMatch: ([line, arg1, arg2, arg3]) => {
      if (!arg1) throw new Error(`Wrong line syntax: cannot find 'arg1' in '${line}'`);
      if (!arg2) throw new Error(`Wrong line syntax: cannot find 'arg2' in '${line}'`);
      if (!arg3) throw new Error(`Wrong line syntax: cannot find 'arg3' in '${line}'`);
      // TODO [snow]: what are these args?
      return `l.quitGame({ arg1: '${arg1}', arg2: ${arg2}, arg3: ${arg3} })`; // QuitGame(FINALE,0,0)
    },
  }, {
    regex: /sinisterpoof\("(.*?)",\[(\d+)\.(\d+)\],(\d+)\)/,
    onMatch: ([line, poof, x, y, value]) => {
      if (!poof) throw new Error(`Wrong line syntax: cannot find 'poof' in '${line}'`);
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);
      if (!value) throw new Error(`Wrong line syntax: cannot find 'value' in '${line}'`);
      return `l.sinisterPoof({ poof: '${poof}', x: ${x}, y: ${y}, value: ${value}, sticky: false })`; // SinisterPoof("S113SMOK",[850.438],1)
    },
  }, {
    regex: /stickysinisterpoof\("(.*?)",(.*?),(\d+)\)/,
    onMatch: ([line, poof, whoId, value]) => {
      if (!poof) throw new Error(`Wrong line syntax: cannot find 'poof' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!value) throw new Error(`Wrong line syntax: cannot find 'value' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.sinisterPoof({ poof: '${poof}', whoId: '${who}', value: ${value}, sticky: true })`; // StickySinisterPoof("S113SMOK",Myself,1)
    },
  }, {
    regex: /bitcheck\("(.*?)","(.*?)",(.*?)\)/,
    onMatch: ([line, variableId, envId, bit]) => {
      if (!variableId) throw new Error(`Wrong line syntax: cannot find 'variableId' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      if (!bit) throw new Error(`Wrong line syntax: cannot find 'bit' in '${line}'`);
      const variable = dropQuotes(variableId);
      const env = dropQuotes(envId);
      discover({ type: 'variable', name: variable, env: env, extendValueSpectreWith: 0 });
      discover({ type: 'variable', name: bit, extendValueSpectreWith: 0 });

      return `l.checkBit({ variable: '${variable}', env: '${env}', bit: '${bit}' })`; // BitCheck("0600_status","ar0600",bit10)
    },
  }, {
    regex: /bitset\("(.*?)","(.*?)",(.*?)\)/,
    onMatch: ([line, variableId, envId, bit]) => {
      if (!variableId) throw new Error(`Wrong line syntax: cannot find 'variableId' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      if (!bit) throw new Error(`Wrong line syntax: cannot find 'bit' in '${line}'`);
      const variable = dropQuotes(variableId);
      const env = dropQuotes(envId);
      discover({ type: 'variable', name: variable, env: env, extendValueSpectreWith: 0 });
      discover({ type: 'variable', name: bit, extendValueSpectreWith: 0 });

      return `l.setBit({ variable: '${variable}', env: '${env}', bit: '${bit}' })`; // BitSet("0301_status","ar0301",bit4)
    },
  }, {
    regex: /hppercent(lt|gt)?\((.*?),(\d+)\)/,
    onMatch: ([line, op, whoId, percent]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!percent) throw new Error(`Wrong line syntax: cannot find 'percent' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      if (!op) return `l.getHpPercent('${who}') === ${percent}`; // HPPercent(protagonist,100)

      switch (op) {
        case 'gt': return `l.getHpPercent('${who}') > ${percent}`; // HPPercentGT(protagonist,100)
        case 'lt': return `l.getHpPercent('${who}') < ${percent}`; // HPPercentLT(protagonist,100)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /setglobaltimer\("(.*?)","(.*?)",(\d+)\)/,
    onMatch: ([line, timer, envId, seconds]) => {
      if (!timer) throw new Error(`Wrong line syntax: cannot find 'timer' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      const env = dropQuotes(envId);
      discover({ type: 'timer', name: timer, env: env, forceType: 'number' });

      return `l.setTimer({ timer: '${timer}', env: '${env}', seconds: ${seconds} })`; // SetGlobalTimer("no_gamble","global",4500)
    },
  }, {
    regex: /globaltimerexpired\("(.*?)","(.*?)"\)/,
    onMatch: ([line, timer, envId]) => {
      if (!timer) throw new Error(`Wrong line syntax: cannot find 'timer' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      const env = dropQuotes(envId);
      discover({ type: 'timer', name: timer, env: env, forceType: 'number' });

      return `l.timerExpired({ timer: '${timer}', env: '${env}' })`; // GlobalTimerExpired("no_gamble","global")
    },
  }, {
    regex: /stuffglobalrandom\("(.*?)","(.*?)",(\d+)\)/,
    onMatch: ([line, variable, envId, range]) => {
      if (!variable) throw new Error(`Wrong line syntax: cannot find 'variable' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      if (!range) throw new Error(`Wrong line syntax: cannot find 'range' in '${line}'`);
      const env = dropQuotes(envId);
      discover({ type: 'variable', name: variable, env: env, extendValueSpectreWith: parseInt(range), forceType: 'number' });

      return `l.setRandomValue({ variable: '${variable}', env: '${env}', from: 0, to: ${range}, inclucive: true })`; // StuffGlobalRandom("roll_1","global",1)
    },
  }, {
    regex: /polymorph\((.*?)\)/,
    onMatch: ([line, target]) => {
      if (!target) throw new Error(`Wrong line syntax: cannot find 'target' in '${line}'`);
      discover({ type: 'who', name: myself });

      return `l.polymorph({ whoId: '${myself}', target: '${target}' })`; // Polymorph(nameless_one_severed_arm)
    },
  }, {
    regex: /smallwait\((\d+)\)/,
    onMatch: ([line, seconds]) => {
      if (!seconds) throw new Error(`Wrong line syntax: cannot find 'seconds' in '${line}'`);

      return `l.sleep(${seconds})`; // SmallWait(1)
    },
  }, {
    regex: /classlevel(lt|gt)?\("?(.*?)"?,(.*?),(\d+)\)/,
    onMatch: ([line, op, whoId, classId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!classId) throw new Error(`Wrong line syntax: cannot find 'classId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const who = notMe(whoId);
      const clas = dropQuotes(classId);
      discover({ type: 'who', name: who });
      discover({ type: 'class', name: clas });

      if (!op) return `l.getClassLevel({ whoId: '${who}', classId: '${clas}' }) === ${amount}`; // ClassLevel("morte",fighter,4)

      switch (op) {
        case 'gt': return `l.getClassLevel({ whoId: '${who}', classId: '${clas}' }) > ${amount}`; // ClassLevelGT("morte",fighter,4)
        case 'lt': return `l.getClassLevel({ whoId: '${who}', classId: '${clas}' }) < ${amount}`; // ClassLevelLT("morte",fighter,4)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /moveviewpoint\(\[(\d+)\.(\d+)\],(.*?)\)/,
    onMatch: ([line, x, y, animationTime]) => {
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);
      if (!animationTime) throw new Error(`Wrong line syntax: cannot find 'animationTime' in '${line}'`);
      discover({ type: 'timeMeasure', name: animationTime });

      return `l.moveCamera({ x: ${x}, y: ${y}, animationTime: '${animationTime}' })`; // MoveViewPoint([849.1008],instant)
    },
  }, {
    regex: /movetopoint\(\[(\d+)\.(\d+)\]\)/,
    onMatch: ([line, x, y]) => {
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);

      return `l.walk({ whoId: '${myself}', x: ${x}, y: ${y} })`; // MoveToPoint([1154.3067])
    },
  }, {
    regex: /useitem\("(.*?)",(.*?)\)/,
    onMatch: ([line, itemId, whoId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const item = dropQuotes(itemId);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });
      discover({ type: 'item', name: item });

      return `l.useItem({ whoId: '${who}', itemId: '${item}' })`; // UseItem("m_gaze",protagonist)
    },
  }, {
    regex: /fixengineroom\(\)/,
    onMatch: () => {
      return `l.fixEngineRoom()`; // FixEngineRoom()
    },
  }, {
    regex: /showfirsttimehelp\(\)/,
    onMatch: () => {
      return `l.showFirstTimeHelp()`; // ShowFirstTimeHelp()
    },
  }, {
    regex: /endcutscenemode\(\)/,
    onMatch: () => {
      return `l.endCutsceneMode()`; // EndCutsceneMode()
    },
  }, {
    regex: /recoil\(\)/,
    onMatch: () => {
      return `l.recoil()`; // Recoil()
    },
  }, {
    regex: /explore\(\)/,
    onMatch: () => {
      return `l.explore()`; // Explore()
    },
  }, {
    regex: /savegame\((\d+)\)/,
    onMatch: ([line, slot]) => {
      if (!slot) throw new Error(`Wrong line syntax: cannot find 'slot' in '${line}'`);

      return `l.saveGame(${slot})`; // SaveGame(0)
    },
  }, {
    regex: /setnamelessdisguise\((.*?)\)/,
    onMatch: ([line, disguise]) => {
      if (!disguise) throw new Error(`Wrong line syntax: cannot find 'disguise' in '${line}'`);
      discover({ type: 'disguise', name: disguise });

      return `l.setDisguise({ whoId: 'nameless', disguide: '${disguise}' })`; // SetNamelessDisguise(zombie)
    },
  }, {
    regex: /createcreature\("(.*?)",\[(\d+).(\d+)\],(.*?)\)/,
    onMatch: ([line, whoId, x, y, direction]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);
      if (!direction) throw new Error(`Wrong line syntax: cannot find 'direction' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.createCreature({ whoId: '${who}', x: ${x}, y: ${y}, direction: '${parseDirection(direction)}' })`; // CreateCreature("agril",[850.438],s)
    },
  }, {
    regex: /addjournalentry\((\d+),(.*?)\)/,
    onMatch: ([line, journalId, journalType]) => {
      if (!journalId) throw new Error(`Wrong line syntax: cannot find 'journalId' in '${line}'`);
      if (!journalType) throw new Error(`Wrong line syntax: cannot find 'journalType' in '${line}'`);
      discover({ type: 'journal', name: journalId });
      discover({ type: 'journalType', name: journalType });

      return `l.addJournalEntry({ journalId: '${journalId}', type: '${journalType}' })`; // AddJournalEntry(106724,quest_done)
    },
  }, {
    regex: /erasejournalentry\((\d+)\)/,
    onMatch: ([line, journalId]) => {
      if (!journalId) throw new Error(`Wrong line syntax: cannot find 'journalId' in '${line}'`);
      discover({ type: 'journal', name: journalId });

      return `l.eraseJournalEntry('${journalId}')`; // EraseJournalEntry(59888)
    },
  }, {
    regex: /inmyarea\("(.*?)"\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.isInNpcArea({ whoId: '${whoId}', aroundNpd: '${myself}' })`; // InMyArea("morte")
    },
  }, {
    regex: /floatmessage\((.*?),(\d+)\)/,
    onMatch: ([line, whoId, messageId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!messageId) throw new Error(`Wrong line syntax: cannot find 'messageId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });
      discover({ type: 'message', name: messageId });

      return `l.showFloatMessageOver({ whoId: '${who}', messageId: '${messageId}' })`; // FloatMessage(protagonist,9621)
    },
  }, {
    regex: /killfloatmessage\("(.*?)"\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.hideFloatMessageOver('${whoId}')`; // KillFloatMessage("morte")
    },
  }, {
    regex: /changedialog\("(.*?)","(.*?)"\)/,
    onMatch: ([line, whoId, dialogueId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (dialogueId === null || dialogueId === undefined) throw new Error(`Wrong line syntax: cannot find 'dialogueId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.changeDialog({ whoId: '${whoId}', dialogueId: '${dialogueId}' })`; // ChangeDialog("sybil","")
    },
  }, {
    regex: /allegiance\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, allegianceId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (allegianceId === null || allegianceId === undefined) throw new Error(`Wrong line syntax: cannot find 'allegianceId' in '${line}'`);
      const who = notMe(whoId);
      discover({ type: 'who', name: who });

      return `l.changeAllegiance({ whoId: '${who}', allegianceId: '${allegianceId}' })`; // Allegiance(myself,enemy)
    },
  }];
};

const ie2ts = (line: string, npcLowercaseId: string, discover: DiscoverNext): string => {
  const myself = dialogueToCreatureOrItem(npcLowercaseId);

  for (const item of createItems(discover, myself)) {
    const matches = item.regex.exec(line);
    if (!matches) continue;
    return item.onMatch(matches);
  }
  return line;
};

export default ie2ts;
