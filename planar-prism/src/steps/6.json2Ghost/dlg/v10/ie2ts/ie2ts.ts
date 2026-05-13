import type { DiscoverNext } from '@/discoverer.types.js';

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
    default: throw new Error(`Native time '${x}' if out of range`);
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

      return `l.changeMorale({whoId: '${who}', amount: ${amount}})`;
    }, // MoraleInc("variable",1)
  }, {
    regex: /incrementglobal\((.*?),(.*?),([-\d]+)\)/,
    onMatch: ([line, variableId, envId, amount]) => {
      if (!variableId) throw new Error(`Wrong line syntax: cannot find 'variableId' in '${line}'`);
      if (!envId) throw new Error(`Wrong line syntax: cannot find 'envId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      const variable = dropQuotes(variableId);
      const env = dropQuotes(envId);
      discover({ type: 'variable', name: variable, env: env, extendValueSpectreWith: parseInt(amount) });

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
      discover({ type: 'key', name: key, extendValueSpectreWith: 0 });
      discover({ type: 'variable', name: variable, extendValueSpectreWith: parseInt(amount) });

      return `l.increment({key: '${key}', variableId: '${variable}', amount: ${amount}})`; // IncrementGlobal("variable","global",1)
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

      return `l.attack({targetId: '${target}', whoId: '${who}', force: true})`; // ForceAttack(Protagonist,Myself) / ForceAttack("Annah",Myself)
    },
  }, {
    regex: /attack\((.*?)\)/,
    onMatch: ([line, targetId]) => {
      if (!targetId) throw new Error(`Wrong line syntax: cannot find 'targetId' in '${line}'`);
      const target = notMe(targetId);
      discover({ type: 'who', name: target });

      return `l.attack({targetId: '${target}', whoId: '${myself}'})`; // Attack(Protagonist) / Attack("Annah")
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
    regex: /fullheal(?:ex)\((.*?)\)/,
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
    regex: /permanentstatchange\((.*?),(.*?),(.*?),(\d+)\)/,
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
    onMatch: () => `l.destroySelf()`,
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
    regex: /incrementextraproficiency\((.*?),(\d+)\)/,
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
  }];
};

const ie2ts = (line: string, myself: string, discover: DiscoverNext): string => {
  for (const item of createItems(discover, myself)) {
    const matches = item.regex.exec(line);
    if (!matches) continue;
    return item.onMatch(matches);
  }
  return line;
};

export default ie2ts;
