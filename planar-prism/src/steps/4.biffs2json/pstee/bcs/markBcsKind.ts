import type { RawDlg } from '../dlg/index.js';
import type { Bcs, BcsKind } from './parseBcs.types.js';
import type { BlockFunction } from './parseBcs.types.js';

const START_CUTSCENE_RE = /\bstartcutscene(?:ex)?\s*\(\s*"([^"]+)"/i;

const normalizeBcsResourceName = (name: string): string => {
  const lower = name.trim().toLowerCase().replaceAll(`'`, '');
  return lower.endsWith('.bcs') ? lower : `${lower}.bcs`;
};

const walkArgsForCutSceneId = (args: BlockFunction['args']): boolean => {
  for (const arg of args) {
    if (arg.kind === 'function') {
      if (arg.name === 'cutsceneid') return true;
      if (walkArgsForCutSceneId(arg.args)) return true;
    }
  }
  return false;
};

const bcsHasCutSceneId = (bcs: Bcs): boolean => {
  for (const block of bcs.blocks) {
    for (const fn of block.condition.functions) {
      if (fn.name === 'cutsceneid') return true;
      if (walkArgsForCutSceneId(fn.args)) return true;
    }
    for (const temp of block.condition.temps) {
      if (temp.value.kind === 'function' && temp.value.name === 'cutsceneid') return true;
      if (temp.value.kind === 'function' && walkArgsForCutSceneId(temp.value.args)) return true;
    }
    for (const response of block.actions) {
      for (const fn of response.functions) {
        if (fn.name === 'cutsceneid') return true;
        if (walkArgsForCutSceneId(fn.args)) return true;
      }
      for (const temp of response.temps) {
        if (temp.value.kind === 'function' && temp.value.name === 'cutsceneid') return true;
        if (temp.value.kind === 'function' && walkArgsForCutSceneId(temp.value.args)) return true;
      }
    }
  }
  return false;
};

const collectCutsceneNamesFromDlgs = (dlgs: RawDlg[]): Set<string> => {
  const names = new Set<string>();
  for (const dlg of dlgs) {
    for (const action of dlg.responsesActions.values()) {
      const text = action.text ?? '';
      for (const match of text.matchAll(new RegExp(START_CUTSCENE_RE.source, 'gi'))) {
        const raw = match[1];
        if (!raw) continue;
        names.add(normalizeBcsResourceName(raw));
      }
    }
  }
  return names;
};

export const markBcsKind = (bcsList: Bcs[], dlgs: RawDlg[]): Bcs[] => {
  const fromDlg = collectCutsceneNamesFromDlgs(dlgs);

  return bcsList.map((bcs) => {
    let kind: BcsKind = 'ai';
    const resource = normalizeBcsResourceName(bcs.resourceName);
    if (fromDlg.has(resource)) kind = 'cutscene';
    if (bcsHasCutSceneId(bcs)) kind = 'cutscene';
    return { ...bcs, kind };
  });
};
