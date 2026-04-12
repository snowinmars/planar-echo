import type { DiscoverNext } from '@/discoverer.types.js';

type Ie2tsItem = Readonly<{
  regex: RegExp;
  onMatch: (matches: string[]) => string;
}>;

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
  const notMe = (whoId: string) => whoId === 'myself' ? myself : whoId;

  return [{
    regex: /(!)?l\.inparty\("(.*?)"\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `${not ? '!' : ''}l.isNpcInParty('${whoId}')`; // InParty("variable")
    },
  }, {
    regex: /(!)?l\.nearbydialog\("(.*?)"\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `${not ? '!' : ''}l.isNearbyDialog('${whoId}')`; // NearbyDialog("variable")
    },
  }, {
    regex: /moraledec\("(.*?)",(\d+)\)/,
    onMatch: ([line, whoId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `l.changeMorale({whoId: '${whoId}', amount: -${amount}})`; // MoraleDec("variable",1)
    },
  }, {
    regex: /moraleinc\("(.*?)",(\d+)\)/,
    onMatch: ([line, whoId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `l.changeMorale({whoId: '${whoId}', amount: ${amount}})`;
    }, // MoraleInc("variable",1)
  }, {
    regex: /incrementglobal\("(.*?)","(.*?)",([-\d]+)\)/,
    onMatch: ([line, variable, env, amount]) => {
      if (!variable) throw new Error(`Wrong line syntax: cannot find 'variable' in '${line}'`);
      if (!env) throw new Error(`Wrong line syntax: cannot find 'env' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'variable', name: variable, env: env });

      return `l.increment({variable: '${variable}', env: '${env}', amount: ${amount}})`; // IncrementGlobal("variable","global",1)
    },
  }, {
    regex: /incrementglobalonceex\("(.*?)","(.*?)",([-\d]+)\)/,
    onMatch: ([line, key, variable, amount]) => {
      if (!key) throw new Error(`Wrong line syntax: cannot find 'key' in '${line}'`);
      if (!variable) throw new Error(`Wrong line syntax: cannot find 'variable' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'key', name: key, extendValueSpectreWith: 0 });
      discover({ type: 'variable', name: variable });

      return `l.increment({key: '${key}', variable: '${variable}', amount: ${amount}})`; // IncrementGlobal("variable","global",1)
    },
  }, {
    regex: /(!)?dead\("(.*?)"\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `${not ? '!' : ''}l.isNpcDead('${whoId}')`; // Dead("variable")
    },
  }, {
    regex: /giveitemcreate\("(.*?)",(.*?),(\d+),(\d+),(\d+)\)/,
    onMatch: ([line, itemId, whoId, amount, identified, slot]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      if (!identified) throw new Error(`Wrong line syntax: cannot find 'identified' in '${line}'`);
      if (!slot) throw new Error(`Wrong line syntax: cannot find 'slot' in '${line}'`);
      discover({ type: 'item', name: itemId });
      discover({ type: 'who', name: whoId });

      return `l.createItem({itemId: '${itemId}', whoId: '${whoId}', amount: ${amount}, identified: ${identified === '1' ? true : false}, slot: ${slot} })`; // GiveItemCreate("variable",Protagonist,1,0,0)
    },
  }, {
    regex: /createitem\("(.*?)",(\d+),(\d+),(\d+)\)/,
    onMatch: ([line, itemId, amount, identified, slot]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      if (!identified) throw new Error(`Wrong line syntax: cannot find 'identified' in '${line}'`);
      if (!slot) throw new Error(`Wrong line syntax: cannot find 'slot' in '${line}'`);
      discover({ type: 'item', name: itemId });

      return `l.createItem({itemId: '${itemId}', amount: ${amount}, identified: ${identified === '1' ? true : false}, slot: ${slot} })`; // GiveItemCreate("variable",Protagonist,1,0,0)
    },
  }, {
    regex: /(give|take)item\("(.*?)",(.*?)\)/,
    onMatch: ([line, op, itemId, whoId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'item', name: itemId });
      discover({ type: 'who', name: whoId });

      return `l.${op}Item({itemId: '${itemId}', whoId: '${whoId}' })`; // GiveItem("variable",Protagonist) / TakeItem("variable",Protagonist)
    },
  }, {
    regex: /takepartyitemnum\("(.*?)",(\d+)\)/,
    onMatch: ([line, itemId, amount]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'item', name: itemId });

      return `l.takePartyItems({itemId: '${itemId}', amount: ${amount}})`; // TakePartyItemNum("variable",1)
    },
  }, {
    regex: /(!)?hasitem\("(.*?)",(.*?)\)/,
    onMatch: ([line, not, itemId, whoId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      whoId = notMe(whoId);
      discover({ type: 'item', name: itemId });
      discover({ type: 'who', name: whoId });

      return `${not ? '!' : ''}l.hasItem({itemId: '${itemId}', whoId: '${whoId}' })`; // HasItem("variable",Myself)
    },
  }, {
    regex: /(!)?partyhasitem\("(.*?)"\)/,
    onMatch: ([line, not, itemId]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      discover({ type: 'item', name: itemId });
      discover({ type: 'who', name: 'party' });

      return `${not ? '!' : ''}l.hasItem({itemId: '${itemId}', whoId: 'party' })`; // PartyHasItem("variable")
    },
  }, {
    regex: /destroypartyitem\("(.*?)",(true|false)\)/,
    onMatch: ([line, itemId, all]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      discover({ type: 'item', name: itemId });
      discover({ type: 'who', name: 'party' });

      return `l.destroyItem({itemId: '${itemId}', whoId: 'party', all: ${all === 'true' ? true : false} })`; // DestroyPartyItem("variable",TRUE)
    },
  }, {
    regex: /destroyitemobject\("(.*?)",(.*),(true|false)\)/,
    onMatch: ([line, itemId, whoId, all]) => {
      if (!itemId) throw new Error(`Wrong line syntax: cannot find 'itemId' in '${line}'`);
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'item', name: itemId });
      discover({ type: 'who', name: whoId });

      return `l.destroyItem({itemId: '${itemId}', whoId: '${whoId}', all: ${all === 'true' ? true : false} })`; // DestroyItemObject("variable",Protagonist,TRUE)
    },
  }, {
    regex: /(!)?(set)?global(gt|lt)?\("(.*?)","(.*?)",([-\d]+)\)/,
    onMatch: ([line, not, set, op, variable, env, amount]) => {
      if (!variable) throw new Error(`Wrong line syntax: cannot find 'variable' in '${line}'`);
      if (!env) throw new Error(`Wrong line syntax: cannot find 'env' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'variable', name: variable, env: env, extendValueSpectreWith: amount });

      if (set) return `l.setValue({variable: '${variable}', env: '${env}', amount: ${amount}})`; // SetGlobal("variable","global",1)'

      if (!op) {
        if (not) return `l.getValue({variable: '${variable}', env: '${env}'}) !== ${amount}`; // !Global("variable","global",1)'
        return `l.getValue({variable: '${variable}', env: '${env}'}) === ${amount}`; // Global("variable","global",1)
      }

      if (not) switch (op) {
        case 'gt': return `l.getValue({variable: '${variable}', env: '${env}'}) <= ${amount}`; // !GlobalGT("variable","global",1)
        case 'lt': return `l.getValue({variable: '${variable}', env: '${env}'}) >= ${amount}`; // !GlobalLT("variable","global",1)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
      switch (op) {
        case 'gt': return `l.getValue({variable: '${variable}', env: '${env}'}) > ${amount}`; // GlobalGT("variable","global",1)
        case 'lt': return `l.getValue({variable: '${variable}', env: '${env}'}) < ${amount}`; // GlobalLT("variable","global",1)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /checkstat(gt|lt)?\((.*?),(\d+),(.*?)\)/,
    onMatch: ([line, op, whoId, amount, stat]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      if (!op) return `l.getNpcStat({whoId: '${whoId}', stat: '${stat}'}) === ${amount}`;
      switch (op) {
        case 'gt': return `l.getNpcStat({whoId: '${whoId}', stat: '${stat}'}) > ${amount}`; // CheckStatGt(Protagonist,13,DEX)
        case 'lt': return `l.getNpcStat({whoId: '${whoId}', stat: '${stat}'}) < ${amount}`; // CheckStatLt(Protagonist,13,DEX)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /forceattack\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, targetId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!targetId) throw new Error(`Wrong line syntax: cannot find 'targetId' in '${line}'`);
      whoId = notMe(whoId);
      targetId = targetId.replaceAll(`"`, '');
      discover({ type: 'who', name: whoId });
      discover({ type: 'who', name: targetId });

      return `l.attack({targetId: '${targetId}', whoId: '${whoId}', force: true})`; // ForceAttack(Protagonist,Myself) / ForceAttack("Annah",Myself)
    },
  }, {
    regex: /attack\((.*?)\)/,
    onMatch: ([line, targetId]) => {
      if (!targetId) throw new Error(`Wrong line syntax: cannot find 'targetId' in '${line}'`);
      targetId = targetId.replaceAll(`"`, '');
      discover({ type: 'who', name: targetId });

      return `l.attack({targetId: '${targetId}', whoId: '${myself}'})`; // Attack(Protagonist) / Attack("Annah")
    },
  }, {
    regex: /startcutscene\("(.*?)"\)/,
    onMatch: ([line, scene]) => {
      if (!scene) throw new Error(`Wrong line syntax: cannot find 'scene' in '${line}'`);
      discover({ type: 'scene', name: scene });

      return `l.startCutScene({scene: '${scene}', checkConditions: false})`; // StartCutScene("bdcut17b")
    },
  }, {
    regex: /startcutsceneex\("(.*?)",(true|false)\)/,
    onMatch: ([line, scene, checkConditions]) => {
      if (!scene) throw new Error(`Wrong line syntax: cannot find 'scene' in '${line}'`);
      discover({ type: 'scene', name: scene });

      return `l.startCutScene({scene: '${scene}', checkConditions: ${checkConditions === 'true' ? true : false}})`; // StartCutSceneEx("bdcut17b",TRUE)
    },
  }, {
    regex: /fullheal(?:ex)\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `l.fullHeal('${whoId}')`; // FullHeal(Protagonist)
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
      discover({ type: 'who', name: whoId });

      return `l.addExp({amount: ${amount}, whoId: '${whoId}'})`; // GiveExperience(Protagonist,750)
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
    regex: /playsound(notranged)?\("(.*?)"\)/,
    onMatch: ([line, op, sound]) => {
      if (!sound) throw new Error(`Wrong line syntax: cannot find 'sound' in '${line}'`);
      discover({ type: 'sound', name: sound });

      return `l.playSound({sound: '${sound}', notRanged: ${op ? true : false}})`; // PlaySoundNotRanged("sptr_01")
    },
  }, {
    regex: /permanentstatchange\((.*?),(.*?),(.*?),(\d+)\)/,
    onMatch: ([line, whoId, stat, op, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!stat) throw new Error(`Wrong line syntax: cannot find 'stat' in '${line}'`);
      if (!op) throw new Error(`Wrong line syntax: cannot find 'op' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: whoId });

      switch (op) {
        case 'raise': return `l.changeNpcStat({whoId: '${whoId}', stat: '${stat}', amount: ${amount}})`; // PermanentStatChange(Protagonist,Pickpocket,RAISE,1)
        case 'lower': return `l.changeNpcStat({whoId: '${whoId}', stat: '${stat}', amount: -${amount}})`; // PermanentStatChange(Protagonist,ArmorClass,LOWER,1)
        case 'set': return `l.setNpcStat('${whoId}', '${stat}', ${amount})`; // PermanentStatChange("Vhail",DEX,SET,25)
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
    regex: /(!)?exists\("(.*?)"\)/,
    onMatch: ([line, not, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `${not ? '!' : ''}l.exists('${whoId}')`; // Exists("trans")
    },
  }, {
    regex: /transformpartyitem\("(.*?)","(.*?)",(\d+),(\d+),(\d+)\)/,
    onMatch: ([line, fromItemId, toItemId, charge1, charge2, charge3]) => {
      if (!fromItemId) throw new Error(`Wrong line syntax: cannot find 'fromItemId' in '${line}'`);
      if (!toItemId) throw new Error(`Wrong line syntax: cannot find 'toItemId' in '${line}'`);
      if (!charge1) throw new Error(`Wrong line syntax: cannot find 'charge1' in '${line}'`);
      if (!charge2) throw new Error(`Wrong line syntax: cannot find 'charge2' in '${line}'`);
      if (!charge3) throw new Error(`Wrong line syntax: cannot find 'charge3' in '${line}'`);
      discover({ type: 'item', name: fromItemId });
      discover({ type: 'item', name: toItemId });

      return `l.transformItem({fromItemId: '${fromItemId}', toItemId: '${toItemId}', charge1: ${charge1}, charge2: ${charge2}, charge3: ${charge3}, targetId: 'party' })`; // TransformPartyItem("tankard","tankardf",1,0,0)
    },
  }, {
    regex: /(!)?alignment\((.*?),(.*?)\)/,
    onMatch: ([line, not, whoId, alignment]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!alignment) throw new Error(`Wrong line syntax: cannot find 'alignment' in '${line}'`);
      discover({ type: 'who', name: whoId });
      discover({ type: 'alignment', name: alignment });

      return not ? `l.getAlignment('${whoId}') !== '${alignment}'` : `l.getAlignment('${whoId}') === '${alignment}'`; // Alignment(protagonist,lawful_good)
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
    regex: /setportalcursor\("(.*?)",(.*?),(true|false)\)/,
    onMatch: ([line, location, portal, reset]) => {
      if (!location) throw new Error(`Wrong line syntax: cannot find 'location' in '${line}'`);
      if (!portal) throw new Error(`Wrong line syntax: cannot find 'portal' in '${line}'`);
      if (!reset) throw new Error(`Wrong line syntax: cannot find 'reset' in '${line}'`);
      discover({ type: 'location', name: location });
      discover({ type: 'portal', name: portal });

      return `l.setPortalCursor({location: '${location}', portal: '${portal}', reset: ${reset}})`; // SetPortalCursor(\"fort_port\",portal_cursor_visible,true)
    },
  }, {
    regex: /startstore\("(.*?)",(.*?)\)/,
    onMatch: ([line, shopWhoId, customerWhoId]) => {
      if (!shopWhoId) throw new Error(`Wrong line syntax: cannot find 'shopWhoId' in '${line}'`);
      if (!customerWhoId) throw new Error(`Wrong line syntax: cannot find 'customerWhoId' in '${line}'`);
      discover({ type: 'who', name: shopWhoId });
      discover({ type: 'who', name: customerWhoId });

      return `l.trade({shop: '${shopWhoId}', customer: '${customerWhoId}'})`; // startstore("fell",protagonist)
    },
  }, {
    regex: /(true|false)\(\)/,
    onMatch: ([_, op]) => op === 'true' ? 'true' : 'false', // True() / False()
  }, {
    regex: /escapearea\(\)/,
    onMatch: () => `l.escapeArea()`, // EscapeArea()
  }, {
    regex: /class\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, clas]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!clas) throw new Error(`Wrong line syntax: cannot find 'clas' in '${line}'`);
      whoId = notMe(whoId);
      discover({ type: 'who', name: whoId });
      discover({ type: 'class', name: clas });

      return `l.getClass('${whoId}') === '${clas}'`; // Class(Myself, MAGE);
    },
  }, {
    regex: /setnamelessclass\((.*?)\)/,
    onMatch: ([line, clas]) => {
      if (!clas) throw new Error(`Wrong line syntax: cannot find 'clas' in '${line}'`);
      discover({ type: 'class', name: clas });

      return `l.setNamelessClass('${clas}')`; // SetNamelessClass(THIEF)
    },
  }, {
    regex: /setanimstate\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, animation]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!animation) throw new Error(`Wrong line syntax: cannot find 'animation' in '${line}'`);
      whoId = notMe(whoId);
      discover({ type: 'who', name: whoId });
      discover({ type: 'animation', name: animation });

      return `l.setAnimation({whoId: '${whoId}', animation: '${animation}'})`; // SetAnimState(Myself,anim_mimeattack2)
    },
  }, {
    regex: /floatrebus\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      whoId = notMe(whoId);
      discover({ type: 'who', name: whoId });

      return `l.showFloatingRebusAbove('${whoId}')`; // FloatRebus(Myself)
    },
  }, {
    regex: /destroyself\(\)/,
    onMatch: () => `l.destroySelf()`,
  }, {
    regex: /deactivate\((.*?)\)/,
    onMatch: ([_, whoId]) => `l.deactivate('${whoId}')`,
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
      whoId = notMe(whoId);
      discover({ type: 'who', name: whoId });

      return `l.kill('${whoId}')`;
    },
  }, {
    regex: /sinisterpoof\("(.*?)",\[(\d+)\.(\d+)\],(\d+)\)/,
    onMatch: ([line, animation, x, y, blendingMode]) => {
      if (!animation) throw new Error(`Wrong line syntax: cannot find 'animation' in '${line}'`);
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);
      if (!blendingMode) throw new Error(`Wrong line syntax: cannot find 'blendingMode' in '${line}'`);
      discover({ type: 'animation', name: animation });

      return `l.playAnimation({animation: '${animation}', x: ${x}, y: ${y}, blendingMode: ${blendingMode}})`;
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
    regex: /teleportparty\("(.*?)",\[(\d+?)\.(\d+?)\],(\d+?)\)/,
    onMatch: ([line, location, x, y, face]) => {
      if (!location) throw new Error(`Wrong line syntax: cannot find 'location' in '${line}'`);
      if (!x) throw new Error(`Wrong line syntax: cannot find 'x' in '${line}'`);
      if (!y) throw new Error(`Wrong line syntax: cannot find 'y' in '${line}'`);
      if (!face) throw new Error(`Wrong line syntax: cannot find 'face' in '${line}'`);
      discover({ type: 'location', name: location });

      return `l.teleportParty({location: '${location}', x: ${x}, y: ${y}, face: ${face}})`;
    },
  }, {
    regex: /changeaiscript\("(.*?)",(.*?)\)/,
    onMatch: ([line, script, level]) => {
      if (!level) throw new Error(`Wrong line syntax: cannot find 'level' in '${line}'`);
      if (script) discover({ type: 'script', name: script });
      discover({ type: 'who', name: myself });

      return script ? `l.changeScript({whoId: '${myself}', script: '${script}', 'level': '${level}'})` : `l.disableScript({whoId: '${myself}', 'level': '${level}'})`;
    },
  }, {
    regex: /joinparty(ex)?\((true|false)?\)/,
    onMatch: ([_, op, joinGroup]) => {
      return `l.joinParty({again: ${op ? true : false}, joinGroup: ${joinGroup ? true : false}})`;
    },
  }, {
    regex: /setdoorlocked\("(.*?)",(true|false)\)/,
    onMatch: ([line, door, isLocked]) => {
      if (!door) throw new Error(`Wrong line syntax: cannot find 'door' in '${line}'`);
      if (!isLocked) throw new Error(`Wrong line syntax: cannot find 'isLocked' in '${line}'`);
      discover({ type: 'door', name: door });

      return `l.turnKeyInDoor({door: '${door}', isLocked: ${isLocked}})`;
    },
  }, {
    regex: /opendoor\("(.*?)"\)/,
    onMatch: ([line, door]) => {
      if (!door) throw new Error(`Wrong line syntax: cannot find 'door' in '${line}'`);
      discover({ type: 'door', name: door });

      return `l.openDoor('${door}')`;
    },
  }, {
    regex: /lastpersontalkedto\("(.*?)"\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `l.getLastNpcTalkedTo() === '${whoId}'`;
    },
  }, {
    regex: /leaveparty\(\)/,
    onMatch: () => `l.leaveParty()`,
  }, {
    regex: /startcutscenemode\(\)/,
    onMatch: () => `l.startCutsceneMode()`,
  }, {
    regex: /startmovie\("(.*?)"\)/,
    onMatch: ([line, movieId]) => {
      if (!movieId) throw new Error(`Wrong line syntax: cannot find 'movieId' in '${line}'`);
      discover({ type: 'movie', name: movieId });

      return `l.startMovie('${movieId}')`;
    },
  }, {
    regex: /runawayfrom(?:ex)\((.*?),(?:(\d+)|(.*?)_ai_(.*?)),?(true|false)?\)/,
    onMatch: ([line, whoId, timeSec, timeNative, nativeMeasure, noAttack]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!timeSec && !timeNative && !nativeMeasure) throw new Error(`Wrong line syntax: cannot find 'timeSec/timeNative/nativeMeasure' in '${line}'`);
      if (timeNative && !nativeMeasure) throw new Error(`Wrong line syntax: cannot find 'nativeMeasure' for 'timeNative' in '${line}'`);
      if (!timeNative && nativeMeasure) throw new Error(`Wrong line syntax: cannot find 'timeNative' for 'nativeMeasure' in '${line}'`);
      if (whoId === '[pc]') whoId = 'protagonist';
      discover({ type: 'who', name: whoId });

      if (timeSec) {
        discover({ type: 'timeMeasure', name: 'sec' });
        return `l.runAway({whoId: '${whoId}', time: ${timeSec}, timeMeasure: 'sec', noAttack: ${noAttack === 'true' ? true : false}})`;
      }

      discover({ type: 'timeMeasure', name: nativeMeasure! });
      return `l.runAway({whoId: '${whoId}', time: ${nativeTimeToNumber(timeNative!)}, timeMeasure: '${nativeMeasure}', noAttack: ${noAttack === 'true' ? true : false}})`;
    },
  }, {
    regex: /clearactions\((.*?)\)/,
    onMatch: ([line, whoId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `l.clearActions('${whoId}')`;
    },
  }, {
    regex: /randomnum\((\d+),(\d+)\)/,
    onMatch: ([_, range, match]) => `l.roll(${range}) === ${match}`,
  }, {
    regex: /applyspell\((.*?),(.*?)\)/,
    onMatch: ([line, whoId, spellId]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!spellId) throw new Error(`Wrong line syntax: cannot find 'spellId' in '${line}'`);
      discover({ type: 'who', name: whoId });
      discover({ type: 'spell', name: spellId });
      return `l.applySpell({whoId: '${whoId}', spellId: '${spellId}'})`; // ApplySpell(Protagonist,special_remove_sensory_touch)
    },
  }, {
    regex: /damage\((.*?),(.*?),(\d+)\)/,
    onMatch: ([line, whoId, op, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!op) throw new Error(`Wrong line syntax: cannot find 'op' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: whoId });

      switch (op) {
        case 'lower': return `l.damageBy({whoId: '${whoId}', amount: ${amount}})`; // Damage(Protagonist,LOWER,15)
        case 'raise': return `l.damageBy({whoId: '${whoId}', amount: -${amount}})`; // Damage(Protagonist,RAISE,15)
        case 'set': return `l.damageTo({whoId: '${whoId}', amount: ${amount}})`; // Damage(Protagonist,SET,15)
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /hp(gt|lt)?\((.*?),(\d+)\)/,
    onMatch: ([line, op, whoId, amount]) => {
      if (!op) return `l.getHp('${whoId}') === ${amount}`;
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: whoId });

      switch (op) {
        case 'gt': return `l.getHp('${whoId}') > ${amount}`;
        case 'lt': return `l.getHp('${whoId}') < ${amount}`;
        default: throw new Error(`Operation '${op}' is out of range in line '${line}'`);
      }
    },
  }, {
    regex: /incrementproficiency\((.*?),(.*?),(\d+)\)/,
    onMatch: ([line, whoId, slotId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!slotId) throw new Error(`Wrong line syntax: cannot find 'slotId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: whoId });
      discover({ type: 'slot', name: slotId });

      return `l.changeWeaponProficiency({whoId: '${whoId}', slotId: '${slotId}', amount: ${amount}})`; // IncrementProficiency(protagonist,fist,1)
    },
  }, {
    regex: /incrementextraproficiency\((.*?),(\d+)\)/,
    onMatch: ([line, whoId, amount]) => {
      if (!whoId) throw new Error(`Wrong line syntax: cannot find 'whoId' in '${line}'`);
      if (!amount) throw new Error(`Wrong line syntax: cannot find 'amount' in '${line}'`);
      discover({ type: 'who', name: whoId });

      return `l.changeExtraProficiency({whoId: '${whoId}', amount: ${amount}})`; // IncrementExtraProficiency(protagonist,1);
    },
  }, {
    regex: /createcreatureatfeet\((.*?)\)/,
    onMatch: ([line, creatureWhoId]) => {
      if (!creatureWhoId) throw new Error(`Wrong line syntax: cannot find 'creatureWhoId' in '${line}'`);
      discover({ type: 'who', name: creatureWhoId });
      discover({ type: 'who', name: myself });

      return `l.createCreatureNearTo({creatureWhoId: '${creatureWhoId}', nearToWhoId: '${myself}'})`;
    },
  }, {
    regex: /creatureinarea\("(.*?)"\)/,
    onMatch: ([line, location]) => {
      if (!location) throw new Error(`Wrong line syntax: cannot find 'location' in '${line}'`);
      discover({ type: 'location', name: location });
      discover({ type: 'who', name: myself });

      return `l.creatureInLocation({creatureWhoId: '${myself}', location: '${location}'})`; // CreatureInArea("AR0108")
    },
  }, {
    regex: /triggeractivation\("(.*?)",(true|false)\)/,
    onMatch: ([line, triggerId, active]) => {
      if (!triggerId) throw new Error(`Wrong line syntax: cannot find 'triggerId' in '${line}'`);
      if (!active) throw new Error(`Wrong line syntax: cannot find 'active' in '${line}'`);
      discover({ type: 'trigger', name: triggerId });

      return `l.changeTrigger({triggerId: '${triggerId}', active: ${active}})`;
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
